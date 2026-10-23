// One-time script: moves images that are still stored locally
// (provider: "local") to the currently configured upload provider (Cloudinary).
//
// It does the same thing as "Replace media" in the Media Library:
// the image keeps its id, so it stays linked to its piece/event.
// Local files are NOT deleted (cross-provider replace leaves the old file alone).
//
// Usage (from backend/, with Strapi STOPPED):
//   node scripts/migrate-uploads-to-cloudinary.cjs            -> dry run, changes nothing
//   node scripts/migrate-uploads-to-cloudinary.cjs --run      -> actually migrates
//
// Optional: --folder "Sample Images"   (default) Media Library folder to move them into
//           --folder none                keep files in their current folder

const fs = require('fs');
const path = require('path');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

const args = process.argv.slice(2);
const RUN = args.includes('--run');
const folderArgIndex = args.indexOf('--folder');
const FOLDER_NAME = folderArgIndex !== -1 ? args[folderArgIndex + 1] : 'Sample Images';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    const provider = app.config.get('plugin::upload.provider') || app.config.get('plugin.upload.provider');
    console.log(`Configured upload provider: ${provider}`);
    if (provider !== 'cloudinary') {
      console.error('✋ Upload provider is not "cloudinary". Check config/plugins.ts and .env, then try again.');
      return;
    }

    let folderId;
    if (FOLDER_NAME && FOLDER_NAME !== 'none') {
      const folder = await app.db.query('plugin::upload.folder').findOne({ where: { name: FOLDER_NAME } });
      if (!folder) {
        console.error(`✋ Media Library folder "${FOLDER_NAME}" not found. Create it first, or pass --folder none.`);
        return;
      }
      folderId = folder.id;
      console.log(`Moving into folder: ${FOLDER_NAME} (id ${folderId})`);
    }

    const files = await app.db.query('plugin::upload.file').findMany({ where: { provider: 'local' } });
    console.log(`Found ${files.length} local file(s).\n${RUN ? 'MIGRATING' : 'DRY RUN (nothing will change) — add --run to migrate'}\n`);

    const uploadService = app.plugin('upload').service('upload');
    const missing = [];
    let migrated = 0;
    let failed = 0;

    for (const file of files) {
      const localName = path.basename(file.url); // e.g. butterfly_necklace_16c23843c6.jpg
      const filepath = path.join(UPLOADS_DIR, localName);

      if (!fs.existsSync(filepath)) {
        missing.push(`${file.name}  (${localName})`);
        continue;
      }

      if (!RUN) {
        console.log(`  would migrate: ${file.name}  <- ${localName}`);
        continue;
      }

      try {
        const fileInfo = {
          name: file.name,
          alternativeText: file.alternativeText,
          caption: file.caption,
        };
        if (folderId) fileInfo.folder = folderId;

        const updated = await uploadService.replace(file.id, {
          data: { fileInfo },
          file: {
            filepath,
            originalFilename: localName,
            mimetype: file.mime,
            size: fs.statSync(filepath).size,
          },
        });
        migrated++;
        console.log(`  ✓ ${file.name}  ->  ${updated.url}`);
      } catch (err) {
        failed++;
        console.error(`  ✗ ${file.name}: ${err.message}`);
      }
    }

    console.log('\n--- Summary ---');
    if (RUN) console.log(`Migrated: ${migrated}   Failed: ${failed}`);
    console.log(`Missing locally (need the original from whoever uploaded it): ${missing.length}`);
    missing.forEach((m) => console.log(`  - ${m}`));
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

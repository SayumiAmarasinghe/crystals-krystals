// Blocks starting Strapi if main has schema changes you don't have.
// Strapi syncs the shared database to YOUR local schema files on startup,
// so running with outdated files can delete tables for everyone.
const { execSync } = require("child_process");

const SCHEMA_PATHS = "src/api src/components src/extensions";

const run = (cmd) =>
  execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();

const stop = (msg) => {
  console.error(
    `\n✋ ${msg}\n   (Strapi would sync the shared database to your older files and could delete data.)\n`,
  );
  process.exit(1);
};

try {
  run("git fetch --quiet origin");
} catch {
  console.warn(
    "⚠️  Could not reach GitHub to check for schema changes. Starting anyway.",
  );
  process.exit(0);
}

let branch = "HEAD";
try {
  branch = run("git rev-parse --abbrev-ref HEAD");
} catch {}

// 1. Schema changes on origin/main that this branch doesn't have (works on any branch)
let missingFromMain = "0";
try {
  missingFromMain = run(
    `git rev-list --count HEAD..origin/main -- ${SCHEMA_PATHS}`,
  );
} catch {
  console.warn("⚠️  Could not compare with origin/main. Skipping that check.");
}
if (missingFromMain !== "0") {
  stop(
    branch === "main"
      ? `main has ${missingFromMain} schema change(s) you don't have yet. Run "git pull" first.`
      : `main has ${missingFromMain} schema change(s) that "${branch}" doesn't have. Run "git pull origin main" first.`,
  );
}

// 2. Schema changes on this branch's own remote that you haven't pulled
let missingFromUpstream = "0";
try {
  missingFromUpstream = run(
    `git rev-list --count HEAD..@{u} -- ${SCHEMA_PATHS}`,
  );
} catch {
  // No upstream (local-only branch) - nothing to check.
}
if (missingFromUpstream !== "0") {
  stop(
    `"${branch}" has ${missingFromUpstream} schema change(s) on GitHub you haven't pulled. Run "git pull" first.`,
  );
}

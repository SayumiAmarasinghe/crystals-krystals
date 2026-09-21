/**
 * utils.js
 *
 * Shared helpers for talking to the Strapi backend and reading its data shapes.
 * Strapi can return data in different shapes depending on version/config
 * (flat fields vs. nested `attributes`), so these helpers hide that so
 * components don't have to guess.
 *
 * Usage:
 * import { 
 *    STRAPI_URL, 
 *    fetchPiecesByCategory, 
 *    fetchCategories, 
 *    fetchPieceById,
 *    fetchCategoryById,
 *    fetchAboutPage,
 *    getPieceName,
 *    getPieceDescription, 
 *    getPieceCollection, 
 *    getPiecePhotoUrl, 
 *    getPieceDocumentId,
 *    getPlainText 
 * } from '../utils.js';
 * 
 */



// Base URL of the Strapi backend. Falls back to localhost for local dev.
// Set VITE_STRAPI_URL in your .env file for staging/production.
export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";



/**
 * fetchPiecesByCategory(categoryTitle)
 * ---------------------------------------------------------------------------
 * Fetches only the pieces belonging to a given category, using Strapi's
 * own filter query param instead of downloading every piece and filtering
 * in JavaScript. This is faster (less data over the wire, no unused images)
 * and is the recommended way to get category items — don't fetch all
 * pieces and filter client-side.
 *
 * @param {string} categoryTitle - category name to filter by, e.g. "Earrings"
 * @returns {Promise<Array>} array of piece objects (empty array if none found)
 * @throws {Error} if the request fails
 *
 * Example: const pieces = await fetchPiecesByCategory("Earrings");
 */
export async function fetchPiecesByCategory(categoryTitle) {
  const url = `${STRAPI_URL}/api/pieces?populate=*&filters[category][Name][$eq]=${encodeURIComponent(categoryTitle)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load items');
  const data = await res.json();
  return data.data || [];
}



/**
 * fetchCategories()
 * ---------------------------------------------------------------------------
 * Fetches all categories (e.g. "Earrings", "Necklaces", "Rings",
 * "Miscellaneous"). Useful for building a nav menu or category picker
 * without hardcoding category names as strings across multiple pages —
 * hardcoded strings can typo silently (a typo just shows an empty grid,
 * not an error).
 *
 * @returns {Promise<Array>} array of category objects
 * @throws {Error} if the request fails
 *
 * Example: const categories = await fetchCategories();
 */
export async function fetchCategories() {
  const res = await fetch(`${STRAPI_URL}/api/categories?populate=*`);
  if (!res.ok) throw new Error('Failed to load categories');
  const data = await res.json();
  return data.data || [];
}



/**
 * fetchPieceById(documentId)
 * ---------------------------------------------------------------------------
 * Fetches a single piece by its Strapi v5 documentId (not the numeric id).
 * documentId is the stable identifier Strapi v5 recommends for API calls —
 * it stays the same across draft/published versions of a piece, whereas
 * the numeric id can differ between them. Use this for a product detail
 * page (e.g. when a user clicks a card in the grid/slider).
 *
 * @param {string} documentId - the piece's documentId (piece.documentId), not id
 * @returns {Promise<Object|null>} the piece object, or null if not found
 * @throws {Error} if the request fails
 *
 * Example: const piece = await fetchPieceById(piece.documentId);
 */
export async function fetchPieceById(documentId) {
  const res = await fetch(`${STRAPI_URL}/api/pieces/${documentId}?populate=*`);
  if (!res.ok) throw new Error('Failed to load item');
  const data = await res.json();
  return data.data || null;
}



/**
 * fetchCategoryById(documentId)
 * ---------------------------------------------------------------------------
 * Fetches a single category by its Strapi v5 documentId (not numeric id),
 * including its own Description and (when populated) its pieces. For the
 * common case of "show me pieces in category X", use
 * fetchPiecesByCategory() instead.
 *
 * @param {string} documentId - the category's documentId, not id
 * @returns {Promise<Object|null>} the category object, or null if not found
 * @throws {Error} if the request fails
 *
 * Example: const category = await fetchCategoryById(category.documentId);
 */
export async function fetchCategoryById(documentId) {
  const res = await fetch(`${STRAPI_URL}/api/categories/${documentId}?populate=*`);
  if (!res.ok) throw new Error('Failed to load category');
  const data = await res.json();
  return data.data || null;
}



/**
 * fetchAboutPage()
 * ---------------------------------------------------------------------------
 * Fetches the About page content.
 *
 * IMPORTANT: unlike every other endpoint in this file, About is a Strapi
 * "single type" (there's only ever one About page, not a list). That means
 * the response shape is different: `data` comes back as a plain OBJECT,
 * not an array. Do NOT reuse the `data.data || []` pattern from the other
 * fetch* functions here — there's no array to map over.
 *
 * @returns {Promise<Object|null>} the About page object, or null if not found
 * @throws {Error} if the request fails
 *
 * Example:
 *   const about = await fetchAboutPage();
 *   <p>{getPlainText(about?.Description)}</p>
 */
export async function fetchAboutPage() {
  const res = await fetch(`${STRAPI_URL}/api/about?populate=*`);
  if (!res.ok) throw new Error('Failed to load about page');
  const data = await res.json();
  return data.data || null; // note: object, not array — see comment above
}



/**
 * getPlainText(blocks)
 * ---------------------------------------------------------------------------
 * Converts Strapi's rich-text "blocks" format into a single plain-text string.
 * Use this whenever you need to display a rich-text field (like Description)
 * as plain text, e.g. in a <p> tag.
 *
 * @param {Array} blocks - the raw rich-text value from Strapi (an array of block objects)
 * @returns {string} plain text, paragraphs joined by line breaks
 *
 * Example: <p>{getPlainText(piece.Description)}</p>
 */
export const getPlainText = (blocks) => {
  // Return an empty string if there are no blocks
  if (!blocks || !Array.isArray(blocks)) return ''; 

  return blocks.map(block => {
    // Check if the block has children before trying to map them
    if (!block.children) return '';
    
    // Combine all the text pieces within a single paragraph/block
    return block.children.map(child => child.text || '').join('');
  }).join('\n'); // Join the separate paragraphs with a line break
};



/**
 * getPieceName(piece)
 * ---------------------------------------------------------------------------
 * Reads the display name off a single "piece" item.
 *
 * Note: this project's Strapi backend (v5) returns flat fields
 * (piece.Name), not the nested `attributes.Name` shape from older
 * Strapi v4. The `piece.attributes?.Name` fallback below is defensive
 * in case that ever changes — you shouldn't normally hit it here.
 *
 * @param {Object} piece - a single item from the /api/pieces response
 * @returns {string|undefined}
 *
 * Example: const name = getPieceName(piece);
 */
export function getPieceName(piece) {
  return piece.Name || piece.attributes?.Name;
}



/**
 * getPieceDescription(piece)
 * ---------------------------------------------------------------------------
 * Reads the raw rich-text Description field off a piece. Pass the result
 * into getPlainText() to render it as a string.
 *
 * @param {Object} piece
 * @returns {Array|undefined} rich-text blocks, or undefined if missing
 *
 * Example: getPlainText(getPieceDescription(piece))
 */
export function getPieceDescription(piece) {
  return piece.Description || piece.attributes?.Description;
}



/**
 * getPieceCollection(piece)
 * ---------------------------------------------------------------------------
 * Reads the optional Collection name off a piece (e.g. "Enchanted Sisters",
 * "Divine and Golden"). Not every piece belongs to a collection, so this
 * can return null — always check before rendering it.
 *
 * @param {Object} piece
 * @returns {string|null}
 *
 * Example: {getPieceCollection(piece) && <span>{getPieceCollection(piece)}</span>}
 */
export function getPieceCollection(piece) {
  return piece.Collection || piece.attributes?.Collection || null;
}



/**
 * getPiecePhotoUrl(piece)
 * ---------------------------------------------------------------------------
 * Returns a ready-to-use, full image URL (STRAPI_URL + path) for a piece's
 * first photo, preferring the "medium" format, then "thumbnail", then the
 * original. Photo is always an array in Strapi (even for a single image),
 * so this always reads the first entry.
 *
 * @param {Object} piece
 * @returns {string|null} full image URL, or null if there's no photo
 *
 * Example: <img src={getPiecePhotoUrl(piece)} />
 */
export function getPiecePhotoUrl(piece) {
  const photos = piece.Photo || piece.attributes?.Photo?.data || [];
  const firstPhoto = Array.isArray(photos) ? photos[0] : photos;
  const path =
    firstPhoto?.formats?.medium?.url ||
    firstPhoto?.formats?.thumbnail?.url ||
    firstPhoto?.url ||
    firstPhoto?.attributes?.url;
  return path ? `${STRAPI_URL}${path}` : null;
}



/**
 * getPieceDocumentId(piece)
 * ---------------------------------------------------------------------------
 * Reads the piece's documentId — the stable identifier to use when building
 * links or calling fetchPieceById(), rather than piece.id (the numeric id
 * can change between draft/published versions in Strapi v5).
 *
 * @param {Object} piece
 * @returns {string|undefined}
 *
 * Example: <Link to={`/pieces/${getPieceDocumentId(piece)}`}>
 */
export function getPieceDocumentId(piece) {
  return piece.documentId;
}
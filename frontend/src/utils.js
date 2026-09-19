export const STRAPI_URL = "http://localhost:1337";

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

/**
 * usePiecesByCategory.js
 *
 * Custom hook that fetches pieces by category, material, or featured status,
 * using Strapi's server-side filter (via fetchPiecesByCategory) rather
 * than downloading everything and filtering in JS. Handles loading and
 * error state so you don't have to write that logic in every component
 * that needs a category's items.
 *
 * This is the one place fetch logic lives — any new display component
 * (grid, slider, list, etc.) should use this hook rather than fetching
 * from Strapi directly.
 *
 * Usage:
 *   import { usePiecesByCategory } from '../hooks/usePiecesByCategory.js';
 *
 *   // By category:
 *   const { items, loading, error } = usePiecesByCategory("Earrings", "Gold");
 *
 *   // Featured pieces for the home page:
 *   const { items, loading, error } = usePiecesByCategory(null, null, true);
 *
 * @param {string|null} categoryTitle - category name to filter by, e.g. "Earrings"
 * @param {string|null} [material] - optional material filter
 * @param {boolean} [featured=false] - when true, fetches only featured pieces
 * @returns {{ items: Array, loading: boolean, error: string|null }}
 */
import { useState, useEffect } from "react";
import { fetchPiecesByCategory } from "../utils.js";

export function usePiecesByCategory(categoryTitle, material, featured = false) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guards against setting state after this effect has been cleaned up
    // (e.g. if categoryTitle or featured changes again before the fetch finishes).
    let cancelled = false;

    async function loadPieces() {
      try {
        setLoading(true);
        setError(null);

        const pieces = await fetchPiecesByCategory(
          categoryTitle,
          material,
          featured,
        );

        if (!cancelled) setItems(pieces);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPieces();
    return () => {
      cancelled = true;
    };
  }, [categoryTitle, material, featured]);

  return { items, loading, error };
}
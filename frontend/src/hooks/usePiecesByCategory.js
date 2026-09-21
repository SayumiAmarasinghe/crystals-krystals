/**
 * usePiecesByCategory.js
 *
 * Custom hook that fetches all pieces in a single category by name,
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
 *   function MyComponent({ categoryTitle }) {
 *     const { items, loading, error } = usePiecesByCategory(categoryTitle);
 * 
 *     if (loading) return <p>Loading...</p>;
 *     if (error) return <p>{error}</p>;
 * 
 *     return items.map(item => ...);
 *   }
 *
 * @param {string} categoryTitle - category name to filter by, e.g. "Earrings"
 * @returns {{ items: Array, loading: boolean, error: string|null }}
 */
import { useState, useEffect } from 'react';
import { fetchPiecesByCategory } from '../utils.js';

export function usePiecesByCategory(categoryTitle) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guards against setting state after this effect has been cleaned up
    // (e.g. if categoryTitle changes again before the fetch finishes).
    let cancelled = false;

    async function loadPieces() {
      try {
        setLoading(true);
        setError(null);

        const pieces = await fetchPiecesByCategory(categoryTitle);

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
  }, [categoryTitle]);

  return { items, loading, error };
}
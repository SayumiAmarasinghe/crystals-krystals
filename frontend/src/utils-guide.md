# Using `utils.js` — A Beginner's Guide

`utils.js` is a helper file that handles all the messy parts of talking to
our Strapi backend, so you don't have to write `fetch()` calls or dig
through nested JSON yourself. This guide walks through what's in it and
how to use each piece.

---

## Why this file exists

Without `utils.js`, every component that needs jewelry data would have to:
- know the Strapi URL
- write its own `fetch()` call
- know the exact shape of Strapi's JSON response
- handle loading/error states
- know that `Description` isn't a plain string, it's a weird array
- know that images need the base URL glued onto them

That's a lot to repeat in every component, and a lot of ways to get it
wrong. `utils.js` does all of that once, correctly, so you just import a
function and use it.

---

## Step 1: Import what you need

At the top of your component, import only the functions you're actually
going to use:

```javascript
import {
  fetchPiecesByCategory,
  getPieceName,
  getPieceDescription,
  getPiecePhotoUrl,
  getPlainText,
} from '../utils.js';
```

You don't need to import everything — just the specific functions your
component uses.

---

## Step 2: Fetching data

These functions go get data from Strapi. They're all `async`, so you use
`await` (usually inside a `useEffect` or a custom hook).

| Function | What it gets you |
|---|---|
| `fetchPiecesByCategory("Earrings")` | All pieces in one category |
| `fetchCategories()` | The list of all categories (Earrings, Necklaces, etc.) |
| `fetchPieceById(documentId)` | One specific piece (for a detail page) |
| `fetchCategoryById(documentId)` | One specific category |
| `fetchAboutPage()` | The About page content |

### Example

```javascript
const pieces = await fetchPiecesByCategory("Earrings");
// pieces is now an array of piece objects, ready to use
```

> 💡 **Tip:** If you're building a new component that shows pieces by
> category, you probably don't need to call `fetchPiecesByCategory`
> directly — use the `usePiecesByCategory` hook instead (see below). It
> already handles loading and error states for you.

### ⚠️ One exception: `fetchAboutPage()`

Every other `fetch*` function returns an **array** (a list of pieces or
categories). `fetchAboutPage()` is different — it returns a single
**object**, because there's only ever one About page. Don't try to `.map()`
over it or treat it like a list.

```javascript
const about = await fetchAboutPage();
console.log(about.Name); // ✅ direct object access
```

---

## Step 3: Reading fields off a piece

Once you have a piece object (from `fetchPiecesByCategory`, for example),
use these functions to safely read its fields. Don't reach into
`piece.Name` or `piece.Photo` directly — use the helpers instead.

| Function | Returns | Notes |
|---|---|---|
| `getPieceName(piece)` | string | The piece's name |
| `getPieceDescription(piece)` | array | Raw rich-text — pass to `getPlainText()` before displaying |
| `getPieceCollection(piece)` | string or `null` | Not every piece has one — always check before showing it |
| `getPiecePhotoUrl(piece)` | string or `null` | A ready-to-use image URL — no need to add the base URL yourself |
| `getPieceDocumentId(piece)` | string | Use this (not `piece.id`) when building links or calling `fetchPieceById()` |

### Why use these instead of `piece.Name` directly?

Two reasons:

1. **Safety.** Some fields (like `Collection`) can be missing. The helper
   handles that so you don't get a crash or `undefined` showing up on the
   page.
2. **Consistency.** If the way Strapi structures its data ever changes,
   we only have to fix it in one place (`utils.js`) instead of hunting
   through every component that touches piece data.

### Example: rendering a card

```jsx
const name = getPieceName(piece);
const description = getPieceDescription(piece);
const photoUrl = getPiecePhotoUrl(piece);

return (
  <div className="product-card">
    {photoUrl ? (
      <img src={photoUrl} alt={name} />
    ) : (
      <div>No Image</div>
    )}
    <h3>{name}</h3>
    <p>{getPlainText(description)}</p>
  </div>
);
```

---

## Step 4: Description text needs one extra step

`Description` (and `Notes`) come back from Strapi as a "rich text" format,
not a plain string. It looks like this under the hood:

```json
[
  {
    "type": "paragraph",
    "children": [{ "text": "This is the description." }]
  }
]
```

You can't just drop that into a `<p>` tag — it'll show broken text or
crash your component. Always pass it through `getPlainText()` first:

```jsx
// ❌ Wrong — will not display correctly
<p>{getPieceDescription(piece)}</p>

// ✅ Right
<p>{getPlainText(getPieceDescription(piece))}</p>
```

---

## Step 5: Use `documentId`, not `id`, when calling the API again

Every piece and category has two identifiers:

- `piece.id` — a plain number, fine for React's `key` prop in a list
- `piece.documentId` — the identifier Strapi wants when you fetch that
  *specific* item again later (like for a detail page)

```jsx
// ✅ fine — id is only used for React's key here, not an API call
{items.map((piece) => <ProductCard key={piece.id} piece={piece} />)}

// ✅ correct — use documentId when calling the API for one specific item
const piece = await fetchPieceById(getPieceDocumentId(piece));
```

---

## Step 6: Don't fetch directly — use the hook instead

If you're building a component that shows pieces for a category (a grid,
a slider, a list — anything), don't call `fetchPiecesByCategory` and
manage `useState`/`useEffect` yourself. Use the existing hook:

```jsx
import { usePiecesByCategory } from '../hooks/usePiecesByCategory.js';

function MyComponent({ categoryTitle }) {
  const { items, loading, error } = usePiecesByCategory(categoryTitle);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return items.map((piece) => (
    <div key={piece.id}>{getPieceName(piece)}</div>
  ));
}
```

This hook already calls `fetchPiecesByCategory` for you and handles all
the loading/error bookkeeping — you only need to worry about how to
*display* the pieces, not how to *fetch* them.

---

## Quick reference

```javascript
// Fetching
await fetchPiecesByCategory("Earrings")   // array of pieces
await fetchCategories()                   // array of categories
await fetchPieceById(documentId)          // one piece (object)
await fetchCategoryById(documentId)       // one category (object)
await fetchAboutPage()                    // the About page (object, not array!)

// Reading a piece's fields
getPieceName(piece)          // string
getPieceDescription(piece)   // rich-text array — wrap in getPlainText()
getPieceCollection(piece)    // string or null
getPiecePhotoUrl(piece)      // full image URL or null
getPieceDocumentId(piece)    // string — use for API calls, not piece.id

// Rendering rich text
getPlainText(blocks)         // converts rich-text array to a plain string
```

---

## Common mistakes to avoid

- ❌ Rendering `getPieceDescription(piece)` directly without `getPlainText()`
- ❌ Treating `fetchAboutPage()`'s result as an array
- ❌ Using `piece.id` when calling `fetchPieceById()` (use `documentId` instead)
- ❌ Forgetting that `getPieceCollection()` can return `null` — always
  check before rendering: `{getPieceCollection(piece) && <span>...</span>}`
- ❌ Writing a new `fetch()` call from scratch when a helper already
  exists for what you need — check this file first!

If you're not sure whether a helper exists for something, hover over any
imported function name in your editor — the comment above each function
in `utils.js` will pop up and explain what it does and how to use it.

# API Documentation

The backend (Strapi) provides a REST API that the frontend (React) uses to get data. Instead of hardcoding jewelry names, descriptions, and images into your React components, you'll fetch them from the API. This means Crystal can update her content through the Strapi admin panel without touching any code.

## Base URL

When running locally:

```
http://localhost:1337
```

## The Golden Rule: `?populate=*`

Every request needs `?populate=*` at the end. Without it, you'll get back IDs instead of actual data for images and relationships.

```
❌  /api/pieces              → no images, no category
✅  /api/pieces?populate=*   → images, category, everything
```

---

## Endpoints

### Get all pieces

```
GET http://localhost:1337/api/pieces?populate=*
```

### Get a single piece

```
GET http://localhost:1337/api/pieces/:id?populate=*
```

Replace `:id` with the actual piece ID, for example:

```
GET http://localhost:1337/api/pieces/1?populate=*
```

### Get all categories

```
GET http://localhost:1337/api/categories?populate=*
```

This returns categories with their pieces included - useful for building category pages.

### Get a single category

```
GET http://localhost:1337/api/categories/:id?populate=*
```

### Get About page content

```
GET http://localhost:1337/api/about?populate=*
```

This is a single type (one About page, not a list), so the response shape is slightly different - `data` is an object, not an array.

---

## Response Shapes

### Piece

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123def456",
      "Name": "Night Sky Dangles",
      "Description": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Second set of my Enchanted Sisters Collection."
            }
          ]
        }
      ],
      "Notes": null,
      "Collection": "Enchanted Sisters",
      "Photo": [
        {
          "url": "/uploads/night_sky_dangles_abc123.jpg",
          "width": 1080,
          "height": 1080,
          "formats": {
            "thumbnail": {
              "url": "/uploads/thumbnail_night_sky_dangles_abc123.jpg"
            }
          }
        }
      ],
      "category": {
        "id": 1,
        "Name": "Earrings",
        "Description": null
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 7
    }
  }
}
```

### Category

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "xyz789",
      "Name": "Earrings",
      "Description": null,
      "pieces": [
        {
          "id": 1,
          "Name": "Night Sky Dangles",
          "Description": [...],
          "Collection": "Enchanted Sisters"
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

---

## Field Reference

### Piece fields

|Field|Type|Notes|
|---|---|---|
|`Name`|string|Always present|
|`Description`|blocks (array)|Not a plain string - see "Working with Description" below|
|`Notes`|blocks (array)|Optional, can be `null`|
|`Collection`|string|Optional, can be `null`. Examples: "Divine and Golden", "Arm Cuff Series"|
|`Photo`|array of objects|1-2 images per piece. Use `.url` for the image path|
|`category`|object|Single object (not an array). Has `id`, `Name`, `Description`|

### Category fields

|Field|Type|Notes|
|---|---|---|
|`Name`|string|"Earrings", "Necklaces", "Rings", "Miscellaneous"|
|`Description`|rich text|Optional, can be `null`|
|`pieces`|array|All pieces in this category (when using `populate=*`)|

---

## Working with Description

`Description` is a **blocks** field, not a plain string. It comes back as an array of paragraph objects:

```json
[
  {
    "type": "paragraph",
    "children": [
      { "type": "text", "text": "This is the description text." }
    ]
  }
]
```

To display it as plain text in React, you need to extract the text:

```jsx
// Simple helper to extract text from a blocks field
function getPlainText(blocks) {
  if (!blocks) return '';
  return blocks
    .map(block => block.children.map(child => child.text).join(''))
    .join('\n');
}

// Usage in a component
<p>{getPlainText(piece.Description)}</p>
```

---

## Working with Images

Image URLs from Strapi are **relative** - they don't include the base URL. You need to prepend it.

```jsx
const STRAPI_URL = 'http://localhost:1337';

// Full image
<img src={`${STRAPI_URL}${piece.Photo[0].url}`} alt={piece.Name} />

// Thumbnail (smaller, loads faster)
<img src={`${STRAPI_URL}${piece.Photo[0].formats.thumbnail.url}`} alt={piece.Name} />
```

Tip: Put `STRAPI_URL` in a `.env` file or a config file so it's easy to change later for production.

---

## Example: Fetching pieces in React

```jsx
import { useState, useEffect } from 'react';

const STRAPI_URL = 'http://localhost:1337';

function Shop() {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/pieces?populate=*`)
      .then(res => res.json())
      .then(data => {
        setPieces(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pieces:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {pieces.map(piece => (
        <div key={piece.id}>
          <h2>{piece.Name}</h2>
          <img
            src={`${STRAPI_URL}${piece.Photo[0]?.url}`}
            alt={piece.Name}
          />
          <p>{piece.category?.Name}</p>
        </div>
      ))}
    </div>
  );
}

export default Shop;
```

---

## Filtering by Category

To get only pieces in a specific category, you can filter:

```
GET /api/pieces?populate=*&filters[category][Name][$eq]=Earrings
```

Or fetch a category with its pieces:

```
GET /api/categories?populate=*&filters[Name][$eq]=Earrings
```

---

## Things to Watch Out For

1. **Empty categories.** Necklaces and Rings have no pieces yet. Make sure your UI handles this gracefully - show a "No pieces yet" message, not a blank page or an error.
    
2. **`Photo` is an array.** Even if a piece has one image, it's still `piece.Photo[0]`, not `piece.Photo`. Always check it exists: `piece.Photo[0]?.url`.
    
3. **`category` is singular.** It's `piece.category`, not `piece.categories`. Each piece belongs to one category.
    
4. **`Collection` can be null.** Not every piece belongs to a collection. Check before displaying: `piece.Collection && <span>{piece.Collection}</span>`.
    
5. **Don't forget `?populate=*`.** Seriously. This is the #1 thing that will trip you up.
    

---

## Quick Test

Once your backend is running, paste this into your browser to confirm everything works:

```
http://localhost:1337/api/pieces?populate=*
```

You should see JSON with piece names, descriptions, photos, and categories. If you see a 403 error, the public permissions aren't set up.
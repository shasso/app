# Server Data Configuration & Search System

This directory contains JSON files that define the available options for select fields in the metadata editor, along with comprehensive documentation for the advanced search system.

## Configuration Files

### `genre-options.json`
Contains the available genre options for the "Genre" dropdown field.

**Current options:**
- literature
- language  
- new testament
- old testament
- magazine
- apocrypha
- academic
- poetry
- history
- dictionary
- religion
- biography
- folklore

### `dialect-options.json`
Contains the available dialect options for the "Dialect" dropdown field.

**Current options:**
- urmi
- standard
- other
- jilu
- tkhuma
- baz

### `source-options.json`
Contains the available source options for the "Source" dropdown field.

**Current options:**
- private
- online
- published
- manuscript
- archive
- library
- personal collection
- digital repository
- book

## 🎨 Integration with Beautiful Search Interface

All dropdown fields are automatically integrated with the stunning new search interface featuring:

### **Visual Integration**
- **Gradient Styling**: Dropdown fields appear with beautiful indigo-purple-pink gradients
- **Type Badges**: Purple badges indicate dropdown field types in advanced search
- **Icon Mapping**: Consistent iconography (Tag for genre, Database for source, etc.)
- **Visual Feedback**: Hover effects and smooth transitions for all dropdown interactions

### **Search Functionality**
- **Exact Match**: Dropdown values use precise string matching for accurate results
- **Auto-validation**: Search parameters validated against current configuration options
- **Performance**: Indexed fields for lightning-fast search operations
- **API Integration**: Available through the `/api/metadata/search/fields` endpoint

## How to Add New Options

### 🔄 **Development Mode Updates**

1. **Edit the JSON file**: Open the appropriate file (`genre-options.json`, `dialect-options.json`, or `source-options.json`)
2. **Add new values**: Add new options to the array, following the existing format
3. **Save the file**: Save your changes
4. **Restart the server**: Restart the backend server to load the new options

```bash
# Restart backend server
cd server
# Ctrl+C to stop, then restart
node index.js
```

### 🐳 **Docker Mode Updates**

When running with Docker Compose, rebuild the backend container:

```bash
# Rebuild and restart backend service
docker compose build --no-cache backend
docker compose up -d backend
```

1. **Edit the JSON file**: Open the appropriate file (`genre-options.json`, `dialect-options.json`, or `source-options.json`)
2. **Add new values**: Add new options to the array, following the existing format
3. **Save the file**: Save your changes
4. **Restart the server**: Restart the backend server to load the new options

### Example: Adding a new genre option

**Before:**
```json
[
  "literature",
  "language",
  "new testament",
  "old testament",
  "magazine",
  "apocrypha",
  "academic",
  "poetry",
  "history",
  "dictionary",
  "religion",
  "biography"
]
```

**After:**
```json
[
  "literature",
  "language",
  "new testament",
  "old testament",
  "magazine",
  "apocrypha",
  "academic",
  "poetry",
  "history",
  "dictionary",
  "religion",
  "biography",
  "translation",
  "commentary"
]
```

### Example: Adding a new dialect option

**Before:**
```json
[
  "urmi",
  "standard",
  "other",
  "jilu",
  "tkhuma",
  "baz"
]
```

**After:**
```json
[
  "urmi",
  "standard",
  "other",
  "jilu",
  "tkhuma",
  "baz",
  "chaldean",
  "senaya"
]
```

### Example: Adding a new source option

**Before:**
```json
[
  "private",
  "online",
  "published",
  "manuscript",
  "archive",
  "library",
  "personal collection",
  "digital repository"
]
```

**After:**
```json
[
  "private",
  "online",
  "published",
  "manuscript",
  "archive",
  "library",
  "personal collection",
  "digital repository",
  "museum",
  "church collection"
]
```

## Important Notes

- **JSON Format**: Make sure to maintain valid JSON format (use double quotes, proper commas)
- **Case Sensitivity**: Options are case-sensitive in the database
- **Consistency**: Use consistent naming conventions (lowercase, spaces vs hyphens)
- **Validation**: The server validates submitted values against these options
- **Backup**: Consider keeping a backup of the original files before making changes
- **Docker**: If running in Docker, you'll need to rebuild the backend container after making changes

## Supported Configuration Files

- **genre-options.json**: Controls Genre dropdown options
- **dialect-options.json**: Controls Dialect dropdown options  
- **source-options.json**: Controls Source dropdown options

## For Developers

The options are loaded using the `loadOptions()` function in `utils/options-loader.js`. If a file cannot be read, fallback options are used to prevent application crashes.

**Fallback Options:**
- Genre: `['literature', 'language', 'new testament', 'old testament', 'magazine', 'apocrypha', 'academic']`
- Dialect: `['urmi', 'standard', 'other']`
- Source: `['private', 'online', 'published']`

To reload options during development without restarting the server:
```bash
curl -X POST http://localhost:5000/api/reload-options
```

**Docker Usage:**
```bash
# After editing JSON files, rebuild and restart backend
docker compose build --no-cache backend
docker compose up -d backend
```

## Search System

The metadata editor includes an extensible search system that allows searching across multiple fields using different search strategies.

### Available Search Fields

- **ID** (exact match): Search by record UUID
- **Title** (text search): Case-insensitive search in titles
- **Subtitle** (text search): Case-insensitive search in subtitles
- **Authors** (array search): Search within authors array
- **Genre** (exact match): Search by exact genre match
- **Country** (text search): Search in country field
- **Year** (number search): Search by publication year

### Search API Endpoints

#### Get Available Search Fields

```http
GET /api/metadata/search/fields
```

Returns information about all searchable fields including labels, descriptions, and types.

#### Execute Search

```http
GET /api/metadata/search?field=value&field2=value2
```

**Single Field Examples:**

```http
GET /api/metadata/search?genre=language
GET /api/metadata/search?year=2018
GET /api/metadata/search?authors=daniel
GET /api/metadata/search?title=grammar
GET /api/metadata/search?country=iraq
```

**Multi-Field Examples (AND logic):**

```http
GET /api/metadata/search?genre=language&year=2018
GET /api/metadata/search?genre=literature&country=iraq
GET /api/metadata/search?authors=daniel&year=2020
```

### Search Response Format

```json
{
  "success": true,
  "query": {
    "genre": "language",
    "year": "2018"
  },
  "mongoQuery": {
    "$and": [
      {"metadata.genre": "language"},
      {"metadata.pub_date": 2018}
    ]
  },
  "results": [...],
  "totalCount": 1,
  "returnedCount": 1,
  "hasMore": false,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "hasNext": false
  }
}
```

### Adding New Search Fields

To add new searchable fields, edit `server/utils/search-engine.js` and add to the `searchableFields` configuration:

```javascript
newField: {
  path: 'metadata.newField',        // MongoDB path
  type: 'text',                     // Search type: exact, text, array, number, range
  label: 'New Field',               // Display label
  description: 'Search description', // Help text
  validation: Joi.string().min(1)   // Joi validation schema
}
```

**Supported Search Types:**

- **exact**: Exact string match
- **text**: Case-insensitive text search with regex
- **array**: Search within array fields
- **number**: Numeric comparison
- **range**: Support range queries (e.g., "2020-2023")

### Technical Implementation

- **Strategy Pattern**: Uses pluggable search strategies for different field types
- **Validation**: Input validation using Joi schemas
- **MongoDB**: Efficient MongoDB queries with proper indexing
- **Extensible**: Easy to add new search fields and types
- **Error Handling**: Comprehensive error handling and user feedback

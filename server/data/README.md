# Managing Dropdown Options

This directory contains JSON files that define the available options for select fields in the metadata editor.

## Files

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

## How to Add New Options

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
docker-compose build --no-cache backend
docker-compose up -d backend
```

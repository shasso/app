<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Metadata Editor Project Instructions

This is a metadata editor web application built with React TypeScript frontend and Node.js backend.

## Project Structure
- Frontend: React + TypeScript + Vite in the root directory
- Backend: Node.js + Express + MongoDB in the `server/` directory
- Database: MongoDB for storing metadata records

## Key Requirements
- Support for dynamic metadata fields with predefined and custom fields
- Multiple authors support (array field)
- GUID-based record identification
- Full CRUD operations (Create, Read, Update, Delete)
- Search functionality by ID
- Field validation and data integrity
- Unicode text support for international content

## Coding Standards
- Use TypeScript for type safety
- Follow React functional components with hooks
- Use proper error handling and validation
- Implement responsive design principles
- Follow REST API conventions for backend endpoints
- Use proper MongoDB operations and indexing
- Include proper logging and debugging information

## Data Structure
Records follow this structure:
```json
{
  "id": "uuid",
  "metadata": {
    "title": "string",
    "authors": ["string"],
    // other metadata fields...
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Security Considerations
- Input validation and sanitization
- XSS protection
- CSRF protection
- Proper error messages without exposing sensitive data

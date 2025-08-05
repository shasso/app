# Product Requirements Document (PRD)
## Metadata Editor Web Application

### Document Information
- **Version**: 1.0
- **Date**: August 1, 2025
- **Project**: Metadata Editor for Corpus Items
- **Status**: Draft

---

## 1. Executive Summary

The Metadata Editor is a web-based application designed to create, manage, and organize metadata for corpus items. The application provides a dynamic interface for creating structured metadata objects with flexible field management, search capabilities, and CRUD operations, backed by a NoSQL database.

## 2. Product Overview

### 2.1 Purpose
To provide a user-friendly interface for creating and managing metadata records for various types of corpus items including literature, magazines, religious texts, and academic publications.

### 2.2 Target Users
- Corpus linguists
- Digital librarians
- Academic researchers
- Content archivists
- Publishing professionals

### 2.3 Key Benefits
- Standardized metadata structure with flexibility for custom fields
- Efficient search and retrieval of metadata records
- Automatic GUID generation for unique identification
- Dynamic field management system

---

## 3. Product Scope

### 3.1 In Scope
- Web-based metadata editor interface
- CRUD operations for metadata records
- Dynamic field addition from predefined list
- Custom field creation capability
- Search functionality by ID
- GUID auto-generation
- NoSQL database integration
- Field validation and data integrity

### 3.2 Out of Scope
- File upload/attachment management
- Multi-user authentication and authorization
- Advanced analytics and reporting
- Bulk import/export functionality
- Version control of metadata records

---

## 4. Functional Requirements

### 4.1 Core Features

#### 4.1.1 Metadata Record Structure
The application must support a two-level JSON structure:
```json
{
  "id": "auto-generated GUID",
  "metadata": {
    // Dynamic fields
  }
}
```

#### 4.1.2 Field Management System

**Predefined Fields**
The system must include the following standard fields:
- `title` (text)
- `subtitle` (text)
- `genre` (select: literature, language, new testament, old testament, magazine, apocrypha, academic)
- `language` (select: Assyrian, English, Arabic, Other)
- `copyright` (select: yes, no)
- `authors` (array of text - supports multiple authors)
- `editor` (text)
- `translator` (text)
- `dialect` (select: urmi, standard, other)
- `location` (text)
- `country` (text)
- `source` (select: private, online, published)
- `num_pages` (number)
- `pub_date` (year)
- `edition` (text)

**Dynamic Field Addition**
- Users can select from existing predefined fields
- Fields appear as appropriate input types (text, select, number, date, array)
- Array fields (like authors) provide add/remove functionality for multiple entries
- Only unused fields are available for selection

**Custom Field Creation**
- Users can create custom fields with user-defined names
- Custom fields default to text input type
- Field names must be unique within a record
- Custom field names are validated (alphanumeric, underscores, no spaces)

#### 4.1.3 CRUD Operations

**Create New Record**
- Generate unique GUID automatically
- Provide form interface for metadata entry
- Validate required fields and data types
- Save to NoSQL database

**Read/Search Records**
- Search by exact ID (GUID)
- Display full metadata record
- Format display in readable format

**Update Record**
- Edit existing metadata fields
- Add/remove dynamic fields
- Maintain data integrity
- Update timestamp tracking

**Delete Record**
- Confirm deletion with user prompt
- Permanent removal from database
- Display confirmation message

### 4.2 User Interface Requirements

#### 4.2.1 Main Navigation
- Dashboard/Home page
- New Record creation
- Search interface
- Record listing (recent/all)

#### 4.2.2 Record Creation Interface
- Clean, intuitive form layout
- Dynamic field addition controls
- Array field management (add/remove entries for authors)
- Field type indicators
- Save/Cancel buttons
- Form validation messages

#### 4.2.3 Search Interface
- Search by ID input field
- Search results display
- Record preview cards
- Edit/Delete action buttons

#### 4.2.4 Record Detail View
- Formatted metadata display
- Edit mode toggle
- Delete confirmation
- Copy ID functionality

### 4.3 Data Validation Rules

#### 4.3.1 Required Fields
- ID (auto-generated, read-only)
- At least one metadata field must be present

#### 4.3.2 Field Validation
- `pub_date`: Valid 4-digit year (1000-current year)
- `num_pages`: Positive integer
- `id`: Valid GUID format (auto-generated)
- `authors`: Array of non-empty strings, minimum 1 author when field is present
- Custom field names: alphanumeric + underscores only
- Text fields: Maximum 500 characters
- Select fields: Must match predefined options

#### 4.3.3 Data Integrity
- Unique ID constraint
- JSON structure validation
- Field type validation
- Character encoding support (UTF-8 for Unicode text)

---

## 5. Technical Requirements

### 5.1 Architecture

#### 5.1.1 Frontend
- **Technology**: Modern web framework (React.js, Vue.js, or Angular)
- **Responsive Design**: Mobile-friendly interface
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)

#### 5.1.2 Backend
- **API**: RESTful web service
- **Runtime**: Node.js, Python, or similar
- **Framework**: Express.js, FastAPI, or equivalent

#### 5.1.3 Database
- **Type**: NoSQL database (MongoDB, CouchDB, or similar)
- **Structure**: Document-based storage
- **Indexing**: ID field indexed for fast retrieval

### 5.2 API Endpoints

```
POST /api/metadata          - Create new record
GET /api/metadata/:id       - Get record by ID
PUT /api/metadata/:id       - Update record
DELETE /api/metadata/:id    - Delete record
GET /api/metadata/fields    - Get available field definitions
```

### 5.3 Performance Requirements
- Page load time: < 2 seconds
- Search response time: < 1 second
- Database operations: < 500ms
- Support for 10,000+ records

### 5.4 Security Requirements
- Input validation and sanitization
- XSS protection
- CSRF protection
- SQL injection prevention (NoSQL injection)

---

## 6. User Experience Requirements

### 6.1 Usability
- Intuitive interface requiring minimal training
- Clear visual hierarchy and navigation
- Helpful error messages and validation feedback
- Consistent design patterns throughout

### 6.2 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### 6.3 Responsiveness
- Mobile-first design approach
- Tablet and desktop optimization
- Touch-friendly interface elements

---

## 7. Success Metrics

### 7.1 User Adoption
- Time to create first record: < 5 minutes
- User task completion rate: > 95%
- User satisfaction score: > 4.0/5.0

### 7.2 Performance
- System uptime: > 99.5%
- Search accuracy: 100% for exact ID matches
- Data integrity: 0 data loss incidents

---

## 8. Implementation Phases

### Phase 1: Core Functionality (MVP)
- Basic CRUD operations
- Predefined field support
- Simple search by ID
- Basic validation

### Phase 2: Enhanced Features
- Dynamic field addition
- Custom field creation
- Improved UI/UX
- Advanced validation

### Phase 3: Polish & Optimization
- Performance optimization
- Enhanced error handling
- Accessibility improvements
- Mobile optimization

---

## 9. Constraints and Assumptions

### 9.1 Constraints
- Single-user application (no multi-user support initially)
- Text-based metadata only (no file attachments)
- Limited to defined field types

### 9.2 Assumptions
- Users have basic computer literacy
- Modern web browser availability
- Stable internet connection for web application
- Unicode support for international text

---

## 10. Risk Analysis

### 10.1 Technical Risks
- **Database corruption**: Mitigated by regular backups
- **Browser compatibility**: Addressed through testing
- **Performance degradation**: Managed through indexing and optimization

### 10.2 User Experience Risks
- **Complex interface**: Mitigated through user testing and iteration
- **Data entry errors**: Addressed through validation and confirmation dialogs

---

## 11. Future Considerations

### 11.1 Potential Enhancements
- Bulk import/export functionality
- Advanced search and filtering
- Multi-user support with authentication
- API for third-party integrations
- Backup and restore capabilities
- Audit trail and version history

### 11.2 Scalability
- Database sharding for large datasets
- Caching layer for improved performance
- CDN integration for global access

---

## 12. Acceptance Criteria

### 12.1 Functional Acceptance
- [ ] Users can create new metadata records with auto-generated GUIDs
- [ ] Users can add predefined fields dynamically
- [ ] Users can create and name custom fields
- [ ] Users can search for records by exact ID
- [ ] Users can edit existing records
- [ ] Users can delete records with confirmation
- [ ] All data validation rules are enforced
- [ ] Unicode text is properly handled and displayed

### 12.2 Technical Acceptance
- [ ] Application loads in under 2 seconds
- [ ] Search results return in under 1 second
- [ ] All API endpoints function correctly
- [ ] Database operations complete successfully
- [ ] No data corruption or loss occurs
- [ ] Security measures are implemented and tested

### 12.3 User Experience Acceptance
- [ ] Interface is intuitive and easy to navigate
- [ ] Error messages are clear and helpful
- [ ] Application works on mobile devices
- [ ] Accessibility requirements are met
- [ ] User can complete tasks without external documentation

---

## Appendix A: Sample Data Structure

### Complete Record Example
```json
{
  "id": "1d05964e-cc5c-4512-a3ac-a9e64ce25b58",
  "metadata": {
    "title": "ܣܝܵܡܹ̈ܐ ܡܲܪ̈ܕܘܼܬܵܢܵܝܹܐ ܘܬܲܫܥܝܼܬܵܢܵܝܹ̈ܐ ܕܪܵܒܝܼ ܒܸܢܝܵܡܹܝܢ ܐܲܪܣܵܢܝܼܣ",
    "subtitle": "ܡܵܘܕܥܵܢܘܼܬܵܐ ܘܣܦܲܪܚܲܝܹ̈ܐ ܘܢܘܼܗܵܪܹ̈ܐ ܒܝܲܕ ܝܘܼܐܹܝܠ ܐܲܒ݂ܪܵܗܵܡ ܒܵܒܵܐ",
    "genre": "language",
    "language": "Assyrian",
    "copyright": "yes",
    "authors": ["ܒܸܢܝܵܡܹܝܢ ܐܲܪܣܵܢܝܼܣ"],
    "editor": "ܝܘܼܐܹܝܠ ܐܲܒ݂ܪܵܗܵܡ ܒܵܒܵܐ",
    "dialect": "urmi",
    "location": "Alamo",
    "country": "USA",
    "source": "private",
    "num_pages": "453",
    "pub_date": "2008"
  }
}
```

### Multiple Authors Example
```json
{
  "id": "2e16075f-dd6d-5623-b4bd-b0f75df36c69",
  "metadata": {
    "title": "Collaborative Poetry Collection",
    "genre": "literature",
    "language": "Assyrian",
    "copyright": "yes",
    "authors": [
      "ܩܲܫܝܼܫܵܐ ܫܡܘܼܐܹܝܠ ܕܸܢܚܵܐ",
      "ܝܘܼܐܹܝܠ ܐܲܒ݂ܪܵܗܵܡ ܒܵܒܵܐ",
      "ܒܸܢܝܵܡܹܝܢ ܐܲܪܣܵܢܝܼܣ"
    ],
    "dialect": "standard",
    "location": "San Jose",
    "country": "USA",
    "source": "private",
    "pub_date": "2023"
  }
}
```

### Minimal Record Example
```json
{
  "id": "ba661428-9c51-4861-a230-0f639496e03d",
  "metadata": {
    "title": "JAAS",
    "genre": "magazine",
    "language": "Assyrian"
  }
}
```

---

*End of Document*

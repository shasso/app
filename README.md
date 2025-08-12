# Metadata Editor

A full-stack web application for managing and organizing metadata for corpus items with dynamic fields and flexible data structures. Built with React TypeScript frontend, Node.js backend, and MongoDB database.

## Features

- ✅ **Dynamic Metadata Fields** - Support for predefined and custom fields
- ✅ **File-based Configuration** - Easily configurable dropdown options via JSON files
- ✅ **Multiple Authors Support** - Array-based author field management
- ✅ **GUID-based Records** - UUID identification for all records
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete metadata records
- ✅ **Extensible Search System** - Multi-field search with Strategy pattern architecture
- ✨ **Stunning Search Interface** - Beautiful modern UI with indigo-purple-pink gradients and sophisticated animations
- 🎨 **Modern Visual Design** - Backdrop blur effects, smooth transforms, elegant gradient backgrounds
- 🔄 **Smart Search Modes** - Toggle between Quick Search and Advanced Search with seamless transitions
- 💫 **Enhanced UX Features** - Visual feedback, clipboard notifications, comprehensive icon mapping
- ✅ **Multi-field Search** - Search by ID, title, authors, subtitle, genre, country, year, and more
- ✅ **Smart Search Features** - Range search for years, array search for authors, dropdown filters
- 📱 **Fully Responsive Design** - Optimized for desktop, tablet, and mobile with adaptive layouts
- ✅ **Field Validation** - Data integrity with Joi validation
- ✅ **Unicode Support** - International content support
- ✅ **Real-time Dashboard** - Statistics and recent records overview
- ✅ **Fallback Storage** - Works with or without database connection

## Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Vite 4.5.3** - Fast build tool and development server
- **React Router 6.20.1** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend

- **Node.js 18.18.0** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB 7.0** - NoSQL database
- **Joi** - Data validation
- **UUID** - Unique identifier generation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Infrastructure

- **Docker** - Containerized MongoDB
- **Docker Compose** - Multi-container orchestration

## Project Structure

```bash
metadata-editor/
├── app/                          # Main application directory
│   ├── src/                      # Frontend source code
│   │   ├── components/           # React components
│   │   │   └── Layout.tsx       # Main layout component
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx    # Dashboard page with statistics
│   │   │   ├── CreateRecord.tsx # Create record form
│   │   │   ├── EditRecord.tsx   # Edit record form
│   │   │   ├── ViewRecord.tsx   # View record details
│   │   │   └── SearchRecord.tsx # Advanced search interface
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── index.ts         # Main types and search interfaces
│   │   ├── utils/               # Utility functions
│   │   │   └── api.ts           # API client with fallback
│   │   └── main.tsx             # Application entry point
│   ├── server/                  # Backend source code
│   │   ├── data/                # Configuration data files
│   │   │   ├── genre-options.json      # Genre dropdown options
│   │   │   ├── dialect-options.json    # Dialect dropdown options
│   │   │   ├── source-options.json     # Source dropdown options
│   │   │   └── README.md               # Data management guide
│   │   ├── utils/               # Server utilities
│   │   │   └── options-loader.js       # JSON options loader
│   │   ├── index.js             # Express server
│   │   └── package.json         # Backend dependencies
│   ├── docker-compose.yml       # Docker configuration
│   ├── mongo-init.js            # MongoDB initialization
│   └── package.json             # Frontend dependencies
└── README.md                    # This file
```

## Data Structure

Records follow this structure:

```json
{
  "id": "uuid-string",
  "metadata": {
    "title": "Record Title",
    "authors": ["Author 1", "Author 2"],
    "genre": "literature",
    "language": "Assyrian",
    "date": "2024-01-15",
    "description": "Record description",
    // Additional custom fields...
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## Prerequisites

- **Node.js 18.18.0** or higher
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd metadata-editor/app
```

### 2. Install Dependencies

#### Frontend Dependencies

```bash
npm install
```

#### Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Start MongoDB with Docker

```bash
# Start MongoDB container in the background
docker compose up -d mongodb

# Verify MongoDB is running
docker ps
```

The MongoDB container will be available at:

- **Host**: `localhost:27017`
- **Database**: `metadata-editor`
- **Username**: `admin`
- **Password**: `password123`

### 4. Start the Backend Server

```bash
# From the app directory
cd server
node index.js
```

The backend server will start on `http://localhost:5000` with the following endpoints:

- `GET /api/metadata` - Get all records
- `POST /api/metadata` - Create new record
- `GET /api/metadata/:id` - Get record by ID
- `PUT /api/metadata/:id` - Update record
- `DELETE /api/metadata/:id` - Delete record
- `GET /api/metadata/fields` - Get field definitions

### 5. Start the Frontend Development Server

```bash
# From the app directory (open new terminal)
npm run dev
```

The frontend will be available at `http://localhost:5173`

## User Interface Features

### 🎨 Beautiful Modern Search Interface

The application features a stunning, completely redesigned search interface that combines functionality with visual excellence:

#### **🌈 Visual Design Elements**

- **Gradient Backgrounds**: Breathtaking indigo-purple-pink gradients create an immersive visual experience
- **Backdrop Blur Effects**: Modern glassmorphism design with sophisticated transparency layers
- **Smooth Animations**: Elegant transform effects, hover states, and loading animations throughout
- **Enhanced Typography**: Bold, readable fonts with perfect visual hierarchy
- **Consistent Spacing**: Clean, organized layout with harmonious visual balance

#### **⚡ Interactive Components**

- **Search Mode Toggle**: Beautiful button toggle between Quick and Advanced search modes with smooth transitions
- **Visual Feedback System**: Instant clipboard copy notifications with success indicators and animations
- **Hover Effects**: Subtle scale transforms and color transitions on interactive elements
- **Loading States**: Gorgeous animated loading indicators with spinning gradients
- **Responsive Cards**: Metadata cards that elegantly adapt to any screen size

#### **🔍 Smart Search Modes**

##### **Quick Search Mode**

Perfect for rapid searches with commonly used fields:

- **ID Search**: Lightning-fast exact match for record UUIDs with beautiful input styling
- **Title Search**: Intelligent keyword-based title searching with enhanced visual feedback
- **Clean Interface**: Focused, distraction-free design optimized for speed
- **Gradient Indicators**: Color-coded field types (blue for ID, purple for title)

##### **Advanced Search Mode**

Comprehensive search across all available fields with sophisticated UI:

- **Multi-field Search**: Use any combination of available metadata fields simultaneously
- **Smart Field Types**: Automatic handling for different data types with visual indicators
- **Enhanced Icon System**: Comprehensive icon mapping for all search fields (Hash, BookOpen, Users, MapPin, etc.)
- **Type Badges**: Beautiful purple badges showing field types (text, number, array)
- **Flexible Grid Layout**: Responsive 3-column grid that adapts to screen size

#### **✨ Search Result Features**

- **Stunning Result Cards**: Elegant metadata display with gradient borders and hover effects
- **One-Click Actions**: View, Edit, and Delete buttons with gradient styling and transform animations
- **Copy Functionality**: Instant ID copying with visual feedback and "✓ Copied" notifications
- **Comprehensive Metadata Display**: All fields shown with appropriate icons and organized layout
- **Timestamp Information**: Creation and modification dates with clock icons
- **Responsive Design**: Perfect display across desktop, tablet, and mobile devices

#### **🎯 Enhanced UX Features**

- **Search Statistics**: Beautiful result count display with gradient accents
- **Active Filter Tags**: Visual representation of current search parameters with gradient styling
- **Empty State Design**: Friendly "No Results Found" message with call-to-action buttons
- **Error Handling**: Graceful error messages with attractive red gradient styling
- **Loading Experience**: Comprehensive loading states with animated spinners and progress indicators

#### **📱 Responsive Excellence**

- **Mobile-First Design**: Optimized for touch interactions and mobile viewing
- **Adaptive Layouts**: Grid systems that respond perfectly to any screen size
- **Touch-Friendly Controls**: Properly sized buttons and inputs for mobile devices
- **Consistent Experience**: Identical functionality across all device types

### Navigation

- **Intuitive menu**: Clear navigation between dashboard, create, search, and records
- **Breadcrumb trails**: Easy navigation within record editing
- **Quick links**: Direct access to common actions

### Dashboard Features

- **Statistics overview**: Total records, recent additions
- **Recent records**: Quick access to latest entries
- **Search shortcuts**: Direct links to search functionality

## Running the Full Stack

### Option 1: Manual Startup (Recommended for Development)

1. **Start MongoDB**:

   ```bash
   docker compose up -d mongodb
   ```

2. **Start Backend** (in terminal 1):

   ```bash
   cd server
   node index.js
   ```

3. **Start Frontend** (in terminal 2):

   ```bash
   npm run dev
   ```

### Option 2: Using Docker Compose (All Services)

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## API Documentation

### Endpoints

#### Get All Records

```http
GET /api/metadata
```

#### Create Record

```http
POST /api/metadata
Content-Type: application/json

{
  "metadata": {
    "title": "Sample Title",
    "authors": ["Author Name"],
    "genre": "literature"
  }
}
```

#### Get Record by ID

```http
GET /api/metadata/{id}
```

#### Update Record

```http
PUT /api/metadata/{id}
Content-Type: application/json

{
  "metadata": {
    "title": "Updated Title"
  }
}
```

#### Delete Record

```http
DELETE /api/metadata/{id}
```

#### Get Field Definitions

```http
GET /api/metadata/fields
```

### Search API

The application includes an extensible search system that supports multiple search strategies.

#### Get Available Search Fields

```http
GET /api/metadata/search/fields
```

Returns information about all searchable fields including labels, descriptions, and search types.

#### Execute Search

```http
GET /api/metadata/search?field=value&field2=value2
```

**Available Search Fields:**

- **id** (exact match) - Search by record UUID
- **title** (text search) - Case-insensitive search in titles
- **subtitle** (text search) - Case-insensitive search in subtitles
- **authors** (array search) - Search within authors array
- **genre** (exact match) - Search by exact genre match
- **country** (text search) - Search in country field
- **year** (number search) - Search by publication year

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

**Search Response Format:**

```json
{
  "success": true,
  "query": {
    "genre": "language",
    "year": "2018"
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

### Response Format

All API responses follow this format:

**Success Response:**

```json
{
  "id": "uuid",
  "metadata": { /* record data */ },
  "createdAt": "ISO-8601-date",
  "updatedAt": "ISO-8601-date"
}
```

**Error Response:**

```json
{
  "error": "Error message description"
}
```

## Field Definitions

The application supports these predefined fields:

- **title** (text) - Record title
- **subtitle** (text) - Record subtitle
- **authors** (array) - List of authors
- **genre** (select) - literature, language, new testament, old testament, magazine, apocrypha, academic, poetry, history, dictionary, religion, biography, folklore
- **language** (select) - Assyrian, English, Arabic, Other
- **copyright** (select) - yes, no
- **editor** (text) - Editor name
- **translator** (text) - Translator name
- **dialect** (select) - urmi, standard, other, jilu, tkhuma, baz
- **location** (text) - Location
- **country** (text) - Country
- **source** (select) - private, online, published, manuscript, archive, library, personal collection, digital repository, book
- **num_pages** (number) - Number of pages
- **pub_date** (year) - Publication year
- **edition** (text) - Edition information

## Edit Workflow & Core Field Bootstrap (Unreleased)

The edit experience automatically ensures essential core fields are present, improving usability when legacy or sparse records are opened.

### Core Field Auto-Bootstrap

When opening a record whose metadata object is empty, the application auto-adds the following core fields (if they are defined in the field definitions service):

```json
["title", "subtitle", "authors", "genre", "year", "country"]
```

If you manually remove all fields, you can re-add them with the Add Core Fields button that appears in the empty state.

### Canonical Routes

- Dashboard: `/`
- Create Record: `/create`
- Search: `/search`
- Edit Record: `/records/:id/edit` (replaces older `/edit/:id` form)
- View Record (planned alignment): `/records/:id`

### Editing Behavior

- Save redirects back to the search page with the record ID pre-populated.
- Empty strings and empty arrays are stripped before submission (only meaningful values are persisted).
- Array fields (e.g. authors) always present at least one input row for convenience.

## UI Primitives & Design System (Unreleased)

A lightweight component + token layer standardizes styling and accelerates future UI work.

### Primitive Components (Location: `src/components/ui/`)

- `Button.tsx` – Variants: `solid`, `subtle`, `ghost`; Sizes: `sm`, `md`, `lg`; Built-in loading spinner.
- `Input.tsx` – Consistent text input styling with optional error state class handling.
- `Card.tsx` – Structural wrapper with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` subcomponents.

Pages progressively migrate from raw HTML elements to these primitives for consistency, accessibility, and easier theming.

### Design Tokens (`src/designTokens.ts`)

Central source of semantic design values:

- Color palette (neutral + indigo/purple accent spectrum)
- Spacing scale
- Radii & elevation layers
- Focus ring + motion tokens
- Typography scale

The helper `buildCssVariables(tokens)` produces a map suitable for injecting as CSS variables (future global theming/dark mode expansion).

### Adoption Status

- Fully adopted: Search interface, Dashboard action elements, Edit record inputs (text & array), core action buttons.
- Partial: Create form still mixes raw elements & primitives; Select fields currently native `<select>` elements (planned abstraction: `Select` component or headless + tokens approach).

### Planned Enhancements

- Dedicated `Select` & `Badge` components
- Dark mode surface alignment using token-driven CSS variables
- Accessible inline validation messaging component
- Extraction of layout shell primitives (e.g., `PageHeader`, `Toolbar`)

## Development

### Configuring Dropdown Options

The application uses file-based configuration for dropdown field options, making it easy to add new values without code changes.

#### Managing Dropdown Options

**Location**:

- `server/data/genre-options.json` - Genre dropdown options
- `server/data/dialect-options.json` - Dialect dropdown options
- `server/data/source-options.json` - Source dropdown options

**To add new options**:

1. Edit the appropriate JSON file
2. Add new values to the array:

   ```json
   [
     "existing-option-1",
     "existing-option-2",
     "new-option-here"
   ]
   ```

3. Restart the backend server (or rebuild Docker container)
4. New options appear in dropdown menus

**Example - Adding new genres**:

```json
[
  "literature", "language", "new testament", "old testament",
  "magazine", "apocrypha", "academic", "poetry", "history", 
  "dictionary", "religion", "biography", "folklore", "grammar"
]
```

**Current available options**:

- **Genre**: literature, language, new testament, old testament, magazine, apocrypha, academic, poetry, history, dictionary, religion, biography, folklore
- **Dialect**: urmi, standard, other, jilu, tkhuma, baz
- **Source**: private, online, published, manuscript, archive, library, personal collection, digital repository, book

#### Docker Configuration Updates

When running in Docker, after editing configuration files:

```bash
# Rebuild and restart backend service
docker compose build --no-cache backend
docker compose up -d backend
```

#### Development Mode Updates

When running in development mode:

```bash
# Simply restart the backend server
cd server
# Ctrl+C to stop, then restart
node index.js
```

### Adding New Fields

#### For Text/Number Fields:

1. Update the Joi schema in `server/index.js`
2. Add field definition in the `/api/metadata/fields` endpoint
3. Update the frontend form components

#### For New Dropdown Fields:

1. Create a new JSON file in `server/data/` (e.g., `language-options.json`)
2. Update `server/utils/options-loader.js` to include fallback options
3. Update the Joi schema to use `loadOptions('your-field')`
4. Add field definition in the `/api/metadata/fields` endpoint
5. Update the frontend form components

#### Extending Existing Dropdown Fields:

Simply edit the corresponding JSON file in `server/data/`:

- `genre-options.json` - Add/remove genre options
- `dialect-options.json` - Add/remove dialect options  
- `source-options.json` - Add/remove source options

No code changes required for existing dropdown fields!

## Extending the Search System

The search system uses the Strategy pattern for extensibility. To add new searchable fields:

### Adding New Search Fields

1. **Edit the search configuration** in `server/utils/search-engine.js`:

   ```javascript
   // Add to the searchableFields object
   newField: {
     path: 'metadata.newField',        // MongoDB document path
     type: 'text',                     // Search strategy: exact, text, array, number, range
     label: 'New Field',               // Display label for API docs
     description: 'Search description', // Help text
     validation: Joi.string().min(1)   // Joi validation schema
   }
   ```

2. **Available Search Types:**

   - **exact**: Exact string match
   - **text**: Case-insensitive regex search
   - **array**: Search within array fields
   - **number**: Numeric comparison
   - **range**: Support range queries (e.g., "2020-2023")

3. **Restart the backend** to apply changes:

   ```bash
   # Development mode
   cd server && node index.js

   # Docker mode  
   docker compose restart backend
   ```

### Search Strategy Implementation

The system automatically creates appropriate search strategies based on the field type. Custom strategies can be added by:

1. Extending the `SearchStrategy` base class
2. Adding the new type to `SearchStrategyFactory`
3. Registering it in the search engine

**Example Custom Strategy:**

```javascript
class CustomSearchStrategy extends SearchStrategy {
  buildQuery(value) {
    // Custom MongoDB query logic
    return { [this.fieldConfig.path]: { $custom: value } };
  }
}
```

### Database Operations

```bash
# Connect to MongoDB
docker exec -it metadata-editor-mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# View databases
show dbs

# Use metadata-editor database
use metadata-editor

# View collections
show collections

# View records
db.metadata.find()
```

### Debugging

The application includes comprehensive error handling and fallback mechanisms:

- **Frontend**: Falls back to mock data if backend is unavailable
- **Backend**: Falls back to in-memory storage if MongoDB is unavailable
- **Database**: Persistent storage with Docker volumes

Check browser console and server logs for debugging information.

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**:

   ```bash
   # Find process using port 5000
   netstat -ano | findstr :5000
   # Kill the process or change PORT in server
   ```

2. **MongoDB connection failed**:

   ```bash
   # Restart MongoDB container
   docker compose restart mongodb
   # Check container logs
   docker logs metadata-editor-mongodb
   ```

3. **Frontend can't connect to API**:
   - Verify backend is running on port 5000
   - Check CORS configuration
   - Verify API base URL in `src/utils/api.ts`

4. **Docker permission issues**:

   ```bash
   # Ensure Docker is running
   docker --version
   # Restart Docker Desktop if needed
   ```

### Reset Database

```bash
# Stop and remove MongoDB container with data
docker compose down -v
# Restart with fresh database
docker compose up -d mongodb
```

## Production Deployment

### Environment Variables

Create `.env` files for production:

**Backend (.env)**:

```env
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/metadata-editor?authSource=admin
NODE_ENV=production
```

**Frontend (.env)**:

```env
VITE_API_URL=https://your-api-domain.com/api
```

### Build for Production

```bash
# Build frontend
npm run build

# Start production server
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the repository or contact the development team.

---

**Last Updated**: August 12, 2025
**Version**: 1.3.0

## Version History

### v1.3.0 (Current) - Beautiful Search Interface Redesign

- 🎨 **Completely Redesigned Search UI**: Stunning modern interface with sophisticated gradient backgrounds (indigo-purple-pink)
- ✨ **Enhanced Visual Design**: Backdrop blur effects, smooth transform animations, elegant typography, and perfect spacing
- 🔄 **Search Mode Toggle**: Seamless switching between Quick Search and Advanced Search modes with beautiful transitions
- 💫 **Interactive Elements**: Enhanced visual feedback, clipboard notifications with success indicators, sophisticated hover effects
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile with adaptive layouts and touch-friendly controls
- 🎯 **Enhanced UX**: Smart field indicators, comprehensive icon mapping (Hash, BookOpen, Users, MapPin, etc.), intuitive navigation
- 🏗️ **Improved Component Architecture**: Better state management, performance optimization, and sophisticated styling system
- 🌈 **Modern Design Language**: Glassmorphism effects, gradient-based design system, consistent visual hierarchy

### v1.2.0 - Advanced Search & Modern UI Foundation

- ✨ **Modern Search Interface**: Initial gradient backgrounds, search mode toggles, visual feedback
- 🔍 **Extensible Search System**: Strategy pattern implementation with 7 searchable fields
- 🎨 **UI/UX Improvements**: Basic styling updates, responsive design foundations
- 📱 **Responsive Design**: Optimized for multiple device types
- 🔧 **File-Based Configuration**: JSON-based dropdown options for genre, dialect, and source fields
- 📚 **Comprehensive Documentation**: Updated guides and API documentation
- 🐳 **Modern Docker Compose**: Updated to use current syntax without deprecated version attribute

### v1.1.0 - Core Functionality

- Basic CRUD operations for metadata records
- MongoDB integration with health checks
- Docker containerization
- React TypeScript frontend
- Node.js Express backend

### v1.0.0 - Initial Release

- Basic metadata editor functionality
- Simple record management

Features added in v1.3.0:

- Completely redesigned search interface with stunning indigo-purple-pink gradients
- Enhanced visual design with backdrop blur effects and smooth animations
- Search mode toggle with seamless transitions between Quick and Advanced modes
- Comprehensive icon mapping and visual feedback systems
- Fully responsive design optimized for all device types
- Sophisticated component architecture with improved state management
- Modern glassmorphism design language throughout the interface

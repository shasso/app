# Metadata Editor

A full-stack web application for managing and organizing metadata for corpus items with dynamic fields and flexible data structures. Built with React TypeScript frontend, Node.js backend, and MongoDB database.

## Features

- ✅ **Dynamic Metadata Fields** - Support for predefined and custom fields
- ✅ **Multiple Authors Support** - Array-based author field management
- ✅ **GUID-based Records** - UUID identification for all records
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete metadata records
- ✅ **Search Functionality** - Find records by ID and browse all records
- ✅ **Field Validation** - Data integrity with Joi validation
- ✅ **Unicode Support** - International content support
- ✅ **Responsive Design** - Mobile-friendly interface
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

```
metadata-editor/
├── app/                          # Main application directory
│   ├── src/                      # Frontend source code
│   │   ├── components/           # React components
│   │   │   └── Layout.tsx       # Main layout component
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx    # Dashboard page
│   │   │   ├── CreateRecord.tsx # Create record page
│   │   │   ├── EditRecord.tsx   # Edit record page
│   │   │   └── SearchRecord.tsx # Search records page
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── index.ts         # Main types
│   │   ├── utils/               # Utility functions
│   │   │   └── api.ts           # API client with fallback
│   │   └── main.tsx             # Application entry point
│   ├── server/                  # Backend source code
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
docker-compose up -d mongodb

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

## Running the Full Stack

### Option 1: Manual Startup (Recommended for Development)

1. **Start MongoDB**:
   ```bash
   docker-compose up -d mongodb
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
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
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
- **genre** (select) - literature, language, new testament, old testament, magazine, apocrypha, academic
- **language** (select) - Assyrian, English, Arabic, Other
- **copyright** (select) - yes, no
- **editor** (text) - Editor name
- **translator** (text) - Translator name
- **dialect** (select) - urmi, standard, other
- **location** (text) - Location
- **country** (text) - Country
- **source** (select) - private, online, published
- **num_pages** (number) - Number of pages
- **pub_date** (year) - Publication year
- **edition** (text) - Edition information

## Development

### Adding New Fields

1. Update the Joi schema in `server/index.js`
2. Add field definition in the `/api/metadata/fields` endpoint
3. Update the frontend form components

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
   docker-compose restart mongodb
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
docker-compose down -v
# Restart with fresh database
docker-compose up -d mongodb
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

**Last Updated**: August 4, 2025
**Version**: 1.0.0

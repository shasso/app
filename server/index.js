import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/metadata-editor';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
const client = new MongoClient(MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db('metadata-editor');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Metadata schema validation
const metadataSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  metadata: Joi.object({
    title: Joi.string().max(500).optional(),
    subtitle: Joi.string().max(500).optional(),
    genre: Joi.string().valid('literature', 'language', 'new testament', 'old testament', 'magazine', 'apocrypha', 'academic').optional(),
    language: Joi.string().valid('Assyrian', 'English', 'Arabic', 'Other').optional(),
    copyright: Joi.string().valid('yes', 'no').optional(),
    authors: Joi.array().items(Joi.string().min(1).max(500)).min(1).optional(),
    editor: Joi.string().max(500).optional(),
    translator: Joi.string().max(500).optional(),
    dialect: Joi.string().valid('urmi', 'standard', 'other').optional(),
    location: Joi.string().max(500).optional(),
    country: Joi.string().max(500).optional(),
    source: Joi.string().valid('private', 'online', 'published').optional(),
    num_pages: Joi.number().integer().positive().optional(),
    pub_date: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional(),
    edition: Joi.string().max(500).optional()
  }).min(1).pattern(Joi.string(), Joi.any()) // Allow additional custom fields
});

// Routes

// Get all metadata records (for development)
app.get('/api/metadata', async (req, res) => {
  try {
    const records = await db.collection('metadata').find({}).toArray();
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Get metadata record by ID
app.get('/api/metadata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!Joi.string().uuid().validate(id).error) {
      const record = await db.collection('metadata').findOne({ id });
      
      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      res.json(record);
    } else {
      res.status(400).json({ error: 'Invalid ID format' });
    }
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// Create new metadata record
app.post('/api/metadata', async (req, res) => {
  try {
    const { error, value } = metadataSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Generate UUID if not provided
    const record = {
      id: value.id || uuidv4(),
      metadata: value.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if ID already exists
    const existingRecord = await db.collection('metadata').findOne({ id: record.id });
    if (existingRecord) {
      return res.status(409).json({ error: 'Record with this ID already exists' });
    }
    
    const result = await db.collection('metadata').insertOne(record);
    
    if (result.acknowledged) {
      res.status(201).json(record);
    } else {
      res.status(500).json({ error: 'Failed to create record' });
    }
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Update metadata record
app.put('/api/metadata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (Joi.string().uuid().validate(id).error) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const { error, value } = metadataSchema.validate({ ...req.body, id });
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const updateData = {
      metadata: value.metadata,
      updatedAt: new Date()
    };
    
    const result = await db.collection('metadata').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    if (result.modifiedCount > 0) {
      const updatedRecord = await db.collection('metadata').findOne({ id });
      res.json(updatedRecord);
    } else {
      res.status(304).json({ message: 'No changes made' });
    }
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Delete metadata record
app.delete('/api/metadata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (Joi.string().uuid().validate(id).error) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const result = await db.collection('metadata').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Get available field definitions
app.get('/api/metadata/fields', (req, res) => {
  const fieldDefinitions = {
    predefinedFields: [
      { name: 'title', type: 'text', label: 'Title', maxLength: 500 },
      { name: 'subtitle', type: 'text', label: 'Subtitle', maxLength: 500 },
      { name: 'genre', type: 'select', label: 'Genre', options: ['literature', 'language', 'new testament', 'old testament', 'magazine', 'apocrypha', 'academic'] },
      { name: 'language', type: 'select', label: 'Language', options: ['Assyrian', 'English', 'Arabic', 'Other'] },
      { name: 'copyright', type: 'select', label: 'Copyright', options: ['yes', 'no'] },
      { name: 'authors', type: 'array', label: 'Authors', itemType: 'text', minItems: 1, maxLength: 500 },
      { name: 'editor', type: 'text', label: 'Editor', maxLength: 500 },
      { name: 'translator', type: 'text', label: 'Translator', maxLength: 500 },
      { name: 'dialect', type: 'select', label: 'Dialect', options: ['urmi', 'standard', 'other'] },
      { name: 'location', type: 'text', label: 'Location', maxLength: 500 },
      { name: 'country', type: 'text', label: 'Country', maxLength: 500 },
      { name: 'source', type: 'select', label: 'Source', options: ['private', 'online', 'published'] },
      { name: 'num_pages', type: 'number', label: 'Number of Pages', min: 1 },
      { name: 'pub_date', type: 'year', label: 'Publication Date', min: 1000, max: new Date().getFullYear() },
      { name: 'edition', type: 'text', label: 'Edition', maxLength: 500 }
    ]
  };
  
  res.json(fieldDefinitions);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await client.close();
  process.exit(0);
});

startServer().catch(console.error);

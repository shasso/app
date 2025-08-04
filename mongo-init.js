// MongoDB initialization script
db = db.getSiblingDB('metadata-editor');

// Create the database user
db.createUser({
  user: 'metadata_user',
  pwd: 'metadata_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'metadata-editor'
    }
  ]
});

// Create collections and indexes
db.createCollection('records');
db.records.createIndex({ "id": 1 }, { unique: true });
db.records.createIndex({ "metadata.title": "text", "metadata.authors": "text" });

print('MongoDB initialized successfully for metadata-editor');

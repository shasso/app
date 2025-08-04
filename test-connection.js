import { MongoClient } from 'mongodb';

const uri = 'mongodb://admin:password123@localhost:27017/metadata-editor?authSource=admin';

async function testConnection() {
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    console.log('Testing MongoDB connection...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('metadata-editor');
    const result = await db.admin().ping();
    console.log('✅ Ping successful:', result);
    
    await client.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();

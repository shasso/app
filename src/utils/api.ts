import axios from 'axios';
import type { MetadataRecord, FieldDefinitions } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Mock data for fallback
const mockRecords: MetadataRecord[] = [
  {
    id: 'sample-1',
    metadata: {
      title: 'Sample Assyrian Text',
      authors: ['John Doe', 'Jane Smith'],
      genre: 'Literary',
      language: 'Assyrian',
      date: '2024-01-15',
      description: 'A sample text for demonstration purposes'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sample-2',
    metadata: {
      title: 'Another Sample',
      authors: ['Bob Wilson'],
      genre: 'Historical',
      language: 'Assyrian',
      date: '2024-01-10',
      description: 'Another sample record'
    },
    createdAt: '2024-01-10T15:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  }
];

export const metadataApi = {
  // Get all records (for development)
  getAllRecords: async (): Promise<MetadataRecord[]> => {
    try {
      const response = await api.get('/metadata');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return mockRecords;
    }
  },

  // Get record by ID
  getRecord: async (id: string): Promise<MetadataRecord> => {
    try {
      const response = await api.get(`/metadata/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      const record = mockRecords.find(r => r.id === id);
      if (!record) {
        throw new Error(`Record ${id} not found`);
      }
      return record;
    }
  },

  // Create new record
  createRecord: async (record: Partial<MetadataRecord>): Promise<MetadataRecord> => {
    try {
      const response = await api.post('/metadata', record);
      return response.data;
    } catch (error) {
      console.warn('API not available, simulating create:', error);
      const newRecord: MetadataRecord = {
        id: `mock-${Date.now()}`,
        metadata: record.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRecords.push(newRecord);
      return newRecord;
    }
  },

  // Update record
  updateRecord: async (id: string, record: Partial<MetadataRecord>): Promise<MetadataRecord> => {
    try {
      const response = await api.put(`/metadata/${id}`, record);
      return response.data;
    } catch (error) {
      console.warn('API not available, simulating update:', error);
      const index = mockRecords.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error(`Record ${id} not found`);
      }
      const updatedRecord = {
        ...mockRecords[index],
        ...record,
        updatedAt: new Date().toISOString()
      };
      mockRecords[index] = updatedRecord;
      return updatedRecord;
    }
  },

  // Delete record
  deleteRecord: async (id: string): Promise<void> => {
    try {
      await api.delete(`/metadata/${id}`);
    } catch (error) {
      console.warn('API not available, simulating delete:', error);
      const index = mockRecords.findIndex(r => r.id === id);
      if (index !== -1) {
        mockRecords.splice(index, 1);
      }
    }
  },

  // Get field definitions
  getFieldDefinitions: async (): Promise<FieldDefinitions> => {
    try {
      const response = await api.get('/metadata/fields');
      return response.data;
    } catch (error) {
      console.warn('API not available, using default field definitions:', error);
      return {
        predefinedFields: [
          { name: 'title', type: 'text', label: 'Title', maxLength: 200 },
          { name: 'authors', type: 'array', label: 'Authors', itemType: 'string' },
          { name: 'genre', type: 'select', label: 'Genre', options: ['Literary', 'Historical', 'Religious', 'Legal'] },
          { name: 'language', type: 'select', label: 'Language', options: ['Assyrian', 'Aramaic', 'Hebrew', 'Arabic'] },
          { name: 'date', type: 'text', label: 'Date' },
          { name: 'description', type: 'text', label: 'Description', maxLength: 1000 },
          { name: 'tags', type: 'array', label: 'Tags', itemType: 'string' }
        ]
      };
    }
  },
};

export default api;

import axios from 'axios';
import type { MetadataRecord, FieldDefinitions } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const metadataApi = {
  // Get all records (for development)
  getAllRecords: async (): Promise<MetadataRecord[]> => {
    const response = await api.get('/metadata');
    return response.data;
  },

  // Get record by ID
  getRecord: async (id: string): Promise<MetadataRecord> => {
    const response = await api.get(`/metadata/${id}`);
    return response.data;
  },

  // Create new record
  createRecord: async (record: Partial<MetadataRecord>): Promise<MetadataRecord> => {
    const response = await api.post('/metadata', record);
    return response.data;
  },

  // Update record
  updateRecord: async (id: string, record: Partial<MetadataRecord>): Promise<MetadataRecord> => {
    const response = await api.put(`/metadata/${id}`, record);
    return response.data;
  },

  // Delete record
  deleteRecord: async (id: string): Promise<void> => {
    await api.delete(`/metadata/${id}`);
  },

  // Get field definitions
  getFieldDefinitions: async (): Promise<FieldDefinitions> => {
    const response = await api.get('/metadata/fields');
    return response.data;
  },
};

export default api;

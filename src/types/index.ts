export interface MetadataRecord {
  id: string;
  metadata: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FieldDefinition {
  name: string;
  type: 'text' | 'select' | 'number' | 'year' | 'array';
  label: string;
  options?: string[];
  maxLength?: number;
  min?: number;
  max?: number;
  minItems?: number;
  itemType?: string;
}

export interface FieldDefinitions {
  predefinedFields: FieldDefinition[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Search-related types
export interface SearchField {
  label: string;
  description: string;
  type: 'exact' | 'text' | 'array' | 'number' | 'range';
}

export interface SearchFields {
  [fieldName: string]: SearchField;
}

export interface SearchParams {
  [fieldName: string]: string;
}

export interface SearchResponse {
  success: boolean;
  query: SearchParams;
  mongoQuery?: any;
  results: MetadataRecord[];
  totalCount: number;
  returnedCount: number;
  hasMore: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  errors?: string[];
}

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

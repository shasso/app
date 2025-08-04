import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Minus, Save, X, Trash2 } from 'lucide-react';
import { metadataApi } from '../utils/api';
import type { FieldDefinition, MetadataRecord } from '../types';

const EditRecord = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MetadataRecord | null>(null);
  const [fieldDefinitions, setFieldDefinitions] = useState<FieldDefinition[]>([]);
  const [activeFields, setActiveFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customFieldName, setCustomFieldName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Record ID is required');
        setLoadingRecord(false);
        return;
      }

      try {
        const [recordData, definitions] = await Promise.all([
          metadataApi.getRecord(id),
          metadataApi.getFieldDefinitions()
        ]);

        setRecord(recordData);
        setFieldDefinitions(definitions.predefinedFields);
        setFormData(recordData.metadata || {});
        setActiveFields(Object.keys(recordData.metadata || {}));
      } catch (err: any) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 404) {
          setError('Record not found');
        } else {
          setError('Failed to load record');
        }
      } finally {
        setLoadingRecord(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleArrayFieldChange = (fieldName: string, index: number, value: string) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        [fieldName]: newArray
      };
    });
  };

  const addArrayItem = (fieldName: string) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: [...currentArray, '']
      };
    });
  };

  const removeArrayItem = (fieldName: string, index: number) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      const newArray = currentArray.filter((_: any, i: number) => i !== index);
      return {
        ...prev,
        [fieldName]: newArray.length > 0 ? newArray : undefined
      };
    });
  };

  const addField = (fieldName: string) => {
    if (!activeFields.includes(fieldName)) {
      setActiveFields(prev => [...prev, fieldName]);
    }
  };

  const removeField = (fieldName: string) => {
    setActiveFields(prev => prev.filter(f => f !== fieldName));
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[fieldName];
      return newData;
    });
  };

  const addCustomField = () => {
    if (customFieldName && !activeFields.includes(customFieldName)) {
      setActiveFields(prev => [...prev, customFieldName]);
      setCustomFieldName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !record) return;

    setLoading(true);
    setError(null);

    try {
      // Filter out empty values
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          if (Array.isArray(value)) {
            const filteredArray = value.filter(item => item !== '');
            if (filteredArray.length > 0) {
              acc[key] = filteredArray;
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);

      const updatedRecord: Partial<MetadataRecord> = {
        metadata: cleanedData
      };

      await metadataApi.updateRecord(id, updatedRecord);
      navigate(`/search?id=${id}`);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to update record');
      }
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await metadataApi.deleteRecord(id);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to delete record');
      }
      console.error('Delete error:', err);
    }
    setShowDeleteConfirm(false);
  };

  const renderField = (fieldName: string) => {
    const fieldDef = fieldDefinitions.find(f => f.name === fieldName);
    const value = formData[fieldName];

    if (fieldDef?.type === 'array') {
      const arrayValue = Array.isArray(value) ? value : (value ? [value] : ['']);
      return (
        <div key={fieldName} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {fieldDef.label}
            </label>
            <button
              type="button"
              onClick={() => removeField(fieldName)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {arrayValue.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayFieldChange(fieldName, index, e.target.value)}
                placeholder={`${fieldDef.label} ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={fieldDef.maxLength}
              />
              {arrayValue.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(fieldName, index)}
                  className="px-2 py-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(fieldName)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add {fieldDef.label}
          </button>
        </div>
      );
    }

    if (fieldDef?.type === 'select') {
      return (
        <div key={fieldName}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {fieldDef.label}
            </label>
            <button
              type="button"
              onClick={() => removeField(fieldName)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {fieldDef.label}</option>
            {fieldDef.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    if (fieldDef?.type === 'number' || fieldDef?.type === 'year') {
      return (
        <div key={fieldName}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {fieldDef.label}
            </label>
            <button
              type="button"
              onClick={() => removeField(fieldName)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value ? parseInt(e.target.value) : undefined)}
            min={fieldDef.min}
            max={fieldDef.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    }

    // Default text field (including custom fields)
    const label = fieldDef?.label || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <div key={fieldName}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <button
            type="button"
            onClick={() => removeField(fieldName)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={fieldDef?.maxLength || 500}
        />
      </div>
    );
  };

  if (loadingRecord) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Record Not Found</h2>
        <p className="text-gray-600 mb-4">{error || 'The requested record could not be found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const availableFields = fieldDefinitions.filter(f => !activeFields.includes(f.name));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Record</h1>
          <p className="text-gray-600">Record ID: {record.id}</p>
          <p className="text-sm text-gray-500">
            Created: {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Unknown'}
            {record.updatedAt && record.updatedAt !== record.createdAt && (
              <> • Updated: {new Date(record.updatedAt).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Record
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Active Fields */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata Fields</h2>
          <div className="space-y-6">
            {activeFields.length > 0 ? (
              activeFields.map(fieldName => renderField(fieldName))
            ) : (
              <p className="text-gray-500 italic">No fields added yet. Add fields below to get started.</p>
            )}
          </div>
        </div>

        {/* Add Fields */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add Fields</h2>
          
          {/* Predefined Fields */}
          {availableFields.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Predefined Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {availableFields.map(field => (
                  <button
                    key={field.name}
                    type="button"
                    onClick={() => addField(field.name)}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Field */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Field</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={customFieldName}
                onChange={(e) => setCustomFieldName(e.target.value)}
                placeholder="Enter custom field name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addCustomField}
                disabled={!customFieldName || activeFields.includes(customFieldName)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Record</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRecord;

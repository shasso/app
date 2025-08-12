import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Save, X } from 'lucide-react';
import { metadataApi } from '../utils/api';
import type { FieldDefinition, MetadataRecord } from '../types';

const CreateRecord = () => {
  const navigate = useNavigate();
  const [fieldDefinitions, setFieldDefinitions] = useState<FieldDefinition[]>([]);
  const [activeFields, setActiveFields] = useState<string[]>(['title']);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customFieldName, setCustomFieldName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    const fetchFieldDefinitions = async () => {
      try {
        const definitions = await metadataApi.getFieldDefinitions();
        setFieldDefinitions(definitions.predefinedFields);
      } catch (err) {
        console.error('Error fetching field definitions:', err);
        setError('Failed to load field definitions');
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFieldDefinitions();
  }, []);

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
    setLoading(true);
    setError(null);

    try {
      // Filter out empty values
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        // Keep values that are not undefined, not empty string, and not empty arrays
        // For numbers, also keep 0 as a valid value
        if (value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          if (Array.isArray(value)) {
            const filteredArray = value.filter(item => item !== '');
            if (filteredArray.length > 0) {
              acc[key] = filteredArray;
            }
          } else if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
            // Include numbers (including 0) and non-empty strings
            acc[key] = value;
          } else if (typeof value !== 'string') {
            // Include other non-string types (booleans, etc.)
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);

      const record: Partial<MetadataRecord> = {
        metadata: cleanedData
      };

      const createdRecord = await metadataApi.createRecord(record);
      navigate(`/records/${createdRecord.id}/edit`);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create record');
      }
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: UI helpers --------------------------------------------------
  const fieldCardBase =
    'relative group rounded-xl border border-gray-200/70 bg-white/70 backdrop-blur-sm px-4 py-3 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-400/40';
  const inputBase =
    'w-full rounded-lg border border-gray-300 bg-white/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all';
  const chipBtn =
    'inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition';

  // --- UPDATED: renderField now uses compact card layout & grid friendliness
  const renderField = (fieldName: string) => {
    const fieldDef = fieldDefinitions.find(f => f.name === fieldName);
    const value = formData[fieldName];

    // Remove button (shared)
    const RemoveBtn = (
      <button
        type="button"
        onClick={() => removeField(fieldName)}
        className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center shadow hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400/40"
        title="Remove field"
      >
        <X className="h-4 w-4" />
      </button>
    );

    if (fieldDef?.type === 'array') {
      const arrayValue = Array.isArray(value) ? value : [''];
      return (
        <div key={fieldName} className={fieldCardBase}>
          {RemoveBtn}
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{fieldDef.label}</p>
          <div className="space-y-2">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayFieldChange(fieldName, index, e.target.value)}
                  placeholder={`${fieldDef.label} ${index + 1}`}
                  className={inputBase}
                  maxLength={fieldDef.maxLength}
                />
                {arrayValue.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(fieldName, index)}
                    className="h-8 w-8 shrink-0 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400/40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(fieldName)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add {fieldDef.label}
            </button>
          </div>
        </div>
      );
    }

    if (fieldDef?.type === 'select') {
      return (
        <div key={fieldName} className={fieldCardBase}>
          {RemoveBtn}
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {fieldDef.label}
          </label>
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={`${inputBase} pr-8`}
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
        <div key={fieldName} className={fieldCardBase}>
          {RemoveBtn}
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {fieldDef.label}
          </label>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value ? parseInt(e.target.value) : '')}
            min={fieldDef.min}
            max={fieldDef.max}
            className={inputBase}
          />
        </div>
      );
    }

    const label = fieldDef?.label || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <div key={fieldName} className={fieldCardBase}>
        {RemoveBtn}
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className={inputBase}
          maxLength={fieldDef?.maxLength || 500}
        />
      </div>
    );
  };

  if (loadingFields) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const availableFields = fieldDefinitions.filter(f => !activeFields.includes(f.name));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Create New Record</h1>
        <p className="text-sm text-gray-600">Define only the fields you need. Compact grid auto-expands.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Active Fields */}
        <section className="rounded-2xl border border-gray-200/70 bg-white/60 backdrop-blur-sm p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Metadata Fields</h2>
            <span className="text-xs text-gray-500">{activeFields.length} active</span>
          </div>
          {activeFields.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-500">
              Select fields below to begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeFields.map(fieldName => renderField(fieldName))}
            </div>
          )}
        </section>

        {/* Add Fields */}
        <section className="rounded-2xl border border-gray-200/70 bg-white/60 backdrop-blur-sm p-5 shadow-sm space-y-6">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Add Fields</h2>

          {/* Custom Field Quick Add */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customFieldName}
              onChange={(e) => setCustomFieldName(e.target.value)}
              placeholder="Custom field name"
              className={inputBase}
            />
            <button
              type="button"
              onClick={addCustomField}
              disabled={!customFieldName || activeFields.includes(customFieldName)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            >
              <Plus className="h-4 w-4" /> Add Custom
            </button>
          </div>

          {/* Predefined Field Chips */}
          {availableFields.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Predefined</p>
              <div className="flex flex-wrap gap-2">
                {availableFields.map(field => (
                  <button
                    key={field.name}
                    type="button"
                    onClick={() => addField(field.name)}
                    className={chipBtn}
                  >
                    <Plus className="h-3 w-3" /> {field.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 z-10 -mx-2 md:mx-0 pb-2 pt-3 bg-gradient-to-t from-white/90 via-white/70 to-transparent backdrop-blur-sm">
          <div className="flex justify-end gap-3 px-2 md:px-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="h-10 rounded-lg border border-gray-300 bg-white/70 px-5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || activeFields.length === 0}
              className="h-10 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold tracking-wide text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRecord;

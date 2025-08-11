import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  User,
  Tag,
  Globe,
  BookOpen,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { metadataApi } from '../utils/api';
import type { MetadataRecord } from '../types';

const ViewRecord = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<MetadataRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecord(id);
    }
  }, [id]);

  const loadRecord = async (recordId: string) => {
    try {
      setLoading(true);
      const response = await metadataApi.getRecord(recordId);
      setRecord(response);
    } catch (err: any) {
      setError('Failed to load record');
      console.error('Error loading record:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;

    try {
      await metadataApi.deleteRecord(record.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete record');
      console.error('Delete error:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatFieldValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value || '');
  };

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'title':
      case 'subtitle':
        return <BookOpen className="w-5 h-5" />;
      case 'authors':
        return <User className="w-5 h-5" />;
      case 'year':
        return <Calendar className="w-5 h-5" />;
      case 'genre':
        return <Tag className="w-5 h-5" />;
      case 'country':
        return <Globe className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading record...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Record Not Found
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {error || 'The requested record could not be found.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Dashboard
            </button>
            <Link
              to="/search"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              Search Records
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex gap-3">
            <Link
              to={`/records/${record.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Record Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Record Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">
              {record.metadata.title || 'Untitled Record'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono bg-white/20 px-3 py-1 rounded-lg">
                {record.id}
              </span>
              <button
                onClick={() => copyToClipboard(record.id)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                title="Copy ID"
              >
                {copySuccess ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copySuccess && <span className="text-sm">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Record Content */}
          <div className="p-6">
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.entries(record.metadata).map(([key, value]) => 
                value && (
                  <div key={key} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getFieldIcon(key)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                    <div className="ml-11">
                      {typeof value === 'object' && value !== null ? (
                        <pre className="text-gray-700 text-sm whitespace-pre-wrap bg-white p-3 rounded-lg border">
                          {formatFieldValue(value)}
                        </pre>
                      ) : (
                        <p className="text-gray-700 text-sm break-words">
                          {formatFieldValue(value)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Record Timestamps */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {record.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(record.createdAt).toLocaleString()}</span>
                  </div>
                )}
                {record.updatedAt && record.updatedAt !== record.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Updated: {new Date(record.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Record</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this record? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecord;

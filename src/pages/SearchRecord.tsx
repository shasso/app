import { useState } from 'react';
import { Search, Edit, Trash2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { metadataApi } from '../utils/api';
import type { MetadataRecord } from '../types';

const SearchRecord = () => {
  const [searchId, setSearchId] = useState('');
  const [record, setRecord] = useState<MetadataRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError(null);
    setRecord(null);

    try {
      const foundRecord = await metadataApi.getRecord(searchId.trim());
      setRecord(foundRecord);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Record not found');
      } else if (err.response?.status === 400) {
        setError('Invalid ID format');
      } else {
        setError('Failed to search for record');
      }
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;

    try {
      await metadataApi.deleteRecord(record.id);
      setRecord(null);
      setShowDeleteConfirm(false);
      setSearchId('');
    } catch (err) {
      setError('Failed to delete record');
      console.error('Delete error:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Records</h1>
        <p className="text-gray-600">
          Enter a record ID to search for and view metadata records.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="searchId" className="block text-sm font-medium text-gray-700 mb-2">
              Record ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="searchId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter GUID (e.g., 1d05964e-cc5c-4512-a3ac-a9e64ce25b58)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !searchId.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {record && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {/* Record Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {record.metadata.title || 'Untitled Record'}
                </h2>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">ID: {record.id}</span>
                  <button
                    onClick={() => copyToClipboard(record.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                    title="Copy ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit/${record.id}`}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Record Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Metadata Fields */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Metadata</h3>
                <div className="space-y-3">
                  {Object.entries(record.metadata).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">System Information</h3>
                <div className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {formatDate(record.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {formatDate(record.updatedAt)}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <Trash2 className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-3">Delete Record</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this record? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchRecord;

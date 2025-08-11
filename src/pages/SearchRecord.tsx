import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Calendar,
  Tag,
  Globe,
  BookOpen,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  Users,
  MapPin,
  Hash,
  Clock,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { metadataApi } from '../utils/api';
import type { MetadataRecord, SearchFields, SearchParams, SearchResponse } from '../types';

const SearchRecord = () => {
  const [searchFields, setSearchFields] = useState<SearchFields>({});
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MetadataRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchMode, setSearchMode] = useState<'quick' | 'advanced'>('quick');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load available search fields on component mount
  useEffect(() => {
    const loadSearchFields = async () => {
      try {
        const fields = await metadataApi.getSearchFields();
        setSearchFields(fields);
      } catch (err) {
        console.error('Failed to load search fields:', err);
      }
    };
    loadSearchFields();
  }, []);

  // Handle search execution
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Check if we have any search parameters
    const hasParams = Object.values(searchParams).some(value => value.trim() !== '');
    if (!hasParams) return;

    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await metadataApi.executeSearch(searchParams);
      setSearchResults(response);
    } catch (err: any) {
      setError('Failed to execute search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search parameter changes
  const handleParamChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear search
  const clearSearch = () => {
    setSearchParams({});
    setSearchResults(null);
    setError(null);
  };

  // Copy record ID to clipboard with visual feedback
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle record deletion
  const handleDelete = async () => {
    if (!selectedRecord) return;

    try {
      await metadataApi.deleteRecord(selectedRecord.id);
      setSearchResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          results: prev.results.filter(r => r.id !== selectedRecord.id),
          totalCount: prev.totalCount - 1,
          returnedCount: prev.returnedCount - 1
        };
      });
      setSelectedRecord(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError('Failed to delete record');
      console.error('Delete error:', err);
    }
  };

  // Format display value for record fields
  const formatFieldValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || '');
  };

  // Get appropriate icon for field type
  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'id':
        return <Hash className="w-4 h-4" />;
      case 'title':
        return <BookOpen className="w-4 h-4" />;
      case 'subtitle':
        return <FileText className="w-4 h-4" />;
      case 'authors':
        return <Users className="w-4 h-4" />;
      case 'year':
        return <Calendar className="w-4 h-4" />;
      case 'genre':
        return <Tag className="w-4 h-4" />;
      case 'country':
        return <MapPin className="w-4 h-4" />;
      case 'language':
        return <Globe className="w-4 h-4" />;
      case 'source':
        return <Database className="w-4 h-4" />;
      case 'createdAt':
      case 'updatedAt':
        return <Clock className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Advanced Search
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover metadata records with powerful search capabilities. 
            Use any combination of fields to find exactly what you're looking for.
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-10">
          <form onSubmit={handleSearch} className="space-y-8">
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-2xl inline-flex">
                <button
                  type="button"
                  onClick={() => setSearchMode('quick')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    searchMode === 'quick'
                      ? 'bg-white shadow-lg text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Quick Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode('advanced')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    searchMode === 'advanced'
                      ? 'bg-white shadow-lg text-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Advanced Search
                </button>
              </div>
            </div>

            {/* Quick Search Mode */}
            {searchMode === 'quick' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Search</h3>
                  <p className="text-gray-600">Search by ID or title for instant results</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID Search */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Search by ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter record ID..."
                        value={searchParams.id || ''}
                        onChange={(e) => handleParamChange('id', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                      />
                    </div>
                  </div>

                  {/* Title Search */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      Search by Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter title keywords..."
                        value={searchParams.title || ''}
                        onChange={(e) => handleParamChange('title', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Search Mode */}
            {searchMode === 'advanced' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Advanced Search
                  </h3>
                  <p className="text-gray-600">Use multiple criteria to refine your search</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(searchFields).map(([fieldName, field]) => (
                    <div key={fieldName} className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        {getFieldIcon(fieldName)}
                        <span>{field.label}</span>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {field.type}
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.description}
                          value={searchParams[fieldName] || ''}
                          onChange={(e) => handleParamChange(fieldName, e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Search Records
                  </>
                )}
              </button>
              
              {Object.keys(searchParams).length > 0 && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <X className="w-6 h-6" />
                  Clear All
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-lg mb-1">Search Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Searching Records</h3>
            <p className="text-gray-600">Please wait while we find your results...</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults && !loading && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    Search Results
                  </h2>
                  <p className="text-lg text-gray-600">
                    Found <span className="font-bold text-green-600">{searchResults.totalCount}</span> record{searchResults.totalCount !== 1 ? 's' : ''} 
                    {searchResults.totalCount > 0 && (
                      <span className="ml-2 text-gray-500">
                         • Showing {searchResults.returnedCount} results
                      </span>
                    )}
                  </p>
                </div>
                
                {Object.keys(searchParams).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(searchParams).map(([field, value]) => 
                      value && (
                        <span key={field} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-xl text-sm font-medium border border-blue-200">
                          {getFieldIcon(field)}
                          <span className="font-semibold">{field}:</span>
                          <span>{value}</span>
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Results List */}
            {searchResults.results.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any records matching your search criteria. 
                  Try adjusting your filters or using different keywords.
                </p>
                <button
                  onClick={clearSearch}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Clear Search & Try Again
                </button>
              </div>
            ) : (
              <div className="grid gap-8">
                {searchResults.results.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden group hover:scale-[1.02]"
                  >
                    <div className="p-8">
                      {/* Record Header */}
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                            {record.metadata.title || 'Untitled Record'}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="font-mono bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-lg text-sm border">
                              {record.id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(record.id)}
                              className={`p-2 rounded-lg transition-all duration-300 ${
                                copiedId === record.id
                                  ? 'bg-green-100 text-green-600'
                                  : 'hover:bg-gray-100 text-gray-600'
                              }`}
                              title={copiedId === record.id ? 'Copied!' : 'Copy ID'}
                            >
                              {copiedId === record.id ? (
                                <span className="text-xs font-semibold">✓ Copied</span>
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            to={`/records/${record.id}`}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 font-semibold transform hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <Link
                            to={`/records/${record.id}/edit`}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center gap-2 font-semibold transform hover:scale-105"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowDeleteConfirm(true);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 font-semibold transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Record Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {Object.entries(record.metadata).map(([key, value]) => 
                          value && (
                            <div key={key} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-1 bg-white rounded-lg">
                                  {getFieldIcon(key)}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                              <p className="text-gray-900 font-medium break-words">
                                {formatFieldValue(value)}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* Record Timestamps */}
                      <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                        {record.createdAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Created: {new Date(record.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {record.updatedAt && record.updatedAt !== record.createdAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Updated: {new Date(record.updatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Info */}
            {searchResults.hasMore && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/20">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-200"></div>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  Showing {searchResults.returnedCount} of {searchResults.totalCount} results
                </p>
                <p className="text-sm text-gray-600">
                  Pagination features coming soon
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete Record</h3>
                <p className="text-gray-600 mb-2 font-medium">
                  Are you sure you want to delete this record?
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  "{selectedRecord.metadata.title || 'Untitled Record'}" will be permanently removed and cannot be recovered.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                  >
                    Delete Forever
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

export default SearchRecord;

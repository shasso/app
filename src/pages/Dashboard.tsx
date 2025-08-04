import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock } from 'lucide-react';
import { metadataApi } from '../utils/api';
import type { MetadataRecord } from '../types';

const Dashboard = () => {
  const [recentRecords, setRecentRecords] = useState<MetadataRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentRecords = async () => {
      try {
        const records = await metadataApi.getAllRecords();
        setTotalRecords(records.length);
        
        // Sort by updatedAt/createdAt and take the first 5
        const sorted = records
          .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);
        setRecentRecords(sorted);
      } catch (err) {
        setError('Failed to load recent records');
        console.error('Error fetching records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRecords();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Metadata Editor Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage and organize metadata for your corpus items with dynamic fields
          and flexible data structures.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Total Records
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {totalRecords}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Recently Updated
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {recentRecords.filter(r => r.updatedAt && r.updatedAt !== r.createdAt).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Start
              </h3>
              <Link 
                to="/create"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create New Record →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Recent Records</h2>
          </div>
        </div>

        {error ? (
          <div className="p-6 text-center text-red-600">
            {error}
          </div>
        ) : recentRecords.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No records found. Create your first record to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentRecords.map((record) => (
              <Link
                key={record.id}
                to={`/edit/${record.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {record.metadata.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {record.id}
                    </p>
                    {record.metadata.authors && (
                      <p className="text-sm text-gray-500">
                        Authors: {Array.isArray(record.metadata.authors) 
                          ? record.metadata.authors.join(', ') 
                          : record.metadata.authors}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Updated: {formatDate(record.updatedAt)}
                    </p>
                    {record.metadata.genre && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.metadata.genre}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

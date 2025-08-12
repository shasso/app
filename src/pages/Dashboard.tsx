import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FileText,
  Clock,
  RefreshCcw,
  Zap,
  Activity,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { metadataApi } from '../utils/api';
import type { MetadataRecord } from '../types';

// Utility formatters
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
};

const numberFmt = (n: number) => new Intl.NumberFormat().format(n);

const Dashboard = () => {
  const [recentRecords, setRecentRecords] = useState<MetadataRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const records = await metadataApi.getAllRecords();
      setTotalRecords(records.length);

      const sorted = records
        .sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 8); // show more in compact layout
      setRecentRecords(sorted);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await loadData();
  };

  const updatedCount = useMemo(
    () => recentRecords.filter(r => r.updatedAt && r.updatedAt !== r.createdAt).length,
    [recentRecords]
  );

  const uniqueAuthors = useMemo(() => {
    const set = new Set<string>();
    recentRecords.forEach(r => {
      const authors = r.metadata?.authors;
      if (Array.isArray(authors)) authors.forEach(a => a && set.add(a));
      else if (typeof authors === 'string' && authors.trim()) set.add(authors.trim());
    });
    return set.size;
  }, [recentRecords]);

  // Loading Skeletons
  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <div className="h-8 w-72 mx-auto bg-gradient-to-r from-indigo-200/60 via-purple-200/60 to-indigo-200/60 rounded animate-pulse" />
          <div className="h-4 w-96 max-w-full mx-auto bg-indigo-100/60 rounded animate-pulse" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur border border-white/40 dark:border-neutral-700/40 shadow-sm p-5">
              <div className="h-6 w-1/3 bg-indigo-100/70 dark:bg-neutral-700 rounded mb-4 animate-pulse" />
              <div className="h-10 w-16 bg-indigo-200/70 dark:bg-neutral-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/40 dark:border-neutral-700/40 bg-white/70 dark:bg-neutral-800/60 backdrop-blur shadow-sm p-6">
          <div className="h-6 w-40 bg-indigo-100/70 dark:bg-neutral-700 rounded mb-6 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-indigo-50/70 dark:bg-neutral-700/60 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500" aria-live="polite">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Metadata Dashboard
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Overview of your corpus metadata. Create, track updates, and jump back into recent work quickly.
          </p>
          {lastUpdated && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-white/70 dark:bg-neutral-800/70 backdrop-blur border border-neutral-200/70 dark:border-neutral-700/60 shadow-sm hover:bg-white/90 dark:hover:bg-neutral-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing' : 'Refresh'}
          </button>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition"
          >
            <Plus className="h-4 w-4" /> New Record
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Records"
          value={numberFmt(totalRecords)}
          icon={FileText}
          accent="from-indigo-500/20 via-indigo-500/10 to-transparent"
          description="All metadata entries"
        />
        <StatCard
          title="Recently Updated"
          value={numberFmt(updatedCount)}
          icon={Activity}
          accent="from-purple-500/20 via-purple-500/10 to-transparent"
          description="Edited last sync"
        />
        <StatCard
          title="Unique Authors (recent)"
            value={numberFmt(uniqueAuthors)}
          icon={Zap}
          accent="from-amber-500/25 via-amber-500/10 to-transparent"
          description="Distinct author names"
        />
        <StatCard
          title="Recent Slice"
          value={numberFmt(recentRecords.length)}
          icon={Clock}
          accent="from-green-500/25 via-green-500/10 to-transparent"
          description="Shown below"
        />
      </div>

      {/* Recent Records Panel */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200/70 dark:border-neutral-700/60 bg-white/70 dark:bg-neutral-800/60 backdrop-blur shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-700/60">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-neutral-700 dark:text-neutral-200">Recent Records</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="hidden sm:inline">Showing latest {recentRecords.length} updates</span>
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
            >
              <RefreshCcw className="h-4 w-4" /> Retry
            </button>
          </div>
        ) : recentRecords.length === 0 ? (
          <div className="p-10 text-center space-y-6">
            <FileText className="h-14 w-14 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <div className="space-y-2">
              <p className="text-base font-medium text-neutral-700 dark:text-neutral-200">No records yet</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">Create your first metadata record to populate the dashboard and begin organizing your corpus.</p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition"
            >
              <Plus className="h-4 w-4" /> Create Record
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200/60 dark:divide-neutral-700/60">
            {recentRecords.map(record => {
              const title = record.metadata?.title || 'Untitled';
              const authors = record.metadata?.authors;
              const authorText = Array.isArray(authors) ? authors.join(', ') : authors;
              const genre = record.metadata?.genre;
              return (
                <li key={record.id}>
                  <Link
                    to={`/records/${record.id}/edit`}
                    className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-6 py-4 hover:bg-indigo-50/60 dark:hover:bg-neutral-700/40 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {title}
                        </h3>
                        {genre && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 ring-1 ring-inset ring-indigo-400/30">
                            {genre}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                        <span className="truncate">ID: {record.id}</span>
                        {authorText && <span className="truncate">Authors: {authorText}</span>}
                      </div>
                    </div>
                    <div className="flex items-start sm:items-center gap-6 text-[11px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      <span>Updated {formatDate(record.updatedAt || record.createdAt)}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-indigo-100/80 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 ring-1 ring-inset ring-indigo-400/30 group-hover:bg-indigo-200/80 dark:group-hover:bg-indigo-800/50 transition-colors">
                        <Pencil className="h-3 w-3" /> Edit
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  accent?: string; // gradient accent tailwind classes
}

const StatCard = ({ title, value, icon: Icon, description, accent }: StatCardProps) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white/70 dark:bg-neutral-800/60 backdrop-blur border border-neutral-200/70 dark:border-neutral-700/60 shadow-sm hover:shadow-md transition-shadow">
      <div className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${accent || 'from-indigo-500/10 via-indigo-500/5 to-transparent'}`} />
      <div className="relative p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-neutral-500 dark:text-neutral-400">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-100 dark:via-neutral-50 dark:to-neutral-100 bg-clip-text text-transparent">
                {value}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent text-indigo-600 dark:text-indigo-400 shadow-inner ring-1 ring-inset ring-indigo-500/20">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {description && (
          <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400/80">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Search, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const year = new Date().getFullYear();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Create Record', href: '/create', icon: Plus },
    { name: 'Search Records', href: '/search', icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Metadata Editor
              </h1>
            </div>
            <nav className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Enhanced Footer Section */}
      <div className="mt-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" aria-hidden="true" />
        <footer className="bg-gradient-to-b from-white/90 to-gray-100/90 dark:from-neutral-800/80 dark:to-neutral-900/80 backdrop-blur-sm border-t border-gray-200/60 dark:border-neutral-700/60 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-600 dark:text-neutral-400">
            <span className="block font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Metadata Editor
            </span>
            <span>© {year} </span>
            <a
              href="https://sparksoftsystems.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sparksoft Systems
            </a>
            <span>. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;

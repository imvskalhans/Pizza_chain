/**
 * @file Header component for the customer list, including search and refresh.
 */
import React from 'react';
import { Search, X, RefreshCw } from 'lucide-react';

export const CustomerListHeader = ({ searchTerm, onSearchChange, onClearSearch, onRefresh, isRefreshing, displayRange }) => (
  <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="relative w-full md:w-auto md:flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
      />
      {searchTerm && (
        <button onClick={onClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
    <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{displayRange}</span>
        <button onClick={onRefresh} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors">
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
    </div>
  </div>
);

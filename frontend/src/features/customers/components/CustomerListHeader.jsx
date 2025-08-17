/**
 * @file A dedicated search component for the customer list.
 */
import React from 'react';
import { Search, X } from 'lucide-react';

export const CustomerListHeader = ({ searchTerm, onSearchChange, onClearSearch }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Search className="h-5 w-5 mr-2 text-orange-600" />
      Quick Search
    </h3>
    <div className="relative">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 transition-all duration-300"
      />
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  </div>
);

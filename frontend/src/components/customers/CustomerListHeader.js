/**
 * @file Header component for the customer list page, containing search and refresh controls.
 */
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

export const CustomerListHeader = ({ searchTerm, onSearchChange, onClearSearch, onRefresh, isRefreshing, displayRange, debouncedSearchTerm }) => (
    <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
                {searchTerm && (
                    <button
                        onClick={onClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
            {debouncedSearchTerm ? (
                <span>Search results for "{debouncedSearchTerm}": {displayRange}</span>
            ) : (
                <span>Showing {displayRange} customers</span>
            )}
        </div>
    </div>
);

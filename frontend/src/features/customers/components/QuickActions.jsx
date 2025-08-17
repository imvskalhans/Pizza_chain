/**
 * @file A component for quick actions like adding, refreshing, and exporting customers.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Download, Filter } from 'lucide-react';

export const QuickActions = ({ onRefresh, isRefreshing, onExport }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-orange-600" />
            Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
                to="/"
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add New
            </Link>
            <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium disabled:opacity-50"
            >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
            </button>
            <button
                onClick={onExport}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
                <Download className="h-4 w-4 mr-2" />
                Export
            </button>
        </div>
    </div>
);

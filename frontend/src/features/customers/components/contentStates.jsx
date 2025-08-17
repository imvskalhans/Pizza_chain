/**
 * @file Components for displaying loading, error, and empty states.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';

export const LoadingState = () => (
    <div className="p-12">
        <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading customers...</p>
        </div>
    </div>
);

export const ErrorState = ({ error, onRetry }) => (
    <div className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={onRetry} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
                Try Again
            </button>
        </div>
    </div>
);

export const EmptyState = ({ searchTerm, onClearSearch }) => (
    <div className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            {searchTerm ? (
                <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
                    <p className="text-gray-600 mb-4">No customers match your search for "{searchTerm}"</p>
                    <button onClick={onClearSearch} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                        Clear Search
                    </button>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first customer.</p>
                    <Link to="/" className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
                        <Plus className="h-5 w-5 mr-2" />
                        Add First Customer
                    </Link>
                </>
            )}
        </div>
    </div>
);

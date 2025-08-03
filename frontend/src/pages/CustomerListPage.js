import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getAllCustomers, deleteCustomer, API_BASE_URL_STATIC } from '../api/customerService';
import { Edit, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, Users } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Navigation = () => (
    <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex items-center justify-center gap-2 mb-8 max-w-sm mx-auto">
        <NavLink
            to="/"
            className={({ isActive }) => `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200/70'
            }`}
        >
            Register
        </NavLink>
        <NavLink
            to="/customers"
            className={({ isActive }) => `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200/70'
            }`}
        >
            Customer List
        </NavLink>
    </nav>
);

// Debounce hook for search optimization
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Pagination and filtering state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    // Search and sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'firstName', // Default to firstName
        direction: 'asc' // Ascending alphabetical order
    });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    // Debounce search term to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Memoized sort string to prevent unnecessary re-renders
    const sortString = useMemo(() => {
        return `${sortConfig.key},${sortConfig.direction}`;
    }, [sortConfig.key, sortConfig.direction]);

    // Optimized fetchCustomers function
    const fetchCustomers = useCallback(async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const data = await getAllCustomers(
                currentPage,
                pageSize,
                sortString,
                debouncedSearchTerm.trim()
            );

            setCustomers(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);

        } catch (err) {
            console.error('Error fetching customers:', err);
            setError(err.message || 'Failed to load customers');
            setCustomers([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentPage, pageSize, sortString, debouncedSearchTerm]);

    // Effect to fetch data when dependencies change
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Reset to first page when search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchTerm) return; // Avoid reset during debounce
        if (currentPage !== 0) {
            setCurrentPage(0);
        }
    }, [debouncedSearchTerm, currentPage, searchTerm]);

    // Delete handlers
    const handleDeleteClick = useCallback((customer) => {
        setCustomerToDelete(customer);
        setIsModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!customerToDelete) return;

        try {
            await deleteCustomer(customerToDelete.id);
            // Refresh the current page, but if it becomes empty, go to previous page
            const newTotal = totalElements - 1;
            const maxPage = Math.max(0, Math.ceil(newTotal / pageSize) - 1);
            if (currentPage > maxPage) {
                setCurrentPage(maxPage);
            } else {
                fetchCustomers(true); // Refresh with loading indicator
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete customer');
        } finally {
            setIsModalOpen(false);
            setCustomerToDelete(null);
        }
    }, [customerToDelete, currentPage, totalElements, pageSize, fetchCustomers]);

    // Sort handler
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            const direction = (prevConfig.key === key && prevConfig.direction === 'asc') ? 'desc' : 'asc';
            return { key, direction };
        });
        setCurrentPage(0); // Reset to first page when sorting changes
    }, []);

    // Search handler
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    // Refresh handler
    const handleRefresh = useCallback(() => {
        fetchCustomers(true);
    }, [fetchCustomers]);

    // Sort indicator component
    const getSortIndicator = useCallback((key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ?
            <ArrowUp className="w-4 h-4 ml-2 text-orange-500" /> :
            <ArrowDown className="w-4 h-4 ml-2 text-orange-500" />;
    }, [sortConfig]);

    // Pagination handlers
    const goToPreviousPage = useCallback(() => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    }, []);

    const goToNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    }, [totalPages]);

    const goToPage = useCallback((page) => {
        setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));
    }, [totalPages]);

    // Generate page numbers for pagination
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    // Get display range for results
    const displayRange = useMemo(() => {
        if (totalElements === 0) return "0 - 0 of 0";
        const start = currentPage * pageSize + 1;
        const end = Math.min((currentPage + 1) * pageSize, totalElements);
        return `${start} - ${end} of ${totalElements}`;
    }, [currentPage, pageSize, totalElements]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete ${customerToDelete?.firstName} ${customerToDelete?.lastName}? This action cannot be undone.`}
            />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Valued Customers</h1>
                <p className="text-lg text-gray-600">
                    {totalElements > 0 ? `${totalElements} customers in our community` : 'Building our community'}
                </p>
            </div>

            <Navigation />

            {/* Main Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
                {/* Search and Actions Bar */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Results info */}
                    <div className="mt-4 text-sm text-gray-600">
                        {debouncedSearchTerm ? (
                            <span>Search results for "{debouncedSearchTerm}": {displayRange}</span>
                        ) : (
                            <span>Showing {displayRange} customers</span>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-2 text-gray-600">Loading customers...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-6 text-center">
                        <div className="text-red-600 mb-2">⚠️ {error}</div>
                        <button
                            onClick={() => fetchCustomers()}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <button
                                                onClick={() => requestSort('firstName')}
                                                className="flex items-center hover:text-gray-700 transition-colors"
                                            >
                                                Name {getSortIndicator('firstName')}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <button
                                                onClick={() => requestSort('email')}
                                                className="flex items-center hover:text-gray-700 transition-colors"
                                            >
                                                Contact {getSortIndicator('email')}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <img
                                                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                                                src={customer.photoPath ?
                                                                    `${API_BASE_URL_STATIC}${customer.photoPath}` :
                                                                    `https://placehold.co/48x48/f97316/white?text=${customer.firstName.charAt(0)}`
                                                                }
                                                                alt={`${customer.firstName}'s profile`}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {customer.firstName} {customer.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 capitalize">
                                                                {customer.gender} • {customer.dob && new Date().getFullYear() - new Date(customer.dob).getFullYear()} years
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{customer.email}</div>
                                                    <div className="text-sm text-gray-500">{customer.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>{customer.country}</div>
                                                    <div>{customer.city}, {customer.state}</div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/edit/${customer.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                                            title="Edit customer"
                                                        >
                                                            <Edit className="w-4 h-4"/>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(customer)}
                                                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                            title="Delete customer"
                                                        >
                                                            <Trash2 className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="text-gray-400 mb-2">
                                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                </div>
                                                <div className="text-gray-500 font-medium">
                                                    {debouncedSearchTerm ? 'No customers found matching your search' : 'No customers yet'}
                                                </div>
                                                <div className="text-gray-400 text-sm mt-1">
                                                    {debouncedSearchTerm ? 'Try adjusting your search terms' : 'Customers will appear here once they register'}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {displayRange}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 0}
                                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {pageNumbers.map(page => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                    page === currentPage
                                                        ? 'bg-orange-500 text-white'
                                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage >= totalPages - 1}
                                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerListPage;
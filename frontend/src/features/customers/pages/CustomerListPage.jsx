/**
 * @file Enhanced customer list page with improved UI and modularity
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Users, Plus, Filter, Grid, List, Search, RefreshCw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteCustomer } from '../../../api/customerService';
import { useCustomerTable } from '../hooks/useCustomerTable';
import { CustomerTable } from '../components/CustomerTable';
import { Pagination } from '../../../components/common/Pagination';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useNotification } from '../../../hooks/useNotification';
import { StatsCard } from '../components/StatsCard';
import { LoadingState, ErrorState, EmptyState } from '../components/contentStates';
import { locationData } from '../../../data/locationData';
import { CustomerGridCard } from '../components/CustomerGridCard';
import FeedbackModal from '../components/FeedbackModal';

const CustomerListPage = () => {
    const [viewMode, setViewMode] = useState('table');
    const {
        customers, loading, refreshing, error, currentPage, totalPages, totalElements,
        searchTerm, debouncedSearchTerm, sortConfig, displayRange, fetchCustomers,
        requestSort, handleSearchChange, clearSearch, handleRefresh, handlePageChange,
        filters, setFilters
    } = useCustomerTable(viewMode);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const { showNotification } = useNotification();
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleDeleteClick = useCallback((customer) => {
        setCustomerToDelete(customer);
        setIsModalOpen(true);
    }, []);

    const handleFeedbackClick = useCallback((customer) => {
        setSelectedCustomer(customer);
        setIsFeedbackModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!customerToDelete) return;
        try {
            await deleteCustomer(customerToDelete.id);
            showNotification('Customer deleted successfully.', 'success');
            fetchCustomers(true);
        } catch (err) {
            showNotification(err.message || 'Failed to delete customer.', 'error');
        } finally {
            setIsModalOpen(false);
            setCustomerToDelete(null);
        }
    }, [customerToDelete, showNotification, fetchCustomers]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const toggleFilters = () => {
        if (showFilters) {
            setFilters({ country: '', gender: '', ageRange: '' });
        }
        setShowFilters(!showFilters);
    };

    const handleExport = useCallback(() => {
        showNotification('Exporting customer data...', 'success');
    }, [showNotification]);

    const stats = useMemo(() => ({
        total: totalElements,
        active: Math.floor(totalElements * 0.85), // This is a mock value
        new: Math.floor(totalElements * 0.15), // This is a mock value
        countries: new Set(customers.map(c => c.country)).size || 0
    }), [totalElements, customers]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete ${customerToDelete?.firstName} ${customerToDelete?.lastName}?`}
                confirmText="Delete"
            />
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                customer={selectedCustomer}
            />

            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                            <p className="text-gray-600 mt-1">
                                {totalElements > 0 ? `Managing ${totalElements.toLocaleString()} valued customers` : 'Start building your customer community'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleFilters} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${showFilters ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                            <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'table' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>
                                <List className="h-4 w-4" />
                            </button>
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>
                                <Grid className="h-4 w-4" />
                            </button>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <Plus className="h-4 w-4" />
                            Add Customer
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Customers" value={stats.total.toLocaleString()} change="+12%" icon={<Users className="h-6 w-6 text-orange-600" />} color="orange" />
                <StatsCard title="Active Customers" value={stats.active.toLocaleString()} change="+8%" icon={<div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-white rounded-full"></div></div>} color="green" />
                <StatsCard title="New This Month" value={stats.new.toLocaleString()} change="+24%" icon={<Plus className="h-6 w-6 text-purple-600" />} color="purple" />
                <StatsCard title="Countries" value={stats.countries} change="Global reach" icon={<div className="h-6 w-6 text-blue-600">🌍</div>} color="blue" />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                            {searchTerm && (
                                <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                                <Download className="h-4 w-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <select value={filters.country} onChange={(e) => handleFilterChange('country', e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500">
                                    <option value="">All Countries</option>
                                    {Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500">
                                    <option value="">All Genders</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <select value={filters.ageRange} onChange={(e) => handleFilterChange('ageRange', e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500">
                                    <option value="">By Age</option>
                                    <option value="0-18">0-18</option>
                                    <option value="19-35">19-35</option>
                                    <option value="36-50">36-50</option>
                                    <option value="51+">51+</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <LoadingState />
                ) : error ? (
                    <ErrorState error={error} onRetry={() => fetchCustomers(true)} />
                ) : customers.length === 0 ? (
                    <EmptyState searchTerm={debouncedSearchTerm} onClearSearch={clearSearch} />
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <CustomerTable
                                customers={customers}
                                sortConfig={sortConfig}
                                onSort={requestSort}
                                onDeleteClick={handleDeleteClick}
                                onFeedbackClick={handleFeedbackClick}
                            />
                        ) : (
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {customers.map(customer => (
                                    <CustomerGridCard
                                        key={customer.id}
                                        customer={customer}
                                        onDeleteClick={handleDeleteClick}
                                        onFeedbackClick={handleFeedbackClick}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                displayRange={displayRange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerListPage;

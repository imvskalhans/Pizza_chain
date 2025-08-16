/**
 * @file This page displays a list of all customers.
 */
import React, { useState, useCallback } from 'react';
import { Users } from 'lucide-react';
import { deleteCustomer } from '../../../api/customerService';
import { useCustomerTable } from '../hooks/useCustomerTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { CustomerListHeader } from '../components/CustomerListHeader';
import { CustomerTable } from '../components/CustomerTable';
import { Pagination } from '../../../components/common/Pagination';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useNotification } from '../../../hooks/useNotification';
import { Navigation } from '../../../components/common/Navigation';

const CustomerListPage = () => {
    const {
        customers, loading, refreshing, error, currentPage, totalPages, totalElements,
        searchTerm, debouncedSearchTerm, sortConfig, displayRange, fetchCustomers,
        requestSort, handleSearchChange, clearSearch, handleRefresh, handlePageChange,
        setCurrentPage
    } = useCustomerTable();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const { showNotification } = useNotification();

    const handleDeleteClick = useCallback((customer) => {
        setCustomerToDelete(customer);
        setIsModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!customerToDelete) return;
        try {
            await deleteCustomer(customerToDelete.id);
            showNotification('Customer deleted successfully.', 'success');
            const newTotal = totalElements - 1;
            const maxPage = Math.max(0, Math.ceil(newTotal / 10) - 1);
            if (currentPage > maxPage) {
                setCurrentPage(maxPage);
            } else {
                fetchCustomers(true);
            }
        } catch (err) {
            showNotification(err.message || 'Failed to delete customer.', 'error');
        } finally {
            setIsModalOpen(false);
            setCustomerToDelete(null);
        }
    }, [customerToDelete, totalElements, currentPage, fetchCustomers, setCurrentPage, showNotification]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete ${customerToDelete?.firstName} ${customerToDelete?.lastName}?`}
                confirmText="Delete"
            />
            <PageHeader
              icon={<Users />}
              title="Our Valued Customers"
              subtitle={totalElements > 0 ? `${totalElements} customers in our community` : 'Building our community'}
            />
            <Navigation />
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 mt-8">
                <CustomerListHeader
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClearSearch={clearSearch}
                    onRefresh={handleRefresh}
                    isRefreshing={refreshing}
                    displayRange={displayRange}
                />
                {loading && <div className="text-center p-12">Loading...</div>}
                {error && <div className="text-center text-red-500 p-6">{error}</div>}
                {!loading && !error && (
                    <>
                        <CustomerTable
                            customers={customers}
                            sortConfig={sortConfig}
                            onSort={requestSort}
                            onDeleteClick={handleDeleteClick}
                            debouncedSearchTerm={debouncedSearchTerm}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerListPage;

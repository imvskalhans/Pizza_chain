/**
 * @file A hook to manage state for a paginated, searchable, and sortable customer table.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllCustomers } from '../../../api/customerService';
import { useDebounce } from '../../../hooks/useDebounce';

const PAGE_SIZE = 10;

export const useCustomerTable = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const sortString = useMemo(() => `${sortConfig.key},${sortConfig.direction}`, [sortConfig]);

    const fetchCustomers = useCallback(async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) setRefreshing(true); else setLoading(true);
            setError(null);
            const data = await getAllCustomers(currentPage, PAGE_SIZE, sortString, debouncedSearchTerm.trim());
            setCustomers(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message || 'Failed to load customers');
            setCustomers([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentPage, sortString, debouncedSearchTerm]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Reset to page 0 when search or sort changes
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, sortConfig]);

    const requestSort = useCallback((key) => {
        setSortConfig(prev => ({ key, direction: (prev.key === key && prev.direction === 'asc') ? 'desc' : 'asc' }));
    }, []);

    const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
    const clearSearch = useCallback(() => setSearchTerm(''), []);
    const handleRefresh = useCallback(() => fetchCustomers(true), [fetchCustomers]);
    const handlePageChange = useCallback((page) => setCurrentPage(page), []);

    const displayRange = useMemo(() => {
        if (totalElements === 0) return "0 results";
        const start = currentPage * PAGE_SIZE + 1;
        const end = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);
        return `Showing ${start} - ${end} of ${totalElements}`;
    }, [currentPage, totalElements]);

    return {
        customers, loading, refreshing, error, currentPage, totalPages, totalElements,
        searchTerm, debouncedSearchTerm, sortConfig, displayRange,
        fetchCustomers, requestSort, handleSearchChange, clearSearch, handleRefresh, handlePageChange,
        setCurrentPage
    };
};

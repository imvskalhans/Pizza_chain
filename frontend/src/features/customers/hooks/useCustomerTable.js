/**
 * @file A hook to manage state for a paginated, searchable, and sortable customer table with filtering.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllCustomers } from '../../../api/customerService';
import { useDebounce } from '../../../hooks/useDebounce';

const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const useCustomerTable = (viewMode = 'table') => {
    const [allCustomers, setAllCustomers] = useState([]); // Holds all fetched customers
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
    const [filters, setFilters] = useState({ country: '', gender: '', ageRange: '' });

    const PAGE_SIZE = viewMode === 'grid' ? 12 : 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchCustomers = useCallback(async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) setRefreshing(true); else setLoading(true);
            setError(null);
            const data = await getAllCustomers(0, 1000); // Fetching all for client-side filtering
            setAllCustomers(data.content || []);
        } catch (err) {
            setError(err.message || 'Failed to load customers');
            setAllCustomers([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = [...allCustomers];

        if (debouncedSearchTerm) {
            filtered = filtered.filter(c =>
                c.firstName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                c.lastName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        if (filters.country) filtered = filtered.filter(c => c.country === filters.country);
        if (filters.gender) filtered = filtered.filter(c => c.gender.toLowerCase() === filters.gender);
        if (filters.ageRange) {
            const [min, max] = filters.ageRange.split('-').map(val => val === '+' ? Infinity : Number(val));
            filtered = filtered.filter(c => {
                const age = calculateAge(c.dob);
                if (age === null) return false;
                if (max) return age >= min && age <= max;
                return age >= min;
            });
        }

        filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [allCustomers, debouncedSearchTerm, sortConfig, filters]);

    const paginatedCustomers = useMemo(() => {
        const start = currentPage * PAGE_SIZE;
        return filteredAndSortedCustomers.slice(start, start + PAGE_SIZE);
    }, [filteredAndSortedCustomers, currentPage, PAGE_SIZE]);

    const totalPages = Math.ceil(filteredAndSortedCustomers.length / PAGE_SIZE);
    const totalElements = filteredAndSortedCustomers.length;

    useEffect(() => {
        if (currentPage > 0 && currentPage >= totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages - 1 : 0);
        }
    }, [totalPages, currentPage]);

    const requestSort = useCallback((key) => {
        setSortConfig(prev => ({ key, direction: (prev.key === key && prev.direction === 'asc') ? 'desc' : 'asc' }));
    }, []);

    // THIS IS THE FIX: The function now correctly accepts the search term value directly.
    const handleSearchChange = useCallback((value) => setSearchTerm(value), []);

    const clearSearch = useCallback(() => setSearchTerm(''), []);
    const handleRefresh = useCallback(() => fetchCustomers(true), [fetchCustomers]);
    const handlePageChange = useCallback((page) => setCurrentPage(page), []);

    const displayRange = useMemo(() => {
        if (totalElements === 0) return "0 results";
        const start = currentPage * PAGE_SIZE + 1;
        const end = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);
        return `Showing ${start} - ${end} of ${totalElements}`;
    }, [currentPage, totalElements, PAGE_SIZE]);

    return {
        customers: paginatedCustomers,
        loading, refreshing, error, currentPage, totalPages, totalElements,
        searchTerm, debouncedSearchTerm, sortConfig, displayRange, filters,
        fetchCustomers, requestSort, handleSearchChange, clearSearch, handleRefresh, handlePageChange,
        setCurrentPage,
        setFilters
    };
};

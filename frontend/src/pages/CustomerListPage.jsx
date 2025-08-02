import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getAllCustomers, deleteCustomer, API_BASE_URL_STATIC } from '../api/customerService';
import { User, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Navigation = () => (
    <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex items-center justify-center gap-2 mb-8 max-w-sm mx-auto">
        <NavLink to="/" className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200/70 rounded-lg">Register</NavLink>
        <NavLink to="/customers" className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm">Customer List</NavLink>
    </nav>
);

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for backend-driven features
    const [currentPage, setCurrentPage] = useState(0); // Spring Pageable is 0-indexed
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    // Wrapped fetchCustomers in useCallback
    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const sortString = `${sortConfig.key},${sortConfig.direction}`;
            const data = await getAllCustomers(currentPage, 10, sortString, searchTerm);

            setCustomers(data.content); // The list of customers for the current page
            setTotalPages(data.totalPages); // The total number of pages from the backend
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortConfig, searchTerm]); // Dependencies for the useCallback

    // This useEffect now re-fetches data from the backend whenever a parameter changes
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]); // Added fetchCustomers to the dependency array

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(customerToDelete.id);
                fetchCustomers(); // Refresh the list from the backend
            } catch (err) {
                alert('Failed to delete customer.');
                console.error(err);
            } finally {
                setIsModalOpen(false);
                setCustomerToDelete(null);
            }
        }
    };

    const requestSort = (key) => {
        const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
        setSortConfig({ key, direction });
        setCurrentPage(0); // Reset to the first page when sorting changes
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // Reset to the first page when search term changes
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    return (
        <div className="max-w-6xl mx-auto">
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete ${customerToDelete?.firstName} ${customerToDelete?.lastName}? This action cannot be undone.`}
            />
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg"><User className="w-8 h-8 text-white" /></div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Valued Customers</h1>
                <p className="text-lg text-gray-600">A list of everyone in our community</p>
            </div>
            <Navigation />
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
                <div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"/></div></div>
                {loading && <p className="text-center text-gray-600">Loading customers...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><button onClick={() => requestSort('firstName')} className="flex items-center">Name {getSortIndicator('firstName')}</button></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><button onClick={() => requestSort('email')} className="flex items-center">Contact {getSortIndicator('email')}</button></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full object-cover" src={customer.photoPath ? `${API_BASE_URL_STATIC}${customer.photoPath}` : `https://placehold.co/40x40/f97316/white?text=${customer.firstName.charAt(0)}`} alt={`${customer.firstName}'s profile`} /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div><div className="text-sm text-gray-500 capitalize">{customer.gender}</div></div></div></td>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{customer.email}</div><div className="text-sm text-gray-500">{customer.phone}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.city}, {customer.state}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link to={`/edit/${customer.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3 inline-block"><Edit className="w-4 h-4"/></Link>
                                                    <button onClick={() => handleDeleteClick(customer)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4"/></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No customers found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="py-4 flex items-center justify-between">
                            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Previous</button>
                            <span className="text-sm text-gray-700">Page {currentPage + 1} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerListPage;

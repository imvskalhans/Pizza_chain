/**
 * @file Component to display a table of customers with sorting and action controls.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { API_BASE_URL_STATIC } from '../../../api/customerService';

const SortableHeader = ({ label, sortKey, sortConfig, onSort }) => {
    const getSortIndicator = () => {
        if (sortConfig.key !== sortKey) {
            return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ?
            <ArrowUp className="w-4 h-4 ml-2 text-orange-500" /> :
            <ArrowDown className="w-4 h-4 ml-2 text-orange-500" />;
    };

    return (
        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <button
                onClick={() => onSort(sortKey)}
                className="flex items-center hover:text-gray-700 transition-colors"
            >
                {label} {getSortIndicator()}
            </button>
        </th>
    );
};

export const CustomerTable = ({ customers, onSort, sortConfig, onDeleteClick, debouncedSearchTerm }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <SortableHeader label="Name" sortKey="firstName" sortConfig={sortConfig} onSort={onSort} />
                    <SortableHeader label="Contact" sortKey="email" sortConfig={sortConfig} onSort={onSort} />
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                            src={customer.photoPath ? `${API_BASE_URL_STATIC}${customer.photoPath}` : `https://placehold.co/48x48/f97316/white?text=${customer.firstName.charAt(0)}`}
                                            alt={`${customer.firstName}'s profile`}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-semibold text-gray-900">{customer.firstName} {customer.lastName}</div>
                                        <div className="text-sm text-gray-500 capitalize">{customer.gender} • {customer.dob && new Date().getFullYear() - new Date(customer.dob).getFullYear()} years</div>
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
                                    <Link to={`/edit/${customer.id}`} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit customer">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => onDeleteClick(customer)} className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete customer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
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
);

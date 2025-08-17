/**
 * @file Component to display a table of customers with sorting and action controls.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, MessageSquare, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { API_BASE_URL_STATIC } from '../../../api/customerService';

const SortableHeader = ({ label, sortKey, sortConfig, onSort }) => {
    const getSortIndicator = () => {
        if (sortConfig.key !== sortKey) return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 ml-2 text-orange-500" /> : <ArrowDown className="w-4 h-4 ml-2 text-orange-500" />;
    };
    return (
        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <button onClick={() => onSort(sortKey)} className="flex items-center hover:text-gray-700 transition-colors">
                {label} {getSortIndicator()}
            </button>
        </th>
    );
};

export const CustomerTable = ({ customers, onSort, sortConfig, onDeleteClick, onFeedbackClick }) => (
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
                {customers.map((customer) => (
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
                                <button onClick={() => onFeedbackClick(customer)} className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors" title="View Feedback">
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                                <Link to={`/edit/${customer.id}`} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors" title="Edit customer">
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button onClick={() => onDeleteClick(customer)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors" title="Delete customer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

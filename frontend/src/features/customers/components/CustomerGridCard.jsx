/**
 * @file A card component for displaying a customer in a grid view.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Mail, Phone, MessageSquare } from 'lucide-react';
import { API_BASE_URL_STATIC } from '../../../api/customerService';

export const CustomerGridCard = ({ customer, onDeleteClick, onFeedbackClick }) => {
    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100/80 overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <img
                        className="h-16 w-16 rounded-full object-cover border-2 border-orange-200"
                        src={customer.photoPath ? `${API_BASE_URL_STATIC}${customer.photoPath}` : `https://placehold.co/64x64/fed7aa/f97316?text=${customer.firstName.charAt(0)}`}
                        alt={`${customer.firstName}'s profile`}
                        loading="lazy"
                    />
                    <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900 truncate">{customer.firstName} {customer.lastName}</p>
                        <p className="text-sm text-gray-500 capitalize">{customer.gender}, {calculateAge(customer.dob)} years</p>
                        <p className="text-sm text-gray-600 mt-1">{customer.city}, {customer.country}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{customer.phone}</span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50/80 px-5 py-3 flex items-center justify-end gap-2 border-t border-gray-200/80">
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
        </div>
    );
};

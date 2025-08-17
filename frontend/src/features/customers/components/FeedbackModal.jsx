/**
 * @file A modal for viewing and adding customer feedback with real API calls.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Send, AlertCircle, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import {
    getFeedbackForCustomer,
    addFeedbackForCustomer,
    updateFeedback,
    patchFeedback,
    deleteFeedback
} from '../../../api/feedbackService';

const FeedbackModal = ({ customer, isOpen, onClose }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [newFeedback, setNewFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadFeedback = useCallback(async () => {
        if (!customer) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getFeedbackForCustomer(customer.id);
            setFeedbackList(data);
        } catch (err) {
            setError(err.message);
            setFeedbackList([]);
        } finally {
            setIsLoading(false);
        }
    }, [customer]);

    useEffect(() => {
        if (isOpen) {
            loadFeedback();
        }
    }, [isOpen, loadFeedback]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedFeedback = newFeedback.trim();
        if (!trimmedFeedback) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const addedFeedback = await addFeedbackForCustomer(customer.id, trimmedFeedback);
            setFeedbackList(prev => [addedFeedback, ...prev]);
            setNewFeedback("");
            setSuccessMessage("Feedback added successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (feedback) => {
        setEditingId(feedback.id);
        setEditingText(feedback.text);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    const handleSaveEdit = async (feedbackId, usePartialUpdate = false) => {
        const trimmedText = editingText.trim();
        if (!trimmedText) return;

        try {
            const updatedFeedback = usePartialUpdate
                ? await patchFeedback(feedbackId, trimmedText)
                : await updateFeedback(feedbackId, trimmedText);
            
            setFeedbackList(prev => prev.map(item => item.id === feedbackId ? updatedFeedback : item));
            setEditingId(null);
            setEditingText("");
            setSuccessMessage(`Feedback updated successfully!`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (feedbackId) => {
        setDeletingId(feedbackId);
        try {
            await deleteFeedback(feedbackId);
            setFeedbackList(prev => prev.filter(item => item.id !== feedbackId));
            setSuccessMessage("Feedback deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Feedback for {customer?.firstName} {customer?.lastName}</h3>
                    <p className="text-sm text-gray-500">{customer?.email}</p>
                </div>

                {successMessage && (
                    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-800 text-sm">{successMessage}</span>
                    </div>
                )}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-800 text-sm">{error}</span>
                    </div>
                )}

                <div className="p-6 h-80 overflow-y-auto space-y-4">
                    {isLoading ? (
                        <div className="text-center text-gray-500 py-10">Loading...</div>
                    ) : feedbackList.length > 0 ? (
                        feedbackList.map(item => (
                            <div key={item.id} className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                                {editingId === item.id ? (
                                    <div className="p-3 space-y-3">
                                        <textarea
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            rows="3"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm">Save</button>
                                            <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-200 rounded-md text-sm">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-gray-800 flex-1">{item.text}</p>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button onClick={() => handleEdit(item)} className="p-1 text-gray-500 hover:text-orange-600" title="Edit">
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="p-1 text-gray-500 hover:text-red-600" title="Delete">
                                                    {deletingId === item.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" /> : <Trash2 className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 text-right">
                                            {new Date(item.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">No feedback recorded.</div>
                    )}
                </div>

                <div className="p-6 bg-gray-50/80 border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newFeedback}
                            onChange={(e) => setNewFeedback(e.target.value)}
                            placeholder="Add a new note..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            disabled={isSubmitting}
                        />
                        <button type="submit" className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50" disabled={isSubmitting || !newFeedback.trim()}>
                            {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Send className="h-5 w-5" />}
                        </button>
                    </form>
                </div>
                 <div className="p-4 bg-gray-100 text-right rounded-b-xl">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;

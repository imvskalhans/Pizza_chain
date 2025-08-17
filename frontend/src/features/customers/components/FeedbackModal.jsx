/**
 * @file A modal for viewing and adding customer feedback.
 */
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';

// Mock API function - in a real app, this would be in your customerService.js
const getFeedbackForCustomer = async (customerId) => {
    console.log(`Fetching feedback for ${customerId}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockFeedback = {
        "d9b5347a-2540-4f20-968b-1b5e948ab3f1": [
            { id: 1, text: "Called to confirm delivery address. Very polite.", date: "2025-08-16" },
            { id: 2, text: "Requested extra cheese on their last order.", date: "2025-08-17" },
        ],
    };
    return mockFeedback[customerId] || [];
};

const addFeedbackForCustomer = async (customerId, text) => {
    console.log(`Adding feedback for ${customerId}: "${text}"`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: Date.now(), text, date: new Date().toISOString().split('T')[0] };
};


const FeedbackModal = ({ customer, isOpen, onClose }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [newFeedback, setNewFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && customer) {
            setIsLoading(true);
            getFeedbackForCustomer(customer.id)
                .then(data => setFeedbackList(data))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, customer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newFeedback.trim()) return;

        setIsSubmitting(true);
        try {
            const addedFeedback = await addFeedbackForCustomer(customer.id, newFeedback);
            setFeedbackList(prev => [...prev, addedFeedback]);
            setNewFeedback("");
        } catch (error) {
            console.error("Failed to add feedback", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Feedback for {customer.firstName} {customer.lastName}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                </div>

                <div className="p-6 h-80 overflow-y-auto space-y-4">
                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading feedback...</div>
                    ) : feedbackList.length > 0 ? (
                        feedbackList.map(item => (
                            <div key={item.id} className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg">
                                <p className="text-gray-800">{item.text}</p>
                                <p className="text-xs text-gray-500 mt-1 text-right">{item.date}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">No feedback recorded for this customer.</div>
                    )}
                </div>

                <div className="p-6 bg-gray-50/80 border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={newFeedback}
                            onChange={(e) => setNewFeedback(e.target.value)}
                            placeholder="Add a new note..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={isSubmitting}
                        />
                        <button type="submit" className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50" disabled={isSubmitting}>
                            <Send className="h-5 w-5" />
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

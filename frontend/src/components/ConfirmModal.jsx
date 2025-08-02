import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

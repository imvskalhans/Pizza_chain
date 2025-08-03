/**
 * @file A reusable and accessible confirmation modal component.
 * It's designed to be flexible for various confirmation scenarios (e.g., deleting, submitting, etc.).
 */

import React, { useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * A generic confirmation modal.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed (e.g., by clicking cancel or pressing Esc).
 * @param {function} props.onConfirm - Function to call when the confirmation button is clicked.
 * @param {string} props.message - The main message or question to display in the modal body.
 * @param {string} [props.title='Confirm Action'] - The title of the modal.
 * @param {string} [props.confirmText='Confirm'] - The text for the confirmation button.
 * @param {string} [props.cancelText='Cancel'] - The text for the cancel button.
 * @param {string} [props.confirmButtonClass='bg-red-600 hover:bg-red-700 text-white'] - Tailwind classes for the confirm button to allow for different styling (e.g., red for delete, blue for submit).
 * @param {React.ReactNode} [props.icon] - An optional icon component to display. Defaults to an alert triangle.
 * @returns {React.ReactNode} The modal component or null if not open.
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = 'Confirm Action',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700 text-white',
  icon = <AlertTriangle className="w-8 h-8 text-red-600" />
}) => {
  // Effect to handle the 'Escape' key press for closing the modal
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Don't render the modal if it's not open
  if (!isOpen) {
    return null;
  }

  // Stop propagation to prevent clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // The modal overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose} // Close modal if overlay is clicked
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* The modal panel */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4"
        onClick={handleModalContentClick}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Container */}
          <div className="bg-red-100 p-3 rounded-full mb-4">
            {icon}
          </div>

          {/* Title */}
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Message */}
          <p id="modal-description" className="text-sm text-gray-600 mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              aria-label="Cancel action"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
              aria-label="Confirm action"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

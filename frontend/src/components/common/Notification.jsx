/**
 * @file A toast notification component that displays success or error messages.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ message, type, onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    // Allow time for the exit animation before calling the parent's onClose
    setTimeout(() => {
      onClose();
    }, 300); // This duration should match the transition duration
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const isSuccess = type === 'success';

  // Base styles for the notification container
  const baseClasses = "fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-xl text-white transition-all duration-300 transform";

  // Styles based on the notification type (success or error)
  const typeClasses = isSuccess
    ? "bg-gradient-to-r from-green-500 to-green-600"
    : "bg-gradient-to-r from-red-500 to-red-600";

  // Animation classes for enter and exit transitions
  const animationClasses = isExiting
    ? 'opacity-0 translate-x-full'
    : 'opacity-100 translate-x-0 animate-fade-in-down';

  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className={`${baseClasses} ${typeClasses} ${animationClasses}`} role="alert" aria-live="assertive">
      <div className="mr-3">
        <Icon className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
      <div className="flex-1 mr-4">
        <p className="font-bold">{isSuccess ? 'Success' : 'Error'}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close notification">
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default Notification;

import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';

  // Define styles based on the notification type
  const baseClasses = "fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-xl text-white";
  const typeClasses = isSuccess
    ? "bg-gradient-to-r from-green-500 to-green-600"
    : "bg-gradient-to-r from-red-500 to-red-600";

  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className={`${baseClasses} ${typeClasses} animate-fade-in-down`}>
      <div className="mr-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 mr-4">
        <p className="font-bold">{isSuccess ? 'Success' : 'Error'}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default Notification;
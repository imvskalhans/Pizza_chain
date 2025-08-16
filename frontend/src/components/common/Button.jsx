/**
 * @file A reusable button component with a loading state.
 */
import React from 'react';

export const Button = ({ children, onClick, type = "button", isSubmitting = false, icon, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isSubmitting}
      className={`w-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-all duration-200 hover:shadow-xl ${className}`}
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

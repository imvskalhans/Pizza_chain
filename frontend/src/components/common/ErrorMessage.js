/**
 * @file A small, reusable component for displaying a validation error message.
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

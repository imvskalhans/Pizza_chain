/**
 * @file A simple component to display a validation error message.
 */
import React from 'react';

export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
};

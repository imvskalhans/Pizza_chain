/**
 * @file An input component that displays validation errors.
 */
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';

export const ValidatedInput = ({
  label, name, type = 'text', value, onChange, onBlur, error,
  required = false, icon: Icon, className = "", placeholder = "",
  readOnly = false, showPasswordToggle = false
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasError = !!error;
  const inputType = showPasswordToggle && isPasswordVisible ? 'text' : type;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => onBlur(name)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full p-2 border rounded-md shadow-sm ${Icon ? 'pl-10' : ''} ${hasError ? 'border-red-500' : 'border-gray-300'} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

/**
 * @file A generic, validated input field component with support for icons,
 * password visibility toggling, and disabled/read-only states.
 */
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';

export const ValidatedInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  icon: Icon,
  className = "",
  placeholder = "",
  showPasswordToggle = false,
  disabled = false,
  readOnly = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  const isLocked = disabled || readOnly;

  // Determine the actual input type (for password toggle)
  const actualType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(name);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && !isLocked && <span className="text-red-500">*</span>}
        {isLocked && <span className="text-xs text-gray-500 ml-1">(Read-only)</span>}
      </label>
      <div className="relative">
        {/* Use a lock icon if the field is read-only, otherwise use the provided icon */}
        {isLocked ? (
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        ) : (
            Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}

        <input
          type={actualType}
          id={name}
          name={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full p-2 border rounded-md shadow-sm transition-colors focus:ring-2 ${Icon || isLocked ? 'pl-10' : ''} ${showPasswordToggle ? 'pr-10' : ''} ${
            isLocked
              ? 'bg-gray-100 cursor-not-allowed text-gray-600'
              : hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
          }`}
          {...props}
        />
        {showPasswordToggle && !isLocked && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

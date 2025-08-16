/**
 * @file A specialized input component for phone numbers with a country code selector.
 */
import React from 'react';
import { Phone } from 'lucide-react';
import { countryCodesData } from '../../../data/countryCodes';
import { ErrorMessage } from '../../../components/common/ErrorMessage';

export const PhoneInput = ({
  label, name, value, countryCode, onChange, onBlur,
  onCountryCodeChange, error, required = false, className = "", placeholder = "",
}) => {
  const hasError = !!error;

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    const trimmedValue = numericValue.slice(0, 10);
    onChange({ ...e, target: { ...e.target, name, value: trimmedValue } });
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          name="countryCode"
          value={countryCode}
          onChange={onCountryCodeChange}
          className={`p-2 border rounded-md shadow-sm bg-white min-w-[90px] ${hasError ? 'border-red-500' : 'border-gray-300'}`}
        >
          {countryCodesData.map((country) => (
            <option key={country.code} value={country.code}>{country.flag} {country.code}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            id={name}
            name={name}
            value={value}
            onChange={handlePhoneChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`w-full pl-10 p-2 border rounded-md shadow-sm ${hasError ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

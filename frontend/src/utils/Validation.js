/**
 * @file Form validation utilities
 */

export const validateField = (name, value, allData, isEditMode = false) => {
  // Normalize the value
  const normalizedValue = value === null || value === undefined ? '' : String(value).trim();

  // Special validation for address fields in edit mode
  if (isEditMode && ['country', 'state', 'city'].includes(name)) {
    const isAddressPartiallyFilled = allData.country || allData.state || allData.city;
    if (isAddressPartiallyFilled && !normalizedValue) {
      return 'This field is required when address information is provided';
    }
  }

  switch (name) {
    case 'firstName':
      if (!normalizedValue) return 'First name is required';
      if (normalizedValue.length < 2) return 'First name must be at least 2 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(normalizedValue)) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
      return '';

    case 'lastName':
      if (!normalizedValue) return 'Last name is required';
      if (normalizedValue.length < 2) return 'Last name must be at least 2 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(normalizedValue)) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
      return '';

    case 'email':
      if (!normalizedValue) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) return 'Please enter a valid email address';
      if (normalizedValue.length > 254) return 'Email address is too long';
      return '';

    case 'password':
      // In edit mode, password is optional (empty means keep current password)
      if (isEditMode && !normalizedValue) return '';

      // In registration mode, password is required
      if (!normalizedValue && !isEditMode) return 'Password is required';

      // If password is provided, validate it
      if (normalizedValue) {
        if (normalizedValue.length < 8) return 'Password must be at least 8 characters';
        if (normalizedValue.length > 128) return 'Password is too long';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/.test(normalizedValue)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
        }
      }
      return '';

   case 'phone':
     // First, check if the value is empty.
     if (!normalizedValue) {
       return 'Phone number is required.';
     }

     // This single regex validates the original input. It checks for two things:
     // 1. Does the string contain ONLY digits?
     // 2. Is the string EXACTLY 10 digits long?
     // The ^ and $ anchors ensure no other characters (like spaces or dashes) exist.
     if (!/^\d{10}$/.test(normalizedValue)) {
       return 'Phone number must be exactly 10 digits.';
     }

     // If the input passes the check, return an empty string (no error).
     return '';

    case 'dob':
      if (!normalizedValue) return 'Date of birth is required';
      //dob must be in past
        const dobDate = new Date(normalizedValue);
        if (isNaN(dobDate.getTime())) return 'Please enter a valid date';
        if (dobDate >= new Date()) return 'Date of birth must be in the past';
      return '';

    case 'gender':
      if (!normalizedValue) return 'Gender is required';
      if (!['male', 'female', 'other'].includes(normalizedValue.toLowerCase())) {
        return 'Please select a valid gender option';
      }
      return '';

    case 'country':
      if (!normalizedValue) return 'Country is required';
      return '';

    case 'state':
      if (!normalizedValue) return 'State/Province is required';
      return '';

    case 'city':
      if (!normalizedValue) return 'City is required';
      return '';

    case 'postalCode':
      if (!normalizedValue) return 'Postal code is required';
      if (normalizedValue.length < 3 || normalizedValue.length > 10) {
        return 'Postal code must be between 3 and 10 characters';
      }
      // Basic postal code validation (alphanumeric, spaces, hyphens)
      if (!/^[a-zA-Z0-9\s-]+$/.test(normalizedValue)) {
        return 'Postal code can only contain letters, numbers, spaces, and hyphens';
      }
      return '';

    case 'terms':
      if (!isEditMode && !value) return 'You must accept the terms and conditions';
      return '';

    case 'countryCode':
      if (!normalizedValue) return 'Country code is required';
      if (!/^\+\d{1,4}$/.test(normalizedValue)) return 'Please select a valid country code';
      return '';

    default:
      return '';
  }
};
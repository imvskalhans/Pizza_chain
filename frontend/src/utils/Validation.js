/**
 * @file Centralized validation logic for the customer form.
 */
export const validateField = (name, value, formData, isEditMode = false) => {
  switch (name) {
    case 'firstName':
    case 'lastName':
      return value.trim().length < 2 ? `${name.replace(/([A-Z])/g, ' $1')} must be at least 2 characters long.` : '';
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : '';
    case 'password':
      if (isEditMode && !value) return ''; // Password is not required on edit
      return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        ? 'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
        : '';
    case 'phone':
      return !/^\d{10}$/.test(value) ? 'Phone number must be exactly 10 digits.' : '';
    case 'dob':
      if (!value) return 'Date of birth is required.';
      return new Date(value) > new Date() ? 'Date of birth cannot be in the future.' : '';
    case 'gender':
    case 'country':
    case 'state':
    case 'city':
      return !value ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.` : '';
    case 'postalCode':
      return !/^\d{5,6}$/.test(value) ? 'Please enter a valid postal code.' : '';
    case 'terms':
      return !value && !isEditMode ? 'You must agree to the terms and conditions.' : '';
    default:
      return '';
  }
};

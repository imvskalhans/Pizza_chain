/**
 * @file A custom React hook to manage the state and logic of a customer form.
 */
import { useState, useEffect, useCallback } from 'react';
import { locationData } from '../data/locationData.js';
import { validateField } from '../utils/Validation';

export const useCustomerForm = (initialState, isEditMode = false) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (formData?.country) setStates(Object.keys(locationData[formData.country] || {}));
    else setStates([]);
  }, [formData?.country]);

  useEffect(() => {
    if (formData?.country && formData?.state) setCities(locationData[formData.country]?.[formData.state] || []);
    else setCities([]);
  }, [formData?.state, formData?.country]);

  useEffect(() => {
    if (!formData) return;
    const allFields = ["firstName", "lastName", "email", "password", "phone", "dob", "gender", "country", "state", "city", "postalCode", "terms"];
    const requiredFields = isEditMode ? allFields.filter(f => f !== 'password') : allFields;
    const completedFields = requiredFields.filter(field => !!formData[field]).length;
    const progressPercentage = requiredFields.length > 0 ? (completedFields / requiredFields.length) * 100 : 0;
    setProgress(progressPercentage);
  }, [formData, isEditMode]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    // Determine the new value from the event
    const newValue = type === 'checkbox' ? checked : (type === 'file' ? files[0] : value);

    // Create a mutable copy of the form data to apply changes
    let updatedFormData = { ...formData, [name]: newValue };

    // If the country was changed, reset state and city to ensure data integrity.
    if (name === 'country') {
      updatedFormData.state = '';
      updatedFormData.city = '';
    }

    // If the state was changed, reset the city.
    if (name === 'state') {
      updatedFormData.city = '';
    }

    // Set the state with the fully updated object
    setFormData(updatedFormData);

    // Run validation if the field has been touched before
    if (touched[name]) {
      const error = validateField(name, newValue, updatedFormData, isEditMode);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Handle photo preview for file inputs
    if (type === 'file' && files[0]) {
      setPhotoPreview(URL.createObjectURL(files[0]));
    }
  }, [isEditMode, touched, formData]);

  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName], formData, isEditMode);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [formData, isEditMode]);

  const validateForm = useCallback(() => {
    if (!formData) return false;

    // **THE FIX:** Define a complete list of fields to validate.
    // This ensures all required fields are checked, regardless of the initial state.
    const fieldsToValidate = [
      'firstName', 'lastName', 'email', 'phone', 'dob',
      'country', 'state', 'city', 'postalCode'
    ];

    // In edit mode, we only validate the password if the user has entered a new one.
    if (!isEditMode || (isEditMode && formData.password)) {
      fieldsToValidate.push('password');
    }

    const newErrors = {};
    // Validate each field in our defined list.
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key], formData, isEditMode);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    // Mark all validated fields as "touched" to show any errors.
    setTouched(fieldsToValidate.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    // The form is valid only if the newErrors object is empty.
    return Object.keys(newErrors).length === 0;

  }, [formData, isEditMode]); // No longer depends on 'initialState'
    const setFieldErrors = useCallback((backendErrors) => {
      setErrors(prev => ({ ...prev, ...backendErrors }));
      setTouched(prev => ({
        ...prev,
        ...Object.keys(backendErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      }));
    }, []);

  return {
    formData, setFormData, errors, touched, photoPreview, setPhotoPreview,
    states, cities, progress, handleChange, handleBlur, validateForm, setFieldErrors,
  };
};
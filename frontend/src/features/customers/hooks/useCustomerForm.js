/**
 * @file A custom React hook to manage the state and logic of a customer form.
 */
import { useState, useEffect, useCallback } from 'react';
import { locationData } from '../../../data/locationData';
import { validateField } from '../../../utils/Validation';

export const useCustomerForm = (initialState, isEditMode = false) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (initialState?.photoPreviewUrl) {
      setPhotoPreview(initialState.photoPreviewUrl);
    }
  }, [initialState]);

  useEffect(() => {
    if (formData?.country) {
      const countryStates = Object.keys(locationData[formData.country] || {});
      setStates(countryStates);
      if (!countryStates.includes(formData.state)) {
        setFormData(prev => ({...prev, state: '', city: ''}));
      }
    } else {
      setStates([]);
    }
  }, [formData?.country, formData?.state]);

  useEffect(() => {
    if (formData?.country && formData?.state) {
      const stateCities = locationData[formData.country]?.[formData.state] || [];
      setCities(stateCities);
      if (!stateCities.includes(formData.city)) {
        setFormData(prev => ({...prev, city: ''}));
      }
    } else {
      setCities([]);
    }
  }, [formData?.state, formData?.country, formData?.city]);

  useEffect(() => {
    if (!formData) return;
    const allFields = ["firstName", "lastName", "email", "password", "phone", "dob", "gender", "country", "state", "city", "postalCode", "terms", "address"];
    const requiredFields = isEditMode ? allFields.filter(f => f !== 'password' && f !== 'terms') : allFields;
    const completedFields = requiredFields.filter(field => !!formData[field]).length;
    const progressPercentage = requiredFields.length > 0 ? (completedFields / requiredFields.length) * 100 : 0;
    setProgress(progressPercentage);
  }, [formData, isEditMode]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'interests') {
        setFormData(prev => {
            const interests = prev.interests || [];
            const newInterests = checked
                ? [...interests, value]
                : interests.filter(interest => interest !== value);
            return { ...prev, interests: newInterests };
        });
    } else {
        const newValue = type === 'checkbox' ? checked : (type === 'file' ? files[0] : value);
        setFormData(prev => {
          const updated = { ...prev, [name]: newValue };
          if (touched[name]) {
            const error = validateField(name, newValue, updated, isEditMode);
            setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
          }
          return updated;
        });

        if (type === 'file' && files[0]) {
          setPhotoPreview(URL.createObjectURL(files[0]));
        }
    }
  }, [isEditMode, touched]);

  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName], formData, isEditMode);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [formData, isEditMode]);

  const validateForm = useCallback(() => {
    if (!formData) return false;
    const newErrors = {};
    const allFields = Object.keys(initialState).filter(k => k !== 'photoPreviewUrl');
    allFields.forEach(key => {
      const error = validateField(key, formData[key], formData, isEditMode);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched(allFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditMode, initialState]);

  const setFieldErrors = useCallback((backendErrors) => {
    setErrors(prev => ({ ...prev, ...backendErrors }));
    setTouched(prev => ({ ...prev, ...Object.keys(backendErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}) }));
  }, []);

  return {
    formData, setFormData, errors, touched, photoPreview,
    states, cities, progress, handleChange, handleBlur, validateForm, setFieldErrors,
  };
};

// src/hooks/useCustomerForm.js
import { useState, useEffect } from 'react';
import { locationData } from '../data/locationData';

export const useCustomerForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [photoPreview, setPhotoPreview] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [progress, setProgress] = useState(0);

  // Effect for cascading location dropdowns
  useEffect(() => {
    if (formData.country) {
      setStates(Object.keys(locationData[formData.country] || {}));
      setCities([]);
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  // This hook depends on both state and country to determine the list of cities.
  useEffect(() => {
    if (formData.state) {
      setCities(locationData[formData.country]?.[formData.state] || []);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setCities([]);
    }
  }, [formData.state, formData.country]);

  // Effect for calculating form completion progress
  useEffect(() => {
    const requiredFields = [
      "firstName", "lastName", "email", "password", "dob", "gender",
      "address", "country", "state", "city", "postalCode", "terms"
    ];
    const completedFields = requiredFields.filter(field => !!formData[field]).length;
    setProgress((completedFields / requiredFields.length) * 100);
  }, [formData]);

  // Handler for all form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, [name]: file }));
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return { formData, states, cities, photoPreview, progress, handleChange };
};

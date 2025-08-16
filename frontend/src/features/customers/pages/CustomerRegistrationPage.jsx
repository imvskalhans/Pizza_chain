/**
 * @file This page handles the customer registration process.
 * FIXED VERSION - Sends only 10-digit phone number to match backend validation
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { registerCustomer } from '../../../api/customerService';
import { PageHeader } from '../../../components/common/PageHeader';
import { useNotification } from '../../../hooks/useNotification';
import CustomerForm from '../components/CustomerForm';
import { Navigation } from '../../../components/common/Navigation';

const initialFormState = {
  firstName: "", lastName: "", email: "", password: "", phone: "",
  countryCode: "+91", dob: "", gender: "", country: "", state: "",
  city: "", address: "", postalCode: "", photo: null, terms: false,
  interests: [], newsletter: false,
};

const CustomerRegistrationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleRegistration = async (formData, { setFieldErrors }) => {
    console.log('Starting registration with form data:', formData);
    setIsSubmitting(true);

    try {
      // FIXED: Send phone without country code to match backend validation
      const customerPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone, // ONLY the 10 digits - backend expects this format
        dob: formData.dob,
        gender: formData.gender,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        terms: formData.terms,
        interests: formData.interests || [],
        newsletter: formData.newsletter || false,
        photo: formData.photo, // The service will handle separating this file
      };

      console.log('Sending payload to backend:', customerPayload);
      await registerCustomer(customerPayload);

      showNotification("Registration successful! Redirecting...", 'success');
      setTimeout(() => navigate('/customers'), 2000);
    } catch (error) {
      console.error('Registration failed:', error);

      const errorData = error.response?.data;
      console.log('Error response data:', errorData);

      // Handle Spring Boot validation errors
      if (errorData && Array.isArray(errorData)) {
        const fieldErrors = {};
        errorData.forEach(err => {
          if (err.field) {
            fieldErrors[err.field] = err.defaultMessage || err.message;
          }
        });
        setFieldErrors(fieldErrors);
      } else if (errorData?.errors) {
        setFieldErrors(errorData.errors);
      }

      const errorMessage = errorData?.message ||
                          (Array.isArray(errorData) && errorData.length > 0 ? errorData[0].defaultMessage : null) ||
                          'Registration failed. Please check your information and try again.';

      showNotification(errorMessage, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PageHeader
        icon={<Users />}
        title="Customer Registration"
        subtitle="Create your account and join our community"
      />
      <Navigation />
      <div className="mt-8">
        <CustomerForm
          initialState={initialFormState}
          onSubmit={handleRegistration}
          isSubmitting={isSubmitting}
          submitButtonText="Create My Account"
        />
      </div>
    </div>
  );
};

export default CustomerRegistrationPage;
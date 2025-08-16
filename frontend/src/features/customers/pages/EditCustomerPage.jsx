/**
 * @file This page allows users to edit an existing customer's details.
 * FIXED VERSION - Handles phone number format correctly and password validation
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer, API_BASE_URL_STATIC } from '../../../api/customerService';
import { Users } from 'lucide-react';
import { PageHeader } from '../../../components/common/PageHeader';
import { useNotification } from '../../../hooks/useNotification';
import CustomerForm from '../components/CustomerForm';
import { Navigation } from '../../../components/common/Navigation';

const EditCustomerPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        console.log('Fetching customer data for ID:', customerId);
        const customer = await getCustomerById(customerId);
        console.log('Fetched customer data:', customer);

        // FIXED: Parse phone number correctly
        // Backend stores phone as 10 digits, but we display with country code in UI
        const phoneStr = customer.phone || '';
        let countryCode = '+91'; // Default
        let phone = phoneStr;

        // If phone already has country code, extract it
        if (phoneStr.startsWith('+')) {
          const match = phoneStr.match(/^(\+\d{1,4})(\d{10})$/);
          if (match) {
            countryCode = match[1];
            phone = match[2];
          }
        }
        // If phone is just 10 digits, use it as is
        else if (/^\d{10}$/.test(phoneStr)) {
          phone = phoneStr;
        }

        const formattedData = {
          ...customer,
          phone, // Just the 10 digits
          countryCode, // Separate country code for UI
          password: '', // Don't pre-fill password
          photo: null, // File input should be empty
          photoPreviewUrl: customer.photoPath ? `${API_BASE_URL_STATIC}${customer.photoPath}` : null,
          interests: customer.interests || [], // Ensure interests is an array
          address: customer.address || '', // Ensure address exists
        };

        console.log('Formatted initial data:', formattedData);
        setInitialData(formattedData);
      } catch (error) {
        console.error('Failed to load customer data:', error);
        showNotification('Failed to load customer data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId, showNotification]);

  const handleUpdate = async (formData, { setFieldErrors }) => {
    console.log('Starting update with form data:', formData);
    setIsSubmitting(true);

    try {
      // FIXED: Prepare payload based on whether password is provided
      const customerPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone, // ONLY the 10 digits - backend expects this format
        dob: formData.dob,
        gender: formData.gender,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        terms: true, // Satisfy backend validation for updates
        interests: formData.interests || [],
        newsletter: formData.newsletter || false,
      };

      // Only include password if it's provided and not empty
      if (formData.password && formData.password.trim() !== '') {
        customerPayload.password = formData.password;
      }

      // Handle photo upload - create FormData if photo is provided
      if (formData.photo) {
        const formDataPayload = new FormData();
        formDataPayload.append('customer', new Blob([JSON.stringify(customerPayload)], {
          type: 'application/json'
        }));
        formDataPayload.append('photo', formData.photo);

        console.log('Sending multipart payload to backend');
        const result = await updateCustomer(customerId, formDataPayload, true); // true indicates multipart
        console.log('Update successful:', result);
      } else {
        console.log('Sending JSON payload to backend:', customerPayload);
        const result = await updateCustomer(customerId, customerPayload, false); // false indicates JSON
        console.log('Update successful:', result);
      }

      showNotification("Customer updated successfully! Redirecting...", 'success');
      setTimeout(() => navigate('/customers'), 2000);
    } catch (error) {
      console.error('Update failed:', error);

      const errorData = error.response?.data;
      console.log('Update error data:', errorData);

      // Handle Spring Boot validation errors
      if (errorData && Array.isArray(errorData)) {
        const fieldErrors = {};
        errorData.forEach(err => {
          if (err.field) {
            fieldErrors[err.field] = err.defaultMessage || err.message;
          }
        });
        console.log('Setting field errors:', fieldErrors);
        setFieldErrors(fieldErrors);
      } else if (errorData?.errors) {
        setFieldErrors(errorData.errors);
      }

      const errorMessage = errorData?.message ||
                          (Array.isArray(errorData) && errorData.length > 0 ? errorData[0].defaultMessage : null) ||
                          'Update failed. Please check your information and try again.';

      showNotification(errorMessage, 'error');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-12">Loading customer data...</div>;
  }

  if (!initialData) {
    return <div className="text-center p-12 text-red-500">Could not load customer data.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PageHeader
        icon={<Users />}
        title="Edit Customer"
        subtitle={`Update details for ${initialData.firstName} ${initialData.lastName}`}
      />
      <Navigation />
      <div className="mt-8">
        <CustomerForm
          initialState={initialData}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          isEditMode={true}
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditCustomerPage;
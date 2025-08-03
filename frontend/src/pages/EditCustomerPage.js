// src/pages/EditCustomerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById, updateCustomer, API_BASE_URL_STATIC } from '../api/customerService';
import { User, Mail, Shield, Phone, Calendar, MapPin, Users, Lock, AlertCircle } from 'lucide-react';
import { FormCard } from '../components/FormCard';
import { locationData } from '../data/locationData';
import { useCustomerForm } from '../hooks/useCustomerForm';
import Notification from '../components/Notification';

// --- Reusable Components ---
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

const ValidatedInput = ({
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
  disabled = false,
  readOnly = false,
  ...props
}) => {
  const hasError = !!error;
  const isLocked = disabled || readOnly;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && !isLocked && <span className="text-red-500">*</span>}
        {isLocked && <span className="text-gray-500">(Read-only)</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className={`absolute left-3 top-2.5 h-4 w-4 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`} />}
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          onBlur={() => onBlur && onBlur(name)}
          placeholder={placeholder}
          disabled={isLocked}
          className={`w-full ${Icon ? 'pl-10' : ''} p-2 border rounded-md shadow-sm transition-colors ${
            isLocked
              ? 'bg-gray-100 cursor-not-allowed text-gray-600'
              : hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
          }`}
          {...props}
        />
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};


const EditCustomerPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);

  const {
    formData,
    states,
    cities,
    photoPreview,
    handleChange,
    handleBlur,
    validateForm,
    getFieldError,
    hasFieldError,
    setFieldErrors,
    setFormData,
    setPhotoPreview
  } = useCustomerForm(null, true); // Initialize with null, true for edit mode

  // Fetch data and initialize the form
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const customerData = await getCustomerById(customerId);
        setFormData(customerData); // Directly set the form data in the hook
        if (customerData.photoPath) {
          setPhotoPreview(`${API_BASE_URL_STATIC}${customerData.photoPath}`);
        }
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
        setNotification({ show: true, message: 'Failed to load customer data.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId, setFormData, setPhotoPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      setNotification({ show: true, message: "Please fix all validation errors before submitting.", type: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateCustomer(customerId, formData);
      setNotification({ show: true, message: "Customer updated successfully!", type: 'success' });
      setTimeout(() => navigate('/customers'), 2000);
    } catch (error) {
      const responseErrors = error?.response?.data?.errors || {};
      if (Object.keys(responseErrors).length > 0) {
        setFieldErrors(responseErrors);
      }
      setNotification({ show: true, message: error.response?.data?.message || 'Update failed.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="text-center p-10 font-semibold text-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        Loading customer details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg"><Users className="w-8 h-8 text-white" /></div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Customer</h1>
        <p className="text-lg text-gray-600">Update the details for {formData.firstName} {formData.lastName}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormCard icon={<User className="w-6 h-6 text-orange-500"/>} title="Personal Details" subtitle="Some details cannot be changed for security reasons.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValidatedInput label="First Name" name="firstName" value={formData.firstName} icon={Lock} readOnly />
            <ValidatedInput label="Last Name" name="lastName" value={formData.lastName} icon={Lock} readOnly />
            <ValidatedInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={getFieldError('email')} icon={Mail} required className="md:col-span-2" />
            <ValidatedInput label="Password" name="password" type="password" value={formData.password || ''} onChange={handleChange} onBlur={handleBlur} error={getFieldError('password')} icon={Shield} className="md:col-span-2" placeholder="Leave blank to keep current password" />
            <ValidatedInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={getFieldError('phone')} required icon={Phone} />
            <ValidatedInput label="Date of Birth" name="dob" type="date" value={formData.dob} icon={Calendar} readOnly />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-gray-500">(Read-only)</span></label>
              <div className="flex items-center space-x-4">
                {['Male', 'Female', 'Other'].map(g => (<label key={g} className="flex items-center cursor-not-allowed"><input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender && formData.gender.toLowerCase() === g.toLowerCase()} disabled className="h-4 w-4 text-orange-600 bg-gray-100"/><span className="ml-2 text-sm text-gray-500">{g}</span></label>))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center gap-4">
                <img src={photoPreview || 'https://placehold.co/64x64/f97316/white?text=📷'} alt="Profile Preview" className="h-16 w-16 rounded-full object-cover shadow-sm"/>
                <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/>
              </div>
              <ErrorMessage message={getFieldError('photo')} />
            </div>
          </div>
        </FormCard>
        <FormCard icon={<MapPin className="w-6 h-6 text-orange-500"/>} title="Address Information" subtitle="Update your address details.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <textarea id="address" name="address" value={formData.address || ''} rows="2" onChange={handleChange} onBlur={() => handleBlur('address')} className={`w-full p-2 border rounded-md shadow-sm ${hasFieldError('address') ? 'border-red-500' : 'border-gray-300'}`}/>
              <ErrorMessage message={getFieldError('address')} />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select id="country" name="country" value={formData.country || ''} onChange={handleChange} onBlur={() => handleBlur('country')} className={`w-full p-2 border rounded-md shadow-sm ${hasFieldError('country') ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select Country</option>{Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}</select>
              <ErrorMessage message={getFieldError('country')} />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
              <select id="state" name="state" value={formData.state || ''} onChange={handleChange} onBlur={() => handleBlur('state')} disabled={!formData.country} className={`w-full p-2 border rounded-md shadow-sm disabled:bg-gray-100 ${hasFieldError('state') ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <ErrorMessage message={getFieldError('state')} />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select id="city" name="city" value={formData.city || ''} onChange={handleChange} onBlur={() => handleBlur('city')} disabled={!formData.state} className={`w-full p-2 border rounded-md shadow-sm disabled:bg-gray-100 ${hasFieldError('city') ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select City</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <ErrorMessage message={getFieldError('city')} />
            </div>
            <ValidatedInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} onBlur={handleBlur} error={getFieldError('postalCode')} />
          </div>
        </FormCard>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 flex items-center justify-center gap-4">
          <Link to="/customers" className="px-8 py-3 rounded-lg text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg text-sm font-semibold bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Saving...</span></>) : (<span>Save Changes</span>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerPage;

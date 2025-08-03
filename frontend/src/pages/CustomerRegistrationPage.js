// src/pages/CustomerRegistrationPage.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Phone, Calendar, MapPin, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { registerCustomer } from '../api/customerService';
import { demoTermsText } from '../data/termsData';
import { FormCard } from '../components/FormCard';
import { locationData } from '../data/locationData';
import Notification from '../components/Notification';
import { countryCodesData } from '../data/countryCodesData';


// --- Reusable Components ---
const Navigation = () => (
  <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex items-center justify-center gap-2 mb-8 max-w-sm mx-auto">
    <NavLink to="/" className={({ isActive }) => `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200/70'}`}>Register</NavLink>
    <NavLink to="/customers" className={({ isActive }) => `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200/70'}`}>Customer List</NavLink>
  </nav>
);

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
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  const actualType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />}
        <input
          type={actualType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => onBlur(name)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : ''} ${showPasswordToggle ? 'pr-10' : ''} p-2 border rounded-md shadow-sm transition-colors ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
          }`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

const PhoneInput = ({
  label,
  name,
  value,
  countryCode,
  onChange,
  onBlur,
  onCountryCodeChange,
  error,
  required = false,
  className = "",
  placeholder = "",
}) => {
  const hasError = !!error;

 const handlePhoneChange = (e) => {
   // Extract numeric digits only
   const numericValue = e.target.value.replace(/\D/g, '');

   // Limit to max 10 digits
   const trimmedValue = numericValue.slice(0, 10);

   // Trigger the original onChange with updated value
   onChange({
     ...e,
     target: {
       ...e.target,
       name,
       value: trimmedValue,
     },
   });
 };


  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={countryCode}
            onChange={onCountryCodeChange}
            className={`p-2 border rounded-md shadow-sm transition-colors bg-white min-w-[90px] ${
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
            }`}
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            id={name}
            name={name}
            value={value}
            onChange={handlePhoneChange}
            onBlur={() => onBlur(name)}
            placeholder={placeholder}
            maxLength="15"
            className={`w-full pl-10 p-2 border rounded-md shadow-sm transition-colors ${
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
            }`}
          />
        </div>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

const initialFormState = {
  firstName: "", lastName: "", email: "", password: "", phone: "",
  countryCode: "+91", // Default country code
  dob: "", gender: "", country: "", state: "", city: "",
  address: "", postalCode: "", photo: null, interests: [],
  newsletter: false, terms: false,
};

const CustomerRegistrationPage = () => {
  const {
    formData,
    states,
    cities,
    photoPreview,
    progress,
    handleChange,
    handleBlur,
    validateForm,
    getFieldError,
    hasFieldError,
    setFieldErrors
  } = useCustomerForm(initialFormState, false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const handleCountryCodeChange = (e) => {
    handleChange({
      target: {
        name: 'countryCode',
        value: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      setNotification({ show: true, message: "Please fix all validation errors before submitting.", type: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      // Combine country code and phone number for submission
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode}${formData.phone}`
      };
      await registerCustomer(submissionData);
      setNotification({ show: true, message: "Registration successful! Redirecting...", type: 'success' });
      setTimeout(() => navigate('/customers'), 2000);
    } catch (error) {
      const responseErrors = error?.response?.data?.errors || {};
      if (Object.keys(responseErrors).length > 0) {
        setFieldErrors(responseErrors);
      }
      setNotification({ show: true, message: error.response?.data?.message || 'Registration failed.', type: 'error' });
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Registration</h1>
        <p className="text-lg text-gray-600">Create your account and discover amazing flavors</p>
      </div>
      <Navigation />
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md mb-6 p-6">
        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-700">Profile Completion</span><span className="text-sm font-bold text-orange-600">{Math.round(progress)}%</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormCard icon={<User className="w-6 h-6 text-orange-500"/>} title="Personal Details" subtitle="Tell us a bit about yourself.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValidatedInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} error={getFieldError('firstName')} required />
            <ValidatedInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} error={getFieldError('lastName')} required />
            <ValidatedInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={getFieldError('email')} required icon={Mail} className="md:col-span-2" />
            <ValidatedInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('password')}
              icon={Shield}
              required
              className="md:col-span-2"
              placeholder="At least 8 characters with uppercase, lowercase, number & special character"
              showPasswordToggle={true}
            />
            <PhoneInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              countryCode={formData.countryCode}
              onChange={handleChange}
              onBlur={handleBlur}
              onCountryCodeChange={handleCountryCodeChange}
              error={getFieldError('phone')}
              required
              placeholder="Enter phone number"
            />
            <ValidatedInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} onBlur={handleBlur} error={getFieldError('dob')} icon={Calendar} required />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-4">
                {['Male', 'Female', 'Other'].map(g => (<label key={g} className="flex items-center"><input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender === g.toLowerCase()} onChange={handleChange} onBlur={() => handleBlur('gender')} className="h-4 w-4 text-orange-600"/><span className="ml-2 text-sm">{g}</span></label>))}
              </div>
              <ErrorMessage message={getFieldError('gender')} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center gap-4">
                <img src={photoPreview || 'https://placehold.co/64x64/f97316/white?text=📷'} alt="Preview" className="h-16 w-16 rounded-full object-cover shadow-sm"/>
                <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/>
              </div>
              <ErrorMessage message={getFieldError('photo')} />
            </div>
          </div>
        </FormCard>
        <FormCard icon={<MapPin className="w-6 h-6 text-orange-500"/>} title="Address Information" subtitle="Where can we find you?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <textarea id="address" name="address" value={formData.address} rows="2" onChange={handleChange} onBlur={() => handleBlur('address')} className={`w-full p-2 border rounded-md shadow-sm ${hasFieldError('address') ? 'border-red-500' : 'border-gray-300'}`}/>
              <ErrorMessage message={getFieldError('address')} />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
              <select id="country" name="country" value={formData.country} onChange={handleChange} onBlur={() => handleBlur('country')} className={`w-full p-2 border rounded-md shadow-sm ${hasFieldError('country') ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select Country</option>{Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}</select>
              <ErrorMessage message={getFieldError('country')} />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province <span className="text-red-500">*</span></label>
              <select id="state" name="state" value={formData.state} onChange={handleChange} onBlur={() => handleBlur('state')} disabled={!formData.country} className={`w-full p-2 border rounded-md shadow-sm disabled:bg-gray-100 ${hasFieldError('state') ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <ErrorMessage message={getFieldError('state')} />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <select id="city" name="city" value={formData.city} onChange={handleChange} onBlur={() => handleBlur('city')} disabled={!formData.state} className={`w-full p-2 border rounded-md shadow-sm disabled:bg-gray-100 ${hasFieldError('city') ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select City</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <ErrorMessage message={getFieldError('city')} />
            </div>
            <ValidatedInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} onBlur={handleBlur} error={getFieldError('postalCode')} required />
          </div>
        </FormCard>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-start">
                <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} onBlur={() => handleBlur('terms')} className={`h-4 w-4 border-gray-300 rounded mt-1 ${hasFieldError('terms') ? 'border-red-500' : 'text-orange-600'}`}/>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">I agree to the Terms and Conditions <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => setShowTerms(!showTerms)} className="ml-2 text-orange-600 hover:underline text-xs font-semibold">({showTerms ? 'Hide' : 'View'} Terms)</button>
                </div>
              </div>
              <ErrorMessage message={getFieldError('terms')} />
              {showTerms && (<div className="mt-4 p-4 border rounded-md bg-gray-50 max-h-32 overflow-y-auto"><h4 className="font-bold text-gray-800 mb-2">Demo Terms</h4><p className="text-xs text-gray-600 whitespace-pre-line">{demoTermsText}</p></div>)}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all">
              {isSubmitting ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Creating Account...</span></>) : (<><Users className="w-5 h-5" /><span>Create My Account</span></>)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerRegistrationPage;
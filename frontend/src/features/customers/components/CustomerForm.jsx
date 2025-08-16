/**
 * @file A reusable form component for creating and editing customers.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, MapPin, Users, Calendar } from 'lucide-react';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { demoTermsText } from '../../../data/termsData';
import { locationData } from '../../../data/locationData';
import { FormCard } from '../../../components/common/FormCard';
import { ValidatedInput } from '../../../components/common/ValidateInput';
import { PhoneInput } from './PhoneInput';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Button } from '../../../components/common/Button';

const ProgressTracker = ({ progress }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md mb-6 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
        <span className="text-sm font-bold text-orange-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
);

const CustomerForm = ({ initialState, onSubmit, isSubmitting, isEditMode = false, submitButtonText }) => {
  const {
    formData, setFormData, states, cities, photoPreview, progress,
    handleChange, handleBlur, validateForm, errors, setFieldErrors,
  } = useCustomerForm(initialState, isEditMode);

  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, { setFieldErrors });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {!isEditMode && <ProgressTracker progress={progress} />}

      <FormCard icon={<User />} title="Personal Details" subtitle="Tell us a bit about yourself.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValidatedInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} required readOnly={isEditMode} />
            <ValidatedInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} error={errors.lastName} required readOnly={isEditMode} />
            <ValidatedInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} required icon={Mail} className="md:col-span-2" />
            <ValidatedInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} icon={Shield} required={!isEditMode} className="md:col-span-2" placeholder={isEditMode ? "Leave blank to keep current password" : "Uppercase, lowercase, number, & special char"} showPasswordToggle />
            <PhoneInput label="Phone Number" name="phone" value={formData.phone} countryCode={formData.countryCode} onChange={handleChange} onBlur={() => handleBlur('phone')} onCountryCodeChange={(e) => setFormData(prev => ({...prev, countryCode: e.target.value}))} error={errors.phone} required />
            <ValidatedInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} onBlur={handleBlur} error={errors.dob} icon={Calendar} required readOnly={isEditMode} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <div className="flex items-center space-x-4">
                {['Male', 'Female', 'Other'].map(g => (
                    <label key={g} className={`flex items-center ${isEditMode ? 'cursor-not-allowed' : ''}`}>
                        <input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender === g.toLowerCase()} onChange={handleChange} className="h-4 w-4 text-orange-600" disabled={isEditMode}/>
                        <span className={`ml-2 text-sm ${isEditMode ? 'text-gray-500' : ''}`}>{g}</span>
                    </label>
                ))}
              </div>
              <ErrorMessage message={errors.gender} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center gap-4">
                <img src={photoPreview || `https://placehold.co/64x64/f97316/white?text=${formData.firstName?.[0] || '📷'}`} alt="Preview" className="h-16 w-16 rounded-full object-cover shadow-sm"/>
                <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/>
              </div>
            </div>
        </div>
      </FormCard>

      <FormCard icon={<MapPin />} title="Address Information" subtitle="Where can we find you?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* THIS IS THE NEWLY ADDED ADDRESS FIELD */}
            <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
                <textarea id="address" name="address" value={formData.address} rows="2" onChange={handleChange} onBlur={() => handleBlur('address')} className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                <ErrorMessage message={errors.address} />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                <select id="country" name="country" value={formData.country} onChange={handleChange} onBlur={() => handleBlur('country')} className={`w-full p-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select Country</option>{Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}</select>
                <ErrorMessage message={errors.country} />
            </div>
            <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province <span className="text-red-500">*</span></label>
                <select id="state" name="state" value={formData.state} onChange={handleChange} onBlur={() => handleBlur('state')} disabled={!formData.country} className={`w-full p-2 border rounded-md disabled:bg-gray-100 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select>
                <ErrorMessage message={errors.state} />
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <select id="city" name="city" value={formData.city} onChange={handleChange} onBlur={() => handleBlur('city')} disabled={!formData.state} className={`w-full p-2 border rounded-md disabled:bg-gray-100 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}><option value="">Select City</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
                <ErrorMessage message={errors.city} />
            </div>
            <ValidatedInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} onBlur={handleBlur} error={errors.postalCode} required />
        </div>
      </FormCard>

      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 flex items-center justify-center gap-4">
        {isEditMode ? (
          <>
            <Link to="/customers" className="px-8 py-3 rounded-lg text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Link>
            <Button type="submit" isSubmitting={isSubmitting} icon={<Users />}>
              {submitButtonText}
            </Button>
          </>
        ) : (
          <div className="w-full space-y-6">
            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded mt-1" />
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">I agree to the Terms and Conditions *</label>
                <button type="button" onClick={() => setShowTerms(!showTerms)} className="ml-2 text-orange-600 hover:underline text-xs font-semibold">({showTerms ? 'Hide' : 'View'} Terms)</button>
              </div>
            </div>
            {errors.terms && <ErrorMessage message={errors.terms} />}
            {showTerms && <div className="mt-4 p-4 border rounded-md bg-gray-50 max-h-32 overflow-y-auto text-xs text-gray-600 whitespace-pre-line">{demoTermsText}</div>}
            <Button type="submit" isSubmitting={isSubmitting} icon={<Users />}>
              {submitButtonText}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CustomerForm;

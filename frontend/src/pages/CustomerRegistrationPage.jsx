// src/pages/CustomerRegistrationPage.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { User, Mail, Shield, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { registerCustomer } from '../api/customerService';
import { demoTermsText } from '../data/termsData';
import { FormCard } from '../components/FormCard';
import { locationData } from '../data/locationData';
import Notification from '../components/Notification';

// Navigation component
const Navigation = () => (
  <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex items-center justify-center gap-2 mb-8 max-w-sm mx-auto">
    <NavLink to="/" className={({ isActive }) => `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200/70'}`}>Register</NavLink>
    <NavLink to="/customers" className={({ isActive }) => `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200/70'}`}>Customer List</NavLink>
  </nav>
);

const initialFormState = {
  firstName: "", lastName: "", email: "", password: "", phone: "",
  dob: "", gender: "", country: "", state: "", city: "",
  address: "", postalCode: "", photo: null, interests: [],
  newsletter: false, terms: false,
};

const CustomerRegistrationPage = () => {
  const { formData, states, cities, photoPreview, progress, handleChange } = useCustomerForm(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      setNotification({ show: true, message: "You must agree to the terms and conditions.", type: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await registerCustomer(formData);
      console.log("✅ Customer registered:", result);
      setNotification({ show: true, message: "Registration successful! Redirecting...", type: 'success' });

      // --- NEW: Redirect to customer list after a short delay ---
      setTimeout(() => {
        navigate('/customers');
      }, 2000); // 2-second delay

    } catch (error) {
      console.error("❌ Error during registration:", error);
      setNotification({ show: true, message: `Registration failed: ${error.message}`, type: 'error' });
    } finally {
      // We don't set isSubmitting to false here because the page will redirect
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Registration</h1>
        <p className="text-lg text-gray-600">Create your account and discover amazing flavors</p>
      </div>

      <Navigation />

      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md mb-6 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-bold text-orange-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormCard icon={<User className="w-6 h-6 text-orange-500"/>} title="Personal Details" subtitle="Tell us a bit about yourself.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div>
            <div><label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div>
            <div className="md:col-span-2"><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
            <div className="md:col-span-2"><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label><div className="relative"><Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
            <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
            <div><label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label><div className="relative"><Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label><div className="flex items-center space-x-4">{['Male', 'Female', 'Other'].map(g => (<label key={g} className="flex items-center"><input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender === g.toLowerCase()} onChange={handleChange} className="h-4 w-4 text-orange-600"/><span className="ml-2 text-sm">{g}</span></label>))}</div></div>
            <div className="md:col-span-2"><label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label><div className="flex items-center gap-4"><img src={photoPreview || 'https://placehold.co/64x64/f97316/white?text=📷'} alt="Preview" className="h-16 w-16 rounded-full object-cover shadow-sm"/><input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/></div></div>
          </div>
        </FormCard>

        <FormCard icon={<MapPin className="w-6 h-6 text-orange-500"/>} title="Address Information" subtitle="Where can we find you?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><textarea id="address" name="address" value={formData.address} rows="2" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
            <div><label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="">Select Country</option>{Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province *</label><select id="state" name="state" value={formData.state} onChange={handleChange} required disabled={!formData.country} className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label><select id="city" name="city" value={formData.city} onChange={handleChange} required disabled={!formData.state} className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"><option value="">Select City</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label><input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div>
          </div>
        </FormCard>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-start"><input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} required className="h-4 w-4 text-orange-600 border-gray-300 rounded mt-1" /><div className="ml-3 text-sm"><label htmlFor="terms" className="font-medium text-gray-700">I agree to the Terms and Conditions</label><button type="button" onClick={() => setShowTerms(!showTerms)} className="ml-2 text-orange-600 hover:underline text-xs font-semibold">({showTerms ? 'Hide' : 'View'} Terms)</button></div></div>
              {showTerms && (<div className="mt-4 p-4 border rounded-md bg-gray-50 max-h-32 overflow-y-auto"><h4 className="font-bold text-gray-800 mb-2">Demo Terms</h4><p className="text-xs text-gray-600 whitespace-pre-line">{demoTermsText}</p></div>)}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              {isSubmitting ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Creating Account...</span></>) : (<><Users className="w-5 h-5" /><span>Create My Account</span></>)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerRegistrationPage;

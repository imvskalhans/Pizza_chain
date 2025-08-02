// src/pages/EditCustomerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById, updateCustomer, API_BASE_URL_STATIC } from '../api/customerService';
import { User, Mail, Shield, Phone, Calendar, MapPin, Users, Lock } from 'lucide-react';
import { FormCard } from '../components/FormCard';
import { locationData } from '../data/locationData';
import Notification from '../components/Notification';

const EditCustomerPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch the customer's data when the page loads
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerData = await getCustomerById(customerId);
        setFormData(customerData);
        if (customerData.photoPath) {
          setPhotoPreview(`${API_BASE_URL_STATIC}${customerData.photoPath}`);
        }
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
        setNotification({ show: true, message: 'Failed to load customer data.', type: 'error' });
      }
    };
    fetchCustomerData();
  }, [customerId]);

  // Handle cascading dropdowns after data is fetched
  useEffect(() => {
    if (formData?.country) {
      setStates(Object.keys(locationData[formData.country] || {}));
    }
  }, [formData?.country]);

  useEffect(() => {
    if (formData?.state) {
      setCities(locationData[formData.country]?.[formData.state] || []);
    }
  }, [formData?.country, formData?.state]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        // We store the file object in state to be sent with the form
        setFormData(prev => ({ ...prev, photo: file }));
        // We create a temporary URL for the preview
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateCustomer(customerId, formData);
      setNotification({ show: true, message: "Customer updated successfully!", type: 'success' });
      setTimeout(() => navigate('/customers'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setNotification({ show: true, message: `Update failed: ${error.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return <div className="text-center p-10 font-semibold text-gray-700">Loading customer details...</div>;
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Customer</h1>
        <p className="text-lg text-gray-600">Update the details for {formData.firstName} {formData.lastName}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormCard icon={<User className="w-6 h-6 text-orange-500"/>} title="Personal Details" subtitle="Some details cannot be changed.">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name (Read-only)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} disabled className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"/>
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name (Read-only)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} disabled className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"/>
                </div>
              </div>
              <div className="md:col-span-2"><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
              <div className="md:col-span-2"><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep unchanged)</label><div className="relative"><Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="password" id="password" name="password" onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
              <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm"/></div></div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Read-only)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                  <input type="date" id="dob" name="dob" value={formData.dob} disabled className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"/>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender (Read-only)</label>
                <div className="flex items-center space-x-4">
                  {['Male', 'Female', 'Other'].map(g => (
                    <label key={g} className="flex items-center cursor-not-allowed">
                      <input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender.toLowerCase() === g.toLowerCase()} disabled className="h-4 w-4 text-orange-600 bg-gray-100"/>
                      <span className="ml-2 text-sm text-gray-500">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2"><label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label><div className="flex items-center gap-4"><img src={photoPreview || 'https://placehold.co/64x64/f97316/white?text=📷'} alt="Profile Preview" className="h-16 w-16 rounded-full object-cover shadow-sm"/><input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/></div></div>
           </div>
        </FormCard>

        <FormCard icon={<MapPin className="w-6 h-6 text-orange-500"/>} title="Address Information" subtitle="Update address details.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><textarea id="address" name="address" value={formData.address} rows="2" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
            <div><label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="">Select Country</option>{Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province *</label><select id="state" name="state" value={formData.state} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label><select id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="">Select City</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label><input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div>
          </div>
        </FormCard>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 flex items-center justify-center gap-4">
           <Link to="/customers" className="px-8 py-3 rounded-lg text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</Link>
           <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg text-sm font-semibold bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerPage;

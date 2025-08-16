/**
 * @file This service module handles all API interactions for the Customer resource.
 * FIXED VERSION - Addresses data formatting and validation issues
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const CUSTOMERS_ENDPOINT = `${API_BASE_URL}/api/customers`;
export const API_BASE_URL_STATIC = API_BASE_URL;

const handleRequest = async (url, options = {}) => {
  try {
    console.log('Making request to:', url, 'with options:', options);
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      console.error('API Error Response:', response.status, errorData);
      const error = new Error(errorData.message || 'An API error occurred.');
      error.response = { data: errorData, status: response.status };
      throw error;
    }

    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return true;
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

const prepareCustomerData = (formData, isUpdate = false) => {
  // Clean and prepare the data for backend
  const cleanData = {
    firstName: formData.firstName?.trim(),
    lastName: formData.lastName?.trim(),
    email: formData.email?.trim(),
    phone: formData.phone, // FIXED: This should be just the 10 digits
    dob: formData.dob,
    gender: formData.gender,
    address: formData.address?.trim() || '', // Ensure address is included
    postalCode: formData.postalCode?.trim(),
    country: formData.country,
    state: formData.state,
    city: formData.city,
    interests: Array.isArray(formData.interests) ? formData.interests : [],
    newsletter: Boolean(formData.newsletter),
    terms: Boolean(formData.terms)
  };

  // Handle password based on operation type
  if (isUpdate) {
    // For updates, only include password if it's provided and not empty
    if (formData.password && formData.password.trim() !== '') {
      cleanData.password = formData.password.trim();
    }
    // Don't include password field at all if it's empty during update
  } else {
    // For creation, password is required
    cleanData.password = formData.password;
  }

  // Remove undefined/null values
  Object.keys(cleanData).forEach(key => {
    if (cleanData[key] === undefined || cleanData[key] === null) {
      delete cleanData[key];
    }
  });

  return cleanData;
};

export const registerCustomer = async (formData) => {
  console.log('Registering customer with data:', formData);

  // FIXED: Send only the 10-digit phone number, not the country code
  const customerData = prepareCustomerData(formData, false); // false = not an update
  console.log('Prepared customer data:', customerData);

  // Check if we have a photo file
  if (formData.photo instanceof File) {
    // Use multipart/form-data for file upload
    const data = new FormData();
    data.append("customer", new Blob([JSON.stringify(customerData)], { type: "application/json" }));
    data.append("photo", formData.photo);

    console.log('Sending multipart data for registration');
    return handleRequest(CUSTOMERS_ENDPOINT, {
      method: "POST",
      body: data
    });
  } else {
    // Use JSON for no photo upload
    console.log('Sending JSON data for registration');
    return handleRequest(CUSTOMERS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData)
    });
  }
};

export const updateCustomer = async (id, formData) => {
  console.log('Updating customer with ID:', id, 'and data:', formData);

  const customerData = prepareCustomerData(formData, true); // true = this is an update
  console.log('Prepared update data:', customerData);

  // Check if we have a photo file
  if (formData.photo instanceof File) {
    // Use multipart/form-data for file upload
    const data = new FormData();
    data.append("customer", new Blob([JSON.stringify(customerData)], { type: "application/json" }));
    data.append("photo", formData.photo);

    console.log('Sending multipart data for update');
    return handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: data
    });
  } else {
    // Use JSON for no photo upload
    console.log('Sending JSON data for update');
    return handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData)
    });
  }
};

export const getAllCustomers = (page = 0, size = 10, sort = 'firstName,asc', searchTerm = '') => {
  // Use different endpoints based on whether we're searching or not
  if (searchTerm && searchTerm.trim()) {
    // Use the search endpoint when there's a search term
    const url = new URL(`${CUSTOMERS_ENDPOINT}/search`);
    url.searchParams.append('keyword', searchTerm.trim());
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    url.searchParams.append('sort', sort);
    return handleRequest(url.toString());
  } else {
    // Use the regular endpoint when no search term
    const url = new URL(CUSTOMERS_ENDPOINT);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    url.searchParams.append('sort', sort);
    return handleRequest(url.toString());
  }
};

export const deleteCustomer = (id) => {
  return handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`, { method: 'DELETE' });
};

export const getCustomerById = (id) => {
  return handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`);
};
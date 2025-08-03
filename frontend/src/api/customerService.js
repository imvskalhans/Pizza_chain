/**
 * @file This service module handles all API interactions for the Customer resource.
 */

// --- Configuration ---
// Fix: Provide fallback for environment variable and handle undefined case
const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();
const CUSTOMERS_ENDPOINT = `${API_BASE_URL}/api/customers`;
export const API_BASE_URL_STATIC = API_BASE_URL;

// --- Private Helper Functions ---
const handleRequest = async (url, options = {}) => {
  try {
    // Add default headers for better compatibility
    const defaultOptions = {
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      let errorText = '';
      try {
        // Try to get error text, but don't fail if response body is already consumed
        errorText = await response.text();
      } catch (textError) {
        errorText = `Status: ${response.status} ${response.statusText}`;
      }
      throw new Error(`API Request Failed: ${response.status}. Server response: ${errorText}`);
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return { success: true };
    }

    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      // If not JSON, return text or indicate success
      const text = await response.text();
      return text || { success: true };
    }

  } catch (error) {
    console.error("An error occurred in handleRequest:", error);

    // Provide more specific error information
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${url}. Please check your internet connection and server status.`);
    }

    throw error;
  }
};

const createCustomerFormData = (customerPayload, photo) => {
  try {
    const formData = new FormData();

    // Ensure customerPayload is valid before stringifying
    if (!customerPayload || typeof customerPayload !== 'object') {
      throw new Error('Invalid customer data provided');
    }

    formData.append("customer", new Blob([JSON.stringify(customerPayload)], { type: "application/json" }));

    // More robust file validation
    if (photo) {
      if (photo instanceof File) {
        formData.append("photo", photo);
      } else if (photo instanceof Blob) {
        formData.append("photo", photo, "photo");
      } else {
        console.warn('Photo is not a valid File or Blob object');
      }
    }

    return formData;
  } catch (error) {
    console.error("Error creating form data:", error);
    throw new Error(`Failed to create form data: ${error.message}`);
  }
};

// --- Public API Functions ---
export const registerCustomer = async (customerData) => {
  try {
    if (!customerData) {
      throw new Error('Customer data is required');
    }

    const { photo, ...customerPayload } = customerData;
    const body = createCustomerFormData(customerPayload, photo);
    return await handleRequest(CUSTOMERS_ENDPOINT, { method: "POST", body: body });
  } catch (error) {
    console.error("Error registering customer:", error);
    throw error;
  }
};

export const getAllCustomers = async (page = 0, size = 10, sort = 'firstName,asc', searchTerm = '') => {
  try {
    const url = new URL(CUSTOMERS_ENDPOINT);

    // Validate parameters
    const pageNum = Math.max(0, parseInt(page) || 0);
    const sizeNum = Math.max(1, Math.min(100, parseInt(size) || 10)); // Limit size to reasonable range

    url.searchParams.append('page', pageNum.toString());
    url.searchParams.append('size', sizeNum.toString());
    url.searchParams.append('sort', sort || 'firstName,asc');

    if (searchTerm && searchTerm.trim()) {
      url.searchParams.append('search', searchTerm.trim());
    }

    return await handleRequest(url.toString());
  } catch (error) {
    console.error("Error getting customers:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    if (!id) {
      throw new Error('Customer ID is required');
    }
    return await handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    if (!id) {
      throw new Error('Customer ID is required');
    }
    return await handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error("Error getting customer by ID:", error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    if (!id) {
      throw new Error('Customer ID is required');
    }
    if (!customerData) {
      throw new Error('Customer data is required');
    }

    const { photo, ...customerPayload } = customerData;
    const body = createCustomerFormData(customerPayload, photo);
    return await handleRequest(`${CUSTOMERS_ENDPOINT}/${id}`, { method: 'PUT', body: body });
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};
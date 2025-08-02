// Get the base URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Define the specific path for the customer resource
const CUSTOMERS_ENDPOINT = `${API_BASE_URL}/api/customers`;

export const registerCustomer = async (formData) => {
  const data = new FormData();
  const customerPayload = { ...formData, photo: undefined };
  data.append("customer", new Blob([JSON.stringify(customerPayload)], { type: "application/json" }));
  if (formData.photo) {
    data.append("photo", formData.photo);
  }

  // Use the full endpoint path
  const response = await fetch(CUSTOMERS_ENDPOINT, {
    method: "POST",
    body: data
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Registration failed: ${response.status}. Server says: ${errorData}`);
  }
  return await response.json();
};

export const getAllCustomers = async (page = 0, size = 10, sort = 'firstName,asc', searchTerm = '') => {
  // Construct the URL with query parameters
  const url = `${CUSTOMERS_ENDPOINT}?page=${page}&size=${size}&sort=${sort}&search=${searchTerm}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch customers.");
  }
  return await response.json();
};

export const deleteCustomer = async (id) => {
  // Append the ID to the endpoint path
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete customer.');
  }
  return true;
};

export const getCustomerById = async (id) => {
    const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch customer data.");
    }
    return await response.json();
};

export const updateCustomer = async (id, formData) => {
    const data = new FormData();
    const customerPayload = { ...formData, photo: undefined };
    if (formData.photo instanceof File) {
        data.append("photo", formData.photo);
        delete customerPayload.photo;
    }
    data.append("customer", new Blob([JSON.stringify(customerPayload)], { type: "application/json" }));

    const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: data
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Update failed: ${errorData}`);
    }
    return await response.json();
};

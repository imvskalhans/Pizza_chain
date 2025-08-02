const API_URL = process.env.REACT_APP_API_URL;
export const API_BASE_URL_STATIC = API_URL.replace("/api/customers", "");

export const registerCustomer = async (formData) => {
  const data = new FormData();
  const customerPayload = { ...formData, photo: undefined };
  data.append("customer", new Blob([JSON.stringify(customerPayload)], { type: "application/json" }));
  if (formData.photo) {
    data.append("photo", formData.photo);
  }
  const response = await fetch(API_URL, { method: "POST", body: data });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Registration failed: ${response.status}. Server says: ${errorData}`);
  }
  return await response.json();
};

// This function now handles backend pagination, sorting, and searching
export const getAllCustomers = async (page = 0, size = 10, sort = 'firstName,asc', searchTerm = '') => {
  // Construct the URL with query parameters for the backend
  const url = `${API_URL}?page=${page}&size=${size}&sort=${sort}&search=${searchTerm}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch customers.");
  }

  return await response.json(); // This will now return the Page object from Spring
};

export const deleteCustomer = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete customer.');
  }
  return true;
};

export const getCustomerById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
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
    const response = await fetch(`${API_URL}/${id}`, { method: 'PUT', body: data });
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Update failed: ${errorData}`);
    }
    return await response.json();
};

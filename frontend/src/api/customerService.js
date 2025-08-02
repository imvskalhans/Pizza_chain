export const registerCustomer = async (formData) => {
  const data = new FormData();

  // Create a payload for the 'customer' part, excluding the file object itself.
  const customerPayload = { ...formData, photo: undefined };
  
  // Append the JSON part as a Blob.
  data.append("customer", new Blob([JSON.stringify(customerPayload)], { type: "application/json" }));
  
  // Append the photo file if it exists.
  if (formData.photo) {
    data.append("photo", formData.photo);
  }

  // backend endpoint.
  const response = await fetch("https://pizzachain-backend.onrender.com/api/customers", {
    method: "POST",
    body: data,
    // Note: The browser automatically sets the 'Content-Type' to 'multipart/form-data'
    // with the correct boundary when you use FormData. Do not set it manually.
  });

  if (!response.ok) {
    // Attempt to get more detailed error info from the backend response.
    const errorData = await response.text();
    throw new Error(`Registration failed: ${response.status} ${response.statusText}. Server says: ${errorData}`);
  }

  return await response.json();
};

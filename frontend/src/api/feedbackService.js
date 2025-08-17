/**
 * @file Enhanced Feedback service for API calls with PUT/PATCH/DELETE.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const FEEDBACK_ENDPOINT = `${API_BASE_URL}/api/feedback`;

const handleRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return true;
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw new Error(`Failed to process request: ${error.message}`);
  }
};

export const getFeedbackForCustomer = (customerId) => {
    return handleRequest(`${FEEDBACK_ENDPOINT}/${customerId}`);
};

// FIX: Use URLSearchParams to send data as a request parameter
export const addFeedbackForCustomer = (customerId, feedbackText) => {
    const formData = new URLSearchParams();
    formData.append('text', feedbackText.trim());

    return handleRequest(`${FEEDBACK_ENDPOINT}/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });
};

export const updateFeedback = (feedbackId, feedbackText) => {
    const formData = new URLSearchParams();
    formData.append('text', feedbackText.trim());

    return handleRequest(`${FEEDBACK_ENDPOINT}/${feedbackId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });
};

export const patchFeedback = (feedbackId, feedbackText) => {
    const formData = new URLSearchParams();
    formData.append('text', feedbackText.trim());

    return handleRequest(`${FEEDBACK_ENDPOINT}/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });
};

export const deleteFeedback = (feedbackId) => {
    return handleRequest(`${FEEDBACK_ENDPOINT}/${feedbackId}`, {
        method: 'DELETE',
    });
};

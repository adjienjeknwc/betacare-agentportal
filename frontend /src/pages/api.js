// src/pages/api.js
export const fetchFromPortal = async (endpoint, options = {}) => {
  const token = localStorage.getItem('agent_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error("Session validation token expired.");
  }

  return response.json();
};
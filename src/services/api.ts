import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Creează instanță axios cu configurație de bază
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secunde timeout
});

// Interceptor pentru a adăuga token-ul JWT la toate request-urile
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pentru gestionarea răspunsurilor și erorilor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirat sau invalid
      localStorage.removeItem('token');
      
      // Redirecționează la login doar dacă nu suntem deja pe pagina de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Pentru alte erori, aruncă o eroare cu mesaj user-friendly
    if (error.response?.data?.error?.message) {
      error.message = error.response.data.error.message;
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.message === 'Network Error') {
      error.message = 'Eroare de conexiune. Verificați conexiunea la internet.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Încercați din nou.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
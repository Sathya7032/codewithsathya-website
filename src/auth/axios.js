// src/utils/axios.js
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../auth/token';
import { jwtDecode } from 'jwt-decode';

let userSetter = null; // External setter to update user state

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: Fetch user profile using JWT
const fetchUserProfileUsingJWT = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    console.warn("⚠️ No JWT token found in localStorage.");
    return null;
  }

  try {
    const response = await api.get('auth/user/');
    if (response.data) {
      console.log("✅ User data from JWT:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      if (typeof userSetter === 'function') {
        userSetter(response.data); // update React context or state
      }
      return response.data;
    }
  } catch (error) {
    console.error("❌ Failed to fetch user profile with JWT:", error.response?.data || error.message);
    return null;
  }
};

// Token refresher function
const refreshToken = async () => {
  const refresh = localStorage.getItem(REFRESH_TOKEN);
  if (!refresh) return null;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh,
    });

    if (response.status === 200) {
      const { access } = response.data;
      localStorage.setItem(ACCESS_TOKEN, access);
      console.log('🔄 Token refreshed');
      await fetchUserProfileUsingJWT();
      return access;
    }
  } catch (error) {
    console.error('🔁 Token refresh failed:', error.response?.data || error.message);
    return null;
  }
};

// Axios request interceptor
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          token = await refreshToken();
        }
      } catch (e) {
        console.error('❌ Failed to decode token:', e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.warn('🚫 Unauthorized! You may need to login again.');
      }
    }
    return Promise.reject(error);
  }
);

// Auto refresh token every 1 minute
const startTokenAutoRefresh = () => {
  setInterval(async () => {
    console.log('🔁 Auto-refreshing token...');
    await refreshToken();
  }, 60 * 1000); // every 1 minute
};

// Export helpers
export const initAxiosAuth = (setUser) => {
  userSetter = setUser;
  startTokenAutoRefresh();
  fetchUserProfileUsingJWT(); // Initial user fetch
};

export default api;

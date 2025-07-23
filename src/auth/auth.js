import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN } from "./token";

const AuthContext = createContext({
  isAuthorized: false,
  user: null,
  login: () => {},
  logout: () => {},
  refreshToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    console.log("🔍 Running checkAuth...");
    const token = localStorage.getItem(ACCESS_TOKEN);
    const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

    if (token) {
      console.log("🔐 Found JWT access token:", token);
      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        console.log(`⏰ Token expires at: ${tokenExpiration}, now is: ${now}`);

        if (tokenExpiration < now) {
          console.log("⚠️ Token expired, trying to refresh...");
          await refreshToken();
        } else {
          console.log("✅ Token is valid. Setting user and isAuthorized");

          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("❌ Failed to decode JWT:", error);
        logout();
      }
    } else if (googleAccessToken) {
      console.log("🔐 Found Google access token:", googleAccessToken);
      try {
        const isValid = await validateGoogleToken(googleAccessToken);
        console.log("✅ Google token validation result:", isValid);
        if (isValid) {
          setIsAuthorized(true);
          await fetchGoogleUserProfile(googleAccessToken);
        } else {
          logout();
        }
      } catch (error) {
        console.error("❌ Error validating Google token:", error);
        logout();
      }
    } else {
      console.log("⚠️ No access token found in localStorage.");
    }
  };

  const fetchGoogleUserProfile = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.warn("⚠️ No JWT token found in localStorage.");
      return null;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        console.log("✅ User data from JWT:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data)
        return response.data;
      }
    } catch (error) {
      console.error(
        "❌ Failed to fetch user profile with JWT:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    console.log("🔄 Attempting to refresh JWT token...");
    if (!refreshToken) {
      console.warn("⚠️ No refresh token found!");
      return false;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshToken,
      });

      console.log("✅ Token refresh successful:", res.data);

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        const decoded = jwtDecode(res.data.access);
        setIsAuthorized(true);
        return true;
      }
    } catch (error) {
      console.error(
        "❌ Token refresh failed:",
        error.response?.data || error.message
      );
      logout();
    }
    return false;
  };

  const validateGoogleToken = async (googleAccessToken) => {
    console.log("🔍 Validating Google token with backend...");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/google/validate_token/",
        {
          access_token: googleAccessToken,
        }
      );
      console.log("✅ Google token validation response:", res.data);

      return res.data.valid;
    } catch (error) {
      console.error(
        "❌ Google token validation failed:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const login = async (credentials) => {
    console.log("🔐 Starting login...", credentials);
    try {
      let res;
      if (credentials.google_token) {
        console.log(
          "🔁 Logging in using Google token:",
          credentials.google_token
        );

        localStorage.setItem(GOOGLE_ACCESS_TOKEN, credentials.google_token);

        // ❌ This is incorrect (GET with token in body). You should use POST!
        res = await axios.post(
          "http://127.0.0.1:8000/api/google/validate_token/",
          {
            access_token: credentials.google_token,
          }
        );
        console.log("✅ Backend response from Google login:", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("user data ", res.data.user);
      } else {
        console.log("📝 Logging in with credentials:", credentials);
        res = await axios.post("http://127.0.0.1:8000/api/token/", credentials);
      }

      if (res.data.access) {
        console.log("✅ Login successful! Storing tokens...");
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        if (res.data.refresh) {
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        }
        await checkAuth();
        return true;
      }

      console.warn("⚠️ No access token returned from login");
      return false;
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      logout();
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out. Clearing tokens...");
    [ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN].forEach((tokenKey) => {
      localStorage.removeItem(tokenKey);
    });
    localStorage.removeItem("user");
    setIsAuthorized(false);
    setUser(null);
  };

  useEffect(() => {
    console.log("🔃 Running initial auth check on load...");
    checkAuth();

    const interval = setInterval(() => {
      console.log("🔁 Periodic auth check...");
      checkAuth();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        user,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

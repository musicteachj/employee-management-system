import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, AuthToken, UserLogin, UserRegister } from "../types";

const API_BASE_URL = "http://localhost:8000/api";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Initialize from localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        clearAuth();
      }
    }
  };

  // Actions
  const login = async (credentials: UserLogin): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const tokenData: AuthToken = await response.json();
      token.value = tokenData.access_token;

      // Store token in localStorage
      localStorage.setItem("auth_token", tokenData.access_token);

      // Fetch user info
      await fetchCurrentUser();

      return true;
    } catch (err: any) {
      error.value = err.message || "An error occurred during login";
      console.error("Login error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: UserRegister): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      // After successful registration, log in automatically
      return await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (err: any) {
      error.value = err.message || "An error occurred during registration";
      console.error("Registration error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCurrentUser = async (): Promise<boolean> => {
    if (!token.value) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData: User = await response.json();
      user.value = userData;

      // Store user in localStorage
      localStorage.setItem("auth_user", JSON.stringify(userData));

      return true;
    } catch (err: any) {
      console.error("Fetch user error:", err);
      clearAuth();
      return false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    error.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!token.value) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const tokenData: AuthToken = await response.json();
      token.value = tokenData.access_token;
      localStorage.setItem("auth_token", tokenData.access_token);

      return true;
    } catch (err: any) {
      console.error("Token refresh error:", err);
      clearAuth();
      return false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  // Initialize auth on store creation
  initializeAuth();

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshToken,
    clearError,
    initializeAuth,
  };
});

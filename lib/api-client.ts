// API client for making requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    const authToken = token || this.token;
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle token refresh on 401
    if (response.status === 401 && this.refreshToken && !token) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        return this.request(endpoint, { ...options, token: this.token! });
      } else {
        // Refresh failed, redirect to login
        this.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    return false;
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
  }) {
    const response = await this.request<any>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.tokens) {
      this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    }
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.tokens) {
      this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    }
    return response;
  }

  async logout() {
    this.clearTokens();
  }

  async getProfile() {
    return this.request<any>("/api/auth/profile");
  }

  async updateProfile(data: any) {
    return this.request<any>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Parts endpoints
  async getParts(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<any>(`/api/parts${queryString}`);
  }

  async getPart(id: string) {
    return this.request<any>(`/api/parts/${id}`);
  }

  async createPart(data: any) {
    return this.request<any>("/api/parts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePart(id: string, data: any) {
    return this.request<any>(`/api/parts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePart(id: string) {
    return this.request<any>(`/api/parts/${id}`, {
      method: "DELETE",
    });
  }

  // Quote endpoints
  async createQuote(data: any) {
    return this.request<any>("/api/quotes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getQuotes(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<any>(`/api/quotes${queryString}`);
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request<any>("/api/admin/dashboard");
  }

  // User dashboard endpoints
  async getUserDashboardStats() {
    return this.request<any>("/api/user/dashboard");
  }

  // Company stats endpoints (public)
  async getCompanyStats() {
    return this.request<any>("/api/company/stats");
  }

  // Partner endpoints
  async createPartnerApplication(data: any) {
    return this.request<any>("/api/partners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPartnerApplications(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<any>(`/api/partners${queryString}`);
  }

  async getPartnerApplication(id: string) {
    return this.request<any>(`/api/partners/${id}`);
  }

  async updatePartnerApplicationStatus(id: string, data: any) {
    return this.request<any>(`/api/partners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deletePartnerApplication(id: string) {
    return this.request<any>(`/api/partners/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();

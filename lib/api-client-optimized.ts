// Optimized API client with caching and better error handling

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiOptions extends RequestInit {
  token?: string;
  skipCache?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class OptimizedApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private requestQueue: Map<string, Promise<any>> = new Map();

  constructor() {
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

  /**
   * Get cached data if available and not expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache for a specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Deduplicate simultaneous requests to the same endpoint
   */
  private async deduplicateRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const existingRequest = this.requestQueue.get(key);
    if (existingRequest) {
      return existingRequest;
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token, skipCache = false, ...fetchOptions } = options;
    const cacheKey = `${fetchOptions.method || 'GET'}-${endpoint}`;

    // Check cache for GET requests only
    if (fetchOptions.method === 'GET' || !fetchOptions.method) {
      if (!skipCache) {
        const cachedData = this.getFromCache<T>(cacheKey);
        if (cachedData !== null) {
          return cachedData;
        }
      }
    }

    // Deduplicate simultaneous requests
    return this.deduplicateRequest(cacheKey, async () => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      const authToken = token || this.token;
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
        });

        // Handle token refresh on 401
        if (response.status === 401 && this.refreshToken && !token) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.request(endpoint, { ...options, token: this.token! });
          } else {
            this.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            throw new Error("Session expired. Please login again.");
          }
        }

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Request failed" }));
          throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache GET requests
        if (fetchOptions.method === 'GET' || !fetchOptions.method) {
          this.setCache(cacheKey, data);
        }

        return data;
      } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          throw new Error('Network error. Please check your connection.');
        }
        throw error;
      }
    });
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
      skipCache: true,
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
      skipCache: true,
    });
    if (response.tokens) {
      this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    }
    return response;
  }

  async logout() {
    this.clearTokens();
    this.clearCache();
  }

  async getProfile() {
    return this.request<any>("/api/auth/profile");
  }

  async updateProfile(data: any) {
    const response = await this.request<any>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      skipCache: true,
    });
    this.clearCache(); // Clear cache after profile update
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
      skipCache: true,
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
    const response = await this.request<any>("/api/parts", {
      method: "POST",
      body: JSON.stringify(data),
      skipCache: true,
    });
    this.clearCache(); // Clear cache after creating part
    return response;
  }

  async updatePart(id: string, data: any) {
    const response = await this.request<any>(`/api/parts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      skipCache: true,
    });
    this.clearCache(); // Clear cache after updating part
    return response;
  }

  async deletePart(id: string) {
    const response = await this.request<any>(`/api/parts/${id}`, {
      method: "DELETE",
      skipCache: true,
    });
    this.clearCache(); // Clear cache after deleting part
    return response;
  }

  // Quote endpoints
  async createQuote(data: any) {
    return this.request<any>("/api/quotes", {
      method: "POST",
      body: JSON.stringify(data),
      skipCache: true,
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
      skipCache: true,
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
    const response = await this.request<any>(`/api/partners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      skipCache: true,
    });
    this.clearCache();
    return response;
  }

  async deletePartnerApplication(id: string) {
    const response = await this.request<any>(`/api/partners/${id}`, {
      method: "DELETE",
      skipCache: true,
    });
    this.clearCache();
    return response;
  }

  // User management endpoints (Admin only)
  async getUsers(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<any>(`/api/admin/users${queryString}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/api/admin/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    const response = await this.request<any>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      skipCache: true,
    });
    this.clearCache();
    return response;
  }

  async deleteUser(id: string) {
    const response = await this.request<any>(`/api/admin/users/${id}`, {
      method: "DELETE",
      skipCache: true,
    });
    this.clearCache();
    return response;
  }

  // Order management endpoints
  async getOrders(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<any>(`/api/orders${queryString}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/api/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request<any>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
      skipCache: true,
    });
  }

  async updateOrder(id: string, data: any) {
    const response = await this.request<any>(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      skipCache: true,
    });
    this.clearCache();
    return response;
  }
}

export const apiClient = new OptimizedApiClient();


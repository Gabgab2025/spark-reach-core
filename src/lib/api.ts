// API client with JWT auth — replaces Supabase client
/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ---- Token helpers ----
const TOKEN_KEY = 'jdgk_access_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ---- Request layer ----
interface RequestOptions extends RequestInit {
  data?: any;
  /** Query parameters appended to the URL */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Skip the Authorization header (e.g. for login) */
  skipAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T | null; error: any }> {
  const { data, headers, skipAuth, params, ...customConfig } = options;

  // Build query string from params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const authHeaders: Record<string, string> = {};
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    // Automatic session clear on 401
    if (response.status === 401) {
      clearAuthToken();
      const errorData = await response.json().catch(() => ({ detail: 'Unauthorized' }));
      return { data: null, error: new Error(errorData.detail || 'Unauthorized') };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return { data: null, error: new Error(errorData.detail || response.statusText) };
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { data: null, error: null };
    }

    const responseData = await response.json();
    return { data: responseData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Multipart upload helper (no JSON Content-Type so browser sets boundary)
async function uploadRequest<T>(endpoint: string, formData: FormData): Promise<{ data: T | null; error: any }> {
  const authHeaders: Record<string, string> = {};
  const token = getAuthToken();
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    if (response.status === 401) {
      clearAuthToken();
      return { data: null, error: new Error('Unauthorized') };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
      return { data: null, error: new Error(errorData.detail || response.statusText) };
    }

    const responseData = await response.json();
    return { data: responseData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, data, method: 'POST' }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, data, method: 'PUT' }),
  patch: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, data, method: 'PATCH' }),
  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
  upload: <T>(endpoint: string, formData: FormData) => uploadRequest<T>(endpoint, formData),
};

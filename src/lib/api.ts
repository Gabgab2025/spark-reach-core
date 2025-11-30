// Generic API client to replace Supabase
// This assumes you have a backend running at /api that accepts JSON

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T | null; error: any }> {
  const { data, headers, ...customConfig } = options;
  
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return { data: null, error: new Error(errorData.message || response.statusText) };
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

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, data, method: 'POST' }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, data, method: 'PUT' }),
  patch: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, data, method: 'PATCH' }),
  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};

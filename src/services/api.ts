import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Default backend URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token or other headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear token
      localStorage.removeItem('authToken')
      // You might want to redirect to login page here
    }
    return Promise.reject(error)
  },
)

// API service methods
export const apiService = {
  // GET request
  get: <T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config)
  },

  // POST request
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config)
  },

  // PUT request
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config)
  },

  // PATCH request
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return api.patch<T>(url, data, config)
  },

  // DELETE request
  delete: <T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config)
  },
}

// Export the axios instance for advanced usage
export default api

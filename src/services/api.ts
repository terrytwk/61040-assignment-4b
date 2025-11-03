import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use proxy in development
  // Deployed on free tier on Render, where first request often takes 50+seconds. Ideally, set to 10 seconds
  timeout: 100000, // 100 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug logging
console.log('API Configuration:')
console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('- Final baseURL:', import.meta.env.VITE_API_BASE_URL || '/api')
console.log('- Current origin:', window.location.origin)

// Request interceptor to add auth token or other headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Debug: Log the actual request URL
    console.log('Making API request to:', config.url)
    console.log('Full URL:', (config.baseURL || '') + (config.url || ''))

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

// Menu API methods based on API specification
export const menuApi = {
  // Get all active menu items
  getAllActiveItems: () => {
    return api.post('/Menu/_allActiveItems', {})
  },

  // Get options for a specific menu item
  getOptionsForItem: (itemId: string) => {
    return api.post('/Menu/_optionsForItem', { item: itemId })
  },

  // Get available choices for an item's option
  getChoicesFor: (itemId: string, optionId: string) => {
    return api.post('/Menu/_choicesFor', { item: itemId, option: optionId })
  },

  // Validate a selection set for a menu item
  validateSelectionSet: (itemId: string, selections: Array<{ option: string; choice: string }>) => {
    return api.post('/Menu/_isSelectionSetValid', { item: itemId, selections })
  },
}

// Order API methods based on API specification
export const orderApi = {
  // Open a new order for a user
  openOrder: (userId: string) => {
    return api.post('/Order/open', { user: userId })
  },

  // Add an item to an order
  addItem: (
    orderId: string,
    itemId: string,
    qty: number,
    displayItemName: string,
    selections: Array<{
      option: string
      choice: string
      displayOptionName: string
      displayChoiceName: string
    }>,
  ) => {
    return api.post('/Order/addItem', {
      order: orderId,
      item: itemId,
      qty,
      displayItemName,
      selections,
    })
  },

  // Submit a pending order
  submitOrder: (orderId: string) => {
    return api.post('/Order/submit', { order: orderId })
  },

  // Get order lines
  getOrderLines: (orderId: string) => {
    return api.post('/Order/_lines', { order: orderId })
  },

  // Get order status
  getOrderStatus: (orderId: string) => {
    return api.post('/Order/_status', { order: orderId })
  },

  // Complete an order
  completeOrder: (orderId: string) => {
    return api.post('/Order/complete', { order: orderId })
  },

  // Get orders by status
  getOrdersByStatus: (status: 'pending' | 'completed' | 'canceled') => {
    return api.post('/Order/_byStatus', { status })
  },
}

// Authentication API methods based on API specification
export const authApi = {
  // Register a new user
  register: (username: string, password: string) => {
    return api.post('/UserAuthentication/register', { username, password })
  },

  // Login user
  login: (username: string, password: string) => {
    return api.post('/UserAuthentication/login', { username, password })
  },

  // Change password
  changePassword: (userId: string, oldPassword: string, newPassword: string) => {
    return api.post('/UserAuthentication/changePassword', {
      user: userId,
      oldPassword,
      newPassword,
    })
  },

  // Get user by username
  getUserByUsername: (username: string) => {
    return api.post('/UserAuthentication/_byUsername', { username })
  },

  // Search users by Kerb (partial username match)
  searchUsersByKerb: (kerbQuery: string) => {
    return api.post('/UserAuthentication/_searchByKerb', { kerbQuery })
  },

  // Find user by Kerb (exact username match)
  findUserByKerb: (kerbQuery: string) => {
    return api.post('/UserAuthentication/_findByKerb', { kerbQuery })
  },
}

// UserProfile API methods based on API specification
export const userProfileApi = {
  // Set user profile information
  setProfile: (
    userId: string,
    profileData: {
      name?: string
      classYear?: string
      major?: string
      bio?: string
      favoriteDrink?: string
      favoriteCafe?: string
      avatar?: string
    },
  ) => {
    return api.post('/UserProfile/setProfile', {
      user: userId,
      ...profileData,
    })
  },

  // Get user profile information
  getProfile: (userId: string) => {
    return api.post('/UserProfile/_profile', { user: userId })
  },
  // Get all user profiles
  getAllProfiles: () => {
    return api.post('/UserProfile/_allProfiles', {})
  },
}

// CustomerFeedback API methods
export const feedbackApi = {
  // Create feedback for a completed order
  create: (userId: string, orderId: string, comment: string) => {
    return api.post('/CustomerFeedback/create', {
      user: userId,
      order: orderId,
      comment,
    })
  },
  // Get feedback for a specific order
  forOrder: (orderId: string) => {
    return api.post('/CustomerFeedback/_forOrder', { order: orderId })
  },
  // Get feedback left by a specific user
  forUser: (userId: string) => {
    return api.post('/CustomerFeedback/_forUser', { user: userId })
  },
}

// Export individual functions for easier imports
export const {
  // Menu API
  getAllActiveItems: getMenuItems,
  getOptionsForItem,
  getChoicesFor: getChoicesForOption,
  validateSelectionSet: validateSelections,
  // Order API
  openOrder,
  addItem: addItemToOrder,
  submitOrder,
  getOrderLines,
  getOrderStatus,
  completeOrder,
  getOrdersByStatus,
  // Auth API
  register: registerUser,
  login: loginUser,
  changePassword,
  getUserByUsername,
  searchUsersByKerb,
  findUserByKerb,
  // Profile API
  setProfile,
  getProfile,
  getAllProfiles,
  // Feedback API
  create: createFeedback,
  forOrder: getFeedbackForOrder,
  forUser: getFeedbackForUser,
} = {
  ...menuApi,
  ...orderApi,
  ...authApi,
  ...feedbackApi,
  ...userProfileApi,
}

// Export the axios instance for advanced usage
export default api

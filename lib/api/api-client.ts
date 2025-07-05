import { ApiResponse, InvoiceResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new ApiError(response.status, error.message)
  }

  const data = await response.json()
  // If the response type is InvoiceResponse, return the whole object
  if (data && typeof data === 'object' && 'data' in data && 'summary' in data) {
    return data as T
  }
  // If response is array, return directly
  if (Array.isArray(data)) {
    return data as T
  }
  // If response is object and has data field, return data
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data
  }
  // Otherwise return the whole response
  return data
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const url = `${API_BASE_URL}${endpoint}`
  console.log('Fetching URL:', url)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    return handleResponse<T>(response)
  } catch (error) {
    console.error('Fetch Error:', error)
    throw error
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
} 
import axios from 'axios'

const isProduction = import.meta.env.PROD
const apiUrl: string = isProduction ? 'https://launchpad-2ycml.ondigitalocean.app/api' : ''

export const apiRequestor = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
  withCredentials: false,
})

apiRequestor.interceptors.request.use(
  config => {
    if (!isProduction && config.url) {
      config.url = `/api${config.url}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

apiRequestor.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data)

      switch (error.response.status) {
        case 401:
          console.error('Authentication error. Please log in again.')
          break
        case 403:
          console.error('You do not have permission to access this resource.')
          break
        case 404:
          console.error('Resource not found:', error.config.url)
          break
        case 500:
          console.error('Server error. Please try again later.')
          break
        default:
          console.error(`Error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`)
      }
    } else if (error.request) {
      console.error('Network error. No response received:', error.request)
    } else {
      console.error('Request configuration error:', error.message)
    }

    return Promise.reject(error)
  }
)

export const handleApiError = (error: unknown): string => {
  const err = error as {response?: {data: {message: string}; status: number}; request?: unknown; message?: string}
  if (err.response) {
    return err.response.data.message || `Error ${err.response.status}: Something went wrong`
  } else if (err.request) {
    return 'Network error. Please check your connection and try again.'
  } else {
    return err.message || 'An unexpected error occurred'
  }
}

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiRequestor.get('/')
    return true
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}

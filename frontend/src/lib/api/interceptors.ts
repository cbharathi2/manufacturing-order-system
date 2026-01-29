import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Add request timestamp
  config.headers['X-Request-Timestamp'] = Date.now().toString()
  
  // Add request ID for tracking
  config.headers['X-Request-ID'] = crypto.randomUUID()
  
  return config
}

export const responseInterceptor = (response: AxiosResponse) => {
  // Log response time
  const requestTimestamp = response.config.headers?.['X-Request-Timestamp']
  if (requestTimestamp) {
    const responseTime = Date.now() - parseInt(requestTimestamp)
    console.debug(`API call ${response.config.url} took ${responseTime}ms`)
  }
  
  return response
}

export const errorInterceptor = (error: any) => {
  // Handle specific error cases
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        console.error('Bad Request:', data)
        break
      case 401:
        console.error('Unauthorized - Please login again')
        break
      case 403:
        console.error('Forbidden - Insufficient permissions')
        break
      case 404:
        console.error('Resource not found')
        break
      case 422:
        console.error('Validation Error:', data)
        break
      case 429:
        console.error('Too many requests - Please try again later')
        break
      case 500:
        console.error('Server Error - Please contact support')
        break
      case 503:
        console.error('Service Unavailable - Please try again later')
        break
      default:
        console.error(`HTTP Error ${status}:`, data)
    }
  } else if (error.request) {
    console.error('Network Error - Please check your connection')
  } else {
    console.error('Request Error:', error.message)
  }
  
  return Promise.reject(error)
}
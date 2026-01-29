import { OrderStatus, UserRole } from '@/types'

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'quoted':
      return '#9c27b0' // Purple
    case 'confirmed':
      return '#2196f3' // Blue
    case 'engineering':
      return '#00bcd4' // Cyan
    case 'production':
      return '#ff9800' // Orange
    case 'fabrication':
      return '#ff5722' // Deep Orange
    case 'quality':
      return '#4caf50' // Green
    case 'ready_for_dispatch':
      return '#3f51b5' // Indigo
    case 'dispatched':
      return '#673ab7' // Deep Purple
    case 'completed':
      return '#009688' // Teal
    case 'cancelled':
      return '#f44336' // Red
    case 'on_hold':
      return '#607d8b' // Blue Grey
    default:
      return '#9e9e9e' // Grey
  }
}

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    quoted: 'Quoted',
    confirmed: 'Confirmed',
    engineering: 'Engineering',
    production: 'Production',
    fabrication: 'Fabrication',
    quality: 'Quality Inspection',
    ready_for_dispatch: 'Ready for Dispatch',
    dispatched: 'Dispatched',
    completed: 'Completed',
    cancelled: 'Cancelled',
    on_hold: 'On Hold',
  }
  return labels[status] || status
}

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return '#f44336' // Red
    case 'high':
      return '#ff9800' // Orange
    case 'medium':
      return '#ffc107' // Amber
    case 'low':
      return '#4caf50' // Green
    default:
      return '#9e9e9e' // Grey
  }
}

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    admin: 'Administrator',
    sales: 'Sales/CRM',
    engineering: 'Engineering',
    production: 'Production',
    quality: 'Quality/Inspection',
    logistics: 'Logistics',
    management: 'Management',
  }
  return labels[role] || role
}

export const getDepartmentColor = (department: string): string => {
  const colors: Record<string, string> = {
    'Sales': '#2196f3',
    'Engineering': '#00bcd4',
    'Production': '#ff9800',
    'Quality': '#4caf50',
    'Logistics': '#3f51b5',
    'Management': '#9c27b0',
    'Administration': '#607d8b',
  }
  return colors[department] || '#9e9e9e'
}

export const calculateYield = (ok: number, rework: number, rejection: number): number => {
  const total = ok + rework + rejection
  if (total === 0) return 0
  return ((ok + rework) / total) * 100
}

export const calculateOEE = (
  availableTime: number,
  operatingTime: number,
  idealCycleTime: number,
  totalPieces: number
): number => {
  if (availableTime === 0) return 0
  
  const availability = operatingTime / availableTime
  const performance = (idealCycleTime * totalPieces) / operatingTime
  const quality = 1 // Assuming all pieces are quality for now
  
  return (availability * performance * quality) * 100
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

export const generateOrderNumber = (prefix = 'WO'): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

export const parseJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export const createSearchParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()))
      } else {
        searchParams.append(key, value.toString())
      }
    }
  })
  
  return searchParams.toString()
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
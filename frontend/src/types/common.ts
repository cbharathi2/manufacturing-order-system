export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface OptionType {
  value: string | number
  label: string
  disabled?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface ApiError {
  detail?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface SelectOption {
  value: string | number
  label: string
  group?: string
}

export interface FilterParams {
  page?: number
  page_size?: number
  search?: string
  ordering?: string
  [key: string]: any
}

export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
}
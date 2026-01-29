export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  employee_id: string
  department: string
  role: UserRole
  phone?: string
  extension?: string
  date_joined: string
  last_login?: string
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean
}

export type UserRole = 
  | 'admin'
  | 'sales'
  | 'engineering'
  | 'production'
  | 'quality'
  | 'logistics'
  | 'management'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  employee_id: string
  department: string
  role: UserRole
  phone?: string
  extension?: string
}

export interface PasswordChangeData {
  old_password: string
  new_password: string
}
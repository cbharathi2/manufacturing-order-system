import { User } from './user'

export interface Customer {
  id: number
  code: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  payment_terms?: string
  credit_limit?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type OrderStatus = 
  | 'quoted'
  | 'confirmed'
  | 'engineering'
  | 'production'
  | 'fabrication'
  | 'quality'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'completed'
  | 'cancelled'
  | 'on_hold'

export type OrderPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Order {
  id: number
  quote_number: string
  purchase_order: string
  work_order_number: string
  invoice_number?: string
  grn_number?: string
  customer: Customer
  project_name: string
  order_date: string
  planned_start_date: string
  planned_completion_date: string
  actual_start_date?: string
  actual_completion_date?: string
  planned_lead_time: number
  actual_lead_time?: number
  status: OrderStatus
  status_percentage: number
  priority: OrderPriority
  total_value: number
  currency: string
  created_by: User
  assigned_to?: User
  remarks?: string
  internal_notes?: string
  created_at: string
  updated_at: string
  is_delayed?: boolean
  delay_days?: number
}

export interface OrderCreateData {
  quote_number: string
  purchase_order: string
  work_order_number: string
  customer_id: number
  project_name: string
  order_date: string
  planned_start_date: string
  planned_completion_date: string
  planned_lead_time: number
  priority: OrderPriority
  total_value: number
  currency: string
  remarks?: string
}

export interface OrderUpdateData extends Partial<OrderCreateData> {
  assigned_to?: number
  status?: OrderStatus
  actual_start_date?: string
  actual_completion_date?: string
}

export interface OrderFilters {
  status?: OrderStatus[]
  priority?: OrderPriority[]
  customer?: number[]
  created_by?: number[]
  assigned_to?: number[]
  search?: string
  date_from?: string
  date_to?: string
}

export interface OrderStatistics {
  total_orders: number
  in_production: number
  completed: number
  delayed: number
  ready_for_dispatch: number
  order_growth: number
  production_growth: number
  completion_rate: number
  delay_rate: number
  dispatch_rate: number
}

export interface OrderTimelineEntry {
  id: number
  order: number
  from_status: OrderStatus
  to_status: OrderStatus
  changed_by: User
  remarks?: string
  changed_at: string
}
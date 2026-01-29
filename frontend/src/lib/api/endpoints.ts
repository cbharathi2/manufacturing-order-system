import api from './axios'
import { 
  LoginCredentials, 
  RegisterData, 
  PasswordChangeData,
  OrderCreateData,
  OrderUpdateData,
  OrderFilters,
  DrawingUploadData,
  QualityInspection,
  FabricationStage
} from '@/types'

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post('/users/login/', credentials),
  logout: () => api.post('/users/logout/'),
  getCurrentUser: () => api.get('/users/me/'),
  changePassword: (data: PasswordChangeData) =>
    api.post('/users/change_password/', data),
  register: (data: RegisterData) => api.post('/users/', data),
}

export const customersAPI = {
  getCustomers: (params?: any) => api.get('/customers/', { params }),
  getCustomer: (id: string | number) => api.get(`/customers/${id}/`),
  createCustomer: (data: any) => api.post('/customers/', data),
  updateCustomer: (id: string | number, data: any) => api.patch(`/customers/${id}/`, data),
  deleteCustomer: (id: string | number) => api.delete(`/customers/${id}/`),
}

export const ordersAPI = {
  // Order management
  getOrders: (params?: OrderFilters) => api.get('/orders/', { params }),
  getOrder: (id: string | number) => api.get(`/orders/${id}/`),
  createOrder: (data: OrderCreateData) => api.post('/orders/', data),
  updateOrder: (id: string | number, data: OrderUpdateData) => api.patch(`/orders/${id}/`, data),
  deleteOrder: (id: string | number) => api.delete(`/orders/${id}/`),
  
  // Order status
  updateStatus: (id: string | number, status: string, remarks?: string) =>
    api.post(`/orders/${id}/update_status/`, { status, remarks }),
  
  // Order statistics
  getStatistics: () => api.get('/orders/statistics/'),
  getTimeline: (id: string | number) => api.get(`/orders/${id}/timeline/`),
  
  // Order actions
  assignOrder: (id: string | number, userId: number) =>
    api.post(`/orders/${id}/assign/`, { user_id: userId }),
  unassignOrder: (id: string | number) => api.post(`/orders/${id}/unassign/`),
}

export const productionAPI = {
  // Production tracking
  getProductionTracking: (orderId: string | number) =>
    api.get(`/production/tracking/${orderId}/`),
  updateProduction: (orderId: string | number, data: any) =>
    api.put(`/production/tracking/${orderId}/`, data),
  createProductionTracking: (orderId: string | number, data: any) =>
    api.post(`/production/tracking/`, { order_id: orderId, ...data }),
  
  // Fabrication stages
  getFabricationStages: (orderId: string | number) =>
    api.get(`/production/fabrication/${orderId}/`),
  updateFabricationStage: (stageId: string | number, data: Partial<FabricationStage>) =>
    api.patch(`/production/fabrication/stages/${stageId}/`, data),
  createFabricationStage: (data: any) =>
    api.post(`/production/fabrication/stages/`, data),
  
  // Materials
  getMaterials: (orderId: string | number) =>
    api.get(`/production/materials/${orderId}/`),
  createMaterial: (orderId: string | number, data: any) =>
    api.post(`/production/materials/`, { order_id: orderId, ...data }),
  updateMaterial: (materialId: string | number, data: any) =>
    api.patch(`/production/materials/${materialId}/`, data),
  issueMaterial: (materialId: string | number, data: any) =>
    api.post(`/production/materials/${materialId}/issue/`, data),
  
  // Production metrics
  getProductionMetrics: (params?: any) => api.get('/production/metrics/', { params }),
  getYieldData: (params?: any) => api.get('/production/yield-data/', { params }),
}

export const qualityAPI = {
  // Inspections
  getInspections: (orderId: string | number) =>
    api.get(`/quality/inspections/${orderId}/`),
  createInspection: (orderId: string | number, data: Partial<QualityInspection>) =>
    api.post(`/quality/inspections/${orderId}/`, data),
  updateInspection: (inspectionId: string | number, data: Partial<QualityInspection>) =>
    api.patch(`/quality/inspections/${inspectionId}/`, data),
  approveInspection: (inspectionId: string | number) =>
    api.post(`/quality/inspections/${inspectionId}/approve/`),
  
  // Quality metrics
  getQualityMetrics: (params?: any) => api.get('/quality/metrics/', { params }),
  getDefectAnalysis: (params?: any) => api.get('/quality/defect-analysis/', { params }),
  
  // Checklist
  getChecklist: (inspectionType: string) => api.get(`/quality/checklist/${inspectionType}/`),
}

export const engineeringAPI = {
  // Drawings
  getDrawings: (orderId: string | number) =>
    api.get(`/engineering/drawings/${orderId}/`),
  uploadDrawing: (data: DrawingUploadData) => {
    const formData = new FormData()
    formData.append('order_id', data.order_id.toString())
    formData.append('part_name', data.part_name)
    formData.append('file', data.file)
    if (data.version) {
      formData.append('version', data.version)
    }
    return api.post(`/engineering/drawings/upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteDrawing: (drawingId: string | number) =>
    api.delete(`/engineering/drawings/${drawingId}/`),
  downloadDrawing: (drawingId: string | number) =>
    api.get(`/engineering/drawings/${drawingId}/download/`, {
      responseType: 'blob',
    }),
  
  // Drawing management
  updateDrawing: (drawingId: string | number, data: any) =>
    api.patch(`/engineering/drawings/${drawingId}/`, data),
}

export const logisticsAPI = {
  // Dispatch
  getDispatchRecords: (orderId: string | number) =>
    api.get(`/logistics/dispatch/${orderId}/`),
  createDispatchRecord: (orderId: string | number, data: any) =>
    api.post(`/logistics/dispatch/${orderId}/`, data),
  updateDispatchRecord: (recordId: string | number, data: any) =>
    api.patch(`/logistics/dispatch/records/${recordId}/`, data),
  
  // Logistics metrics
  getLogisticsMetrics: (params?: any) => api.get('/logistics/metrics/', { params }),
}

export const dashboardAPI = {
  getKPIs: () => api.get('/dashboard/kpis/'),
  getOrderStatusSummary: () => api.get('/dashboard/order-status/'),
  getProductionYield: (params?: any) => api.get('/dashboard/production-yield/', { params }),
  getDelayedOrders: () => api.get('/dashboard/delayed-orders/'),
  getRecentActivities: () => api.get('/dashboard/recent-activities/'),
  getDepartmentPerformance: () => api.get('/dashboard/department-performance/'),
}

export const usersAPI = {
  getUsers: (params?: any) => api.get('/users/', { params }),
  getUser: (id: string | number) => api.get(`/users/${id}/`),
  createUser: (data: RegisterData) => api.post('/users/', data),
  updateUser: (id: string | number, data: any) => api.patch(`/users/${id}/`, data),
  deleteUser: (id: string | number) => api.delete(`/users/${id}/`),
  deactivateUser: (id: string | number) => api.post(`/users/${id}/deactivate/`),
  activateUser: (id: string | number) => api.post(`/users/${id}/activate/`),
}
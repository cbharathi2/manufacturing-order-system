export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders/create',
    DETAIL: (id: string | number) => `/orders/${id}`,
    EDIT: (id: string | number) => `/orders/${id}/edit`,
  },
  
  // Production
  PRODUCTION: {
    LIST: '/production',
    TRACKING: (id: string | number) => `/production/${id}`,
    DASHBOARD: '/production/dashboard',
    MATERIALS: '/production/materials',
  },
  
  // Engineering
  ENGINEERING: {
    LIST: '/engineering',
    DRAWINGS: '/engineering/drawings',
    LIBRARY: '/engineering/library',
  },
  
  // Quality
  QUALITY: {
    LIST: '/quality',
    INSPECTIONS: '/quality/inspections',
    REPORTS: '/quality/reports',
    CHECKLISTS: '/quality/checklists',
  },
  
  // Logistics
  LOGISTICS: {
    LIST: '/logistics',
    DISPATCH: '/logistics/dispatch',
    TRACKING: '/logistics/tracking',
    REPORTS: '/logistics/reports',
  },
  
  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers/create',
    DETAIL: (id: string | number) => `/customers/${id}`,
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    USER_CREATE: '/admin/users/create',
    USER_EDIT: (id: string | number) => `/admin/users/${id}/edit`,
    ROLES: '/admin/roles',
    SETTINGS: '/admin/settings',
    AUDIT_LOG: '/admin/audit-log',
    BACKUP: '/admin/backup',
  },
  
  // Reports
  REPORTS: {
    ORDERS: '/reports/orders',
    PRODUCTION: '/reports/production',
    QUALITY: '/reports/quality',
    FINANCIAL: '/reports/financial',
    CUSTOM: '/reports/custom',
  },
} as const

export const NAVIGATION = {
  DASHBOARD: {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    roles: ['admin', 'sales', 'engineering', 'production', 'quality', 'logistics', 'management'],
  },
  ORDERS: {
    label: 'Orders',
    path: ROUTES.ORDERS.LIST,
    icon: 'receipt_long',
    roles: ['admin', 'sales', 'management'],
    children: [
      { label: 'All Orders', path: ROUTES.ORDERS.LIST },
      { label: 'Create Order', path: ROUTES.ORDERS.CREATE },
    ],
  },
  PRODUCTION: {
    label: 'Production',
    path: ROUTES.PRODUCTION.LIST,
    icon: 'factory',
    roles: ['admin', 'production', 'management'],
    children: [
      { label: 'Production Tracking', path: ROUTES.PRODUCTION.LIST },
      { label: 'Production Dashboard', path: ROUTES.PRODUCTION.DASHBOARD },
      { label: 'Material Management', path: ROUTES.PRODUCTION.MATERIALS },
    ],
  },
  ENGINEERING: {
    label: 'Engineering',
    path: ROUTES.ENGINEERING.LIST,
    icon: 'engineering',
    roles: ['admin', 'engineering'],
    children: [
      { label: 'Drawing Management', path: ROUTES.ENGINEERING.DRAWINGS },
      { label: 'Drawing Library', path: ROUTES.ENGINEERING.LIBRARY },
    ],
  },
  QUALITY: {
    label: 'Quality',
    path: ROUTES.QUALITY.LIST,
    icon: 'verified',
    roles: ['admin', 'quality', 'management'],
    children: [
      { label: 'Inspections', path: ROUTES.QUALITY.INSPECTIONS },
      { label: 'Quality Reports', path: ROUTES.QUALITY.REPORTS },
      { label: 'Checklists', path: ROUTES.QUALITY.CHECKLISTS },
    ],
  },
  LOGISTICS: {
    label: 'Logistics',
    path: ROUTES.LOGISTICS.LIST,
    icon: 'local_shipping',
    roles: ['admin', 'logistics', 'management'],
    children: [
      { label: 'Dispatch Management', path: ROUTES.LOGISTICS.DISPATCH },
      { label: 'Shipment Tracking', path: ROUTES.LOGISTICS.TRACKING },
      { label: 'Logistics Reports', path: ROUTES.LOGISTICS.REPORTS },
    ],
  },
  CUSTOMERS: {
    label: 'Customers',
    path: ROUTES.CUSTOMERS.LIST,
    icon: 'groups',
    roles: ['admin', 'sales', 'management'],
  },
  REPORTS: {
    label: 'Reports',
    path: ROUTES.REPORTS.ORDERS,
    icon: 'assessment',
    roles: ['admin', 'management', 'sales'],
    children: [
      { label: 'Order Reports', path: ROUTES.REPORTS.ORDERS },
      { label: 'Production Reports', path: ROUTES.REPORTS.PRODUCTION },
      { label: 'Quality Reports', path: ROUTES.REPORTS.QUALITY },
      { label: 'Financial Reports', path: ROUTES.REPORTS.FINANCIAL },
    ],
  },
  ADMIN: {
    label: 'Admin',
    path: ROUTES.ADMIN.USERS,
    icon: 'admin_panel_settings',
    roles: ['admin'],
    children: [
      { label: 'User Management', path: ROUTES.ADMIN.USERS },
      { label: 'Role Management', path: ROUTES.ADMIN.ROLES },
      { label: 'Audit Log', path: ROUTES.ADMIN.AUDIT_LOG },
      { label: 'System Settings', path: ROUTES.ADMIN.SETTINGS },
      { label: 'Backup & Restore', path: ROUTES.ADMIN.BACKUP },
    ],
  },
} as const

export const getNavigationItems = (userRole: string) => {
  return Object.values(NAVIGATION).filter(item => 
    item.roles.includes(userRole)
  )
}

export const isActiveRoute = (currentPath: string, routePath: string) => {
  if (routePath === ROUTES.DASHBOARD) {
    return currentPath === routePath
  }
  return currentPath.startsWith(routePath)
}
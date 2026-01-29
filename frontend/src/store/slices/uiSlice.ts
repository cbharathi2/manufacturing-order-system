import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  themeMode: 'light' | 'dark'
  notifications: Notification[]
  activeModule: string | null
  breadcrumbs: Array<{ label: string; path?: string }>
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
  read: boolean
}

const initialState: UIState = {
  sidebarOpen: true,
  themeMode: 'light',
  notifications: [],
  activeModule: null,
  breadcrumbs: [{ label: 'Dashboard', path: '/dashboard' }],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.themeMode)
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload
      localStorage.setItem('theme', action.payload)
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
        ...action.payload,
      }
      state.notifications.unshift(notification)
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setActiveModule: (state, action: PayloadAction<string | null>) => {
      state.activeModule = action.payload
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path?: string }>>) => {
      state.breadcrumbs = action.payload
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; path?: string }>) => {
      state.breadcrumbs.push(action.payload)
    },
    removeLastBreadcrumb: (state) => {
      if (state.breadcrumbs.length > 1) {
        state.breadcrumbs.pop()
      }
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setActiveModule,
  setBreadcrumbs,
  addBreadcrumb,
  removeLastBreadcrumb,
} = uiSlice.actions

export default uiSlice.reducer
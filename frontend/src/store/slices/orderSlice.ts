import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ordersAPI } from '@/lib/api'
import { Order, OrderFilters, PaginatedResponse, OrderStatistics } from '@/types'

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  pagination: {
    count: number
    next: string | null
    previous: string | null
    page: number
    pageSize: number
  }
  filters: OrderFilters
  statistics: OrderStatistics | null
  isLoading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: 20,
  },
  filters: {},
  statistics: null,
  isLoading: false,
  error: null,
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: { page?: number; filters?: OrderFilters } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, filters = {} } = params
      const pageSize = 20
      
      const response = await ordersAPI.getOrders({
        page,
        page_size: pageSize,
        ...filters,
      })
      return {
        data: response.data,
        page,
        filters,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders')
    }
  }
)

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrder(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create order')
    }
  }
)

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateOrder(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update order')
    }
  }
)

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: string | number, { rejectWithValue }) => {
    try {
      await ordersAPI.deleteOrder(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete order')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status, remarks }: { id: string | number; status: string; remarks?: string }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateStatus(id, status, remarks)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update order status')
    }
  }
)

export const fetchOrderStatistics = createAsyncThunk(
  'orders/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getStatistics()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch statistics')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<OrderFilters>) => {
      state.filters = action.payload
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = {}
      state.pagination.page = 1
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.data.results
        state.pagination = {
          count: action.payload.data.count,
          next: action.payload.data.next,
          previous: action.payload.data.previous,
          page: action.payload.page,
          pageSize: 20,
        }
        state.filters = action.payload.filters
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch single order
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders.unshift(action.payload)
        state.currentOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.orders.findIndex(order => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Delete order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order.id !== action.payload)
        if (state.currentOrder?.id === action.payload) {
          state.currentOrder = null
        }
      })
      
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
      })
      
      // Fetch statistics
      .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload
      })
  },
})

export const { setFilters, clearFilters, clearCurrentOrder, clearError } = orderSlice.actions
export default orderSlice.reducer
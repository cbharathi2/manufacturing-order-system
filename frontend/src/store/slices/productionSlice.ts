import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { productionAPI } from '@/lib/api'
import { ProductionTracking, FabricationStage, MaterialDetail, ProductionMetrics, YieldData } from '@/types'

interface ProductionState {
  tracking: Record<number, ProductionTracking>
  stages: Record<number, FabricationStage[]>
  materials: Record<number, MaterialDetail[]>
  metrics: ProductionMetrics | null
  yieldData: YieldData[]
  isLoading: boolean
  error: string | null
}

const initialState: ProductionState = {
  tracking: {},
  stages: {},
  materials: {},
  metrics: null,
  yieldData: [],
  isLoading: false,
  error: null,
}

export const fetchProductionTracking = createAsyncThunk(
  'production/fetchTracking',
  async (orderId: string | number, { rejectWithValue }) => {
    try {
      const response = await productionAPI.getProductionTracking(orderId)
      return { orderId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch production tracking')
    }
  }
)

export const updateProductionTracking = createAsyncThunk(
  'production/updateTracking',
  async ({ orderId, data }: { orderId: string | number; data: any }, { rejectWithValue }) => {
    try {
      const response = await productionAPI.updateProduction(orderId, data)
      return { orderId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update production tracking')
    }
  }
)

export const fetchFabricationStages = createAsyncThunk(
  'production/fetchStages',
  async (orderId: string | number, { rejectWithValue }) => {
    try {
      const response = await productionAPI.getFabricationStages(orderId)
      return { orderId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch fabrication stages')
    }
  }
)

export const updateFabricationStage = createAsyncThunk(
  'production/updateStage',
  async ({ stageId, data }: { stageId: string | number; data: any }, { rejectWithValue }) => {
    try {
      const response = await productionAPI.updateFabricationStage(stageId, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update fabrication stage')
    }
  }
)

export const fetchMaterials = createAsyncThunk(
  'production/fetchMaterials',
  async (orderId: string | number, { rejectWithValue }) => {
    try {
      const response = await productionAPI.getMaterials(orderId)
      return { orderId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch materials')
    }
  }
)

export const fetchProductionMetrics = createAsyncThunk(
  'production/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productionAPI.getProductionMetrics()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch production metrics')
    }
  }
)

export const fetchYieldData = createAsyncThunk(
  'production/fetchYieldData',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await productionAPI.getYieldData(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch yield data')
    }
  }
)

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProductionData: (state) => {
      state.tracking = {}
      state.stages = {}
      state.materials = {}
      state.metrics = null
      state.yieldData = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch production tracking
      .addCase(fetchProductionTracking.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductionTracking.fulfilled, (state, action) => {
        state.isLoading = false
        state.tracking[action.payload.orderId] = action.payload.data
      })
      .addCase(fetchProductionTracking.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update production tracking
      .addCase(updateProductionTracking.fulfilled, (state, action) => {
        state.tracking[action.payload.orderId] = action.payload.data
      })
      
      // Fetch fabrication stages
      .addCase(fetchFabricationStages.fulfilled, (state, action) => {
        state.stages[action.payload.orderId] = action.payload.data
      })
      
      // Update fabrication stage
      .addCase(updateFabricationStage.fulfilled, (state, action) => {
        const stage = action.payload
        const orderId = stage.order_id
        if (state.stages[orderId]) {
          const index = state.stages[orderId].findIndex(s => s.id === stage.id)
          if (index !== -1) {
            state.stages[orderId][index] = stage
          }
        }
      })
      
      // Fetch materials
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.materials[action.payload.orderId] = action.payload.data
      })
      
      // Fetch production metrics
      .addCase(fetchProductionMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload
      })
      
      // Fetch yield data
      .addCase(fetchYieldData.fulfilled, (state, action) => {
        state.yieldData = action.payload
      })
  },
})

export const { clearError, clearProductionData } = productionSlice.actions
export default productionSlice.reducer
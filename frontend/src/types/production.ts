export type MaterialType = 
  | 'steel'
  | 'aluminum'
  | 'stainless'
  | 'copper'
  | 'brass'
  | 'plastic'
  | 'composite'

export interface MaterialDetail {
  id: number
  order_id: number
  material_type: MaterialType
  material_grade: string
  thickness: number
  length: number
  width: number
  required_quantity: number
  issued_quantity: number
  available_quantity: number
  issued_date?: string
  issued_by?: number
  created_at: string
  updated_at: string
}

export interface ProductionTracking {
  id: number
  order_id: number
  ok_quantity: number
  rework_quantity: number
  rejection_quantity: number
  ok_percentage: number
  rework_percentage: number
  rejection_percentage: number
  total_yield_percentage: number
  production_start_date?: string
  production_end_date?: string
  shift?: string
  machine_used?: string
  operator?: number
  first_pass_yield: number
  overall_equipment_effectiveness: number
  remarks?: string
  created_at: string
  updated_at: string
}

export type FabricationProcess = 
  | 'laser_2d'
  | 'laser_3d'
  | 'shearing'
  | 'bending'
  | 'stamping'
  | 'welding'
  | 'grinding'
  | 'buffing'
  | 'assembly'

export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold'

export interface FabricationStage {
  id: number
  order_id: number
  process: FabricationProcess
  sequence: number
  status: StageStatus
  quantity_processed: number
  quantity_target: number
  planned_start_date: string
  planned_end_date: string
  actual_start_date?: string
  actual_end_date?: string
  machine?: string
  operator?: number
  supervisor?: number
  defects_count: number
  rework_count: number
  remarks?: string
  created_at: string
  updated_at: string
}

export interface ProductionMetrics {
  total_orders: number
  active_orders: number
  average_yield: number
  average_oee: number
  total_rejection: number
  average_lead_time: number
}

export interface YieldData {
  date: string
  ok: number
  rework: number
  rejection: number
  yield: number
}
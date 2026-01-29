export type InspectionResult = 'pass' | 'fail' | 'rework'
export type InspectionType = 'line' | 'final' | 'pdi'

export interface QualityInspection {
  id: number
  order_id: number
  inspection_type: InspectionType
  inspector: number
  inspection_date: string
  result: InspectionResult
  defects_found?: string[]
  corrective_action?: string
  remarks?: string
  approved_by?: number
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface QualityMetrics {
  total_inspections: number
  pass_rate: number
  fail_rate: number
  rework_rate: number
  average_defects: number
  total_rework: number
}

export interface ChecklistItem {
  id: string
  description: string
  requirement: string
  result?: boolean
  remarks?: string
}
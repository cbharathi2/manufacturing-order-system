import { OrderStatus, StageStatus, InspectionResult } from '@/types'

export const ORDER_STATUSES: OrderStatus[] = [
  'quoted',
  'confirmed',
  'engineering',
  'production',
  'fabrication',
  'quality',
  'ready_for_dispatch',
  'dispatched',
  'completed',
  'cancelled',
  'on_hold',
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  quoted: 'Quoted',
  confirmed: 'Confirmed',
  engineering: 'Engineering',
  production: 'Production',
  fabrication: 'Fabrication',
  quality: 'Quality Inspection',
  ready_for_dispatch: 'Ready for Dispatch',
  dispatched: 'Dispatched',
  completed: 'Completed',
  cancelled: 'Cancelled',
  on_hold: 'On Hold',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  quoted: '#9c27b0',
  confirmed: '#2196f3',
  engineering: '#00bcd4',
  production: '#ff9800',
  fabrication: '#ff5722',
  quality: '#4caf50',
  ready_for_dispatch: '#3f51b5',
  dispatched: '#673ab7',
  completed: '#009688',
  cancelled: '#f44336',
  on_hold: '#607d8b',
}

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  quoted: 'description',
  confirmed: 'check_circle',
  engineering: 'engineering',
  production: 'build',
  fabrication: 'precision_manufacturing',
  quality: 'verified',
  ready_for_dispatch: 'inventory',
  dispatched: 'local_shipping',
  completed: 'done_all',
  cancelled: 'cancel',
  on_hold: 'pause_circle',
}

export const ORDER_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const

export const ORDER_PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const ORDER_PRIORITY_COLORS: Record<string, string> = {
  low: '#4caf50',
  medium: '#ffc107',
  high: '#ff9800',
  urgent: '#f44336',
}

export const STAGE_STATUSES: StageStatus[] = ['pending', 'in_progress', 'completed', 'on_hold']

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
}

export const STAGE_STATUS_COLORS: Record<StageStatus, string> = {
  pending: '#9e9e9e',
  in_progress: '#2196f3',
  completed: '#4caf50',
  on_hold: '#ff9800',
}

export const FABRICATION_PROCESSES = [
  'laser_2d',
  'laser_3d',
  'shearing',
  'bending',
  'stamping',
  'welding',
  'grinding',
  'buffing',
  'assembly',
] as const

export const FABRICATION_PROCESS_LABELS: Record<string, string> = {
  laser_2d: '2D Laser Cutting',
  laser_3d: '3D Laser Cutting',
  shearing: 'Shearing',
  bending: 'Bending',
  stamping: 'Stamping',
  welding: 'Welding',
  grinding: 'Grinding',
  buffing: 'Buffing',
  assembly: 'Assembly',
}

export const INSPECTION_TYPES = ['line', 'final', 'pdi'] as const

export const INSPECTION_TYPE_LABELS: Record<string, string> = {
  line: 'Line Inspection',
  final: 'Final QA',
  pdi: 'Pre-Dispatch Inspection',
}

export const INSPECTION_RESULTS: InspectionResult[] = ['pass', 'fail', 'rework']

export const INSPECTION_RESULT_LABELS: Record<InspectionResult, string> = {
  pass: 'Pass',
  fail: 'Fail',
  rework: 'Rework',
}

export const INSPECTION_RESULT_COLORS: Record<InspectionResult, string> = {
  pass: '#4caf50',
  fail: '#f44336',
  rework: '#ff9800',
}

export const MATERIAL_TYPES = [
  'steel',
  'aluminum',
  'stainless',
  'copper',
  'brass',
  'plastic',
  'composite',
] as const

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  steel: 'Steel',
  aluminum: 'Aluminum',
  stainless: 'Stainless Steel',
  copper: 'Copper',
  brass: 'Brass',
  plastic: 'Plastic',
  composite: 'Composite',
}

export const DRAWING_FILE_TYPES = [
  'pdf',
  'dxf',
  'dwg',
  'step',
  'igs',
  'jpg',
  'jpeg',
  'png',
  'svg',
] as const

export const DRAWING_FILE_TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF Document',
  dxf: 'DXF Drawing',
  dwg: 'DWG Drawing',
  step: 'STEP 3D Model',
  igs: 'IGS 3D Model',
  jpg: 'JPEG Image',
  jpeg: 'JPEG Image',
  png: 'PNG Image',
  svg: 'SVG Vector',
}

export const DRAWING_FILE_ICONS: Record<string, string> = {
  pdf: 'picture_as_pdf',
  dxf: 'architecture',
  dwg: 'architecture',
  step: 'view_in_ar',
  igs: 'view_in_ar',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  svg: 'animation',
}

export const DEPARTMENTS = [
  'Sales',
  'Engineering',
  'Production',
  'Quality',
  'Logistics',
  'Management',
  'Administration',
] as const

export const SHIFTS = ['Morning', 'Afternoon', 'Night', 'General'] as const

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'] as const

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
}
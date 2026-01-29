export type DrawingFileType = 
  | 'pdf'
  | 'dxf'
  | 'dwg'
  | 'step'
  | 'igs'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'svg'

export interface Drawing {
  id: number
  order_id: number
  part_name: string
  file_name: string
  file_path: string
  file_type: DrawingFileType
  version: string
  uploaded_by: number
  uploaded_at: string
  is_latest: boolean
  file_size?: number
  thumbnail_url?: string
}

export interface DrawingUploadData {
  order_id: number
  part_name: string
  file: File
  version?: string
}
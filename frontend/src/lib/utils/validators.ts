import * as yup from 'yup'

export const emailSchema = yup
  .string()
  .email('Invalid email format')
  .required('Email is required')
  .matches(
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    'Invalid email format'
  )

export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )

export const phoneSchema = yup
  .string()
  .matches(
    /^[\+]?[1-9][\d]{0,15}$/,
    'Invalid phone number format'
  )

export const orderSchema = yup.object({
  quote_number: yup.string().required('Quote number is required'),
  purchase_order: yup.string().required('Purchase order is required'),
  work_order_number: yup.string().required('Work order number is required'),
  customer_id: yup.number().required('Customer is required').positive('Invalid customer'),
  project_name: yup.string().required('Project name is required').max(200, 'Project name too long'),
  order_date: yup.date().required('Order date is required'),
  planned_start_date: yup
    .date()
    .required('Planned start date is required')
    .min(yup.ref('order_date'), 'Planned start date must be after order date'),
  planned_completion_date: yup
    .date()
    .required('Planned completion date is required')
    .min(yup.ref('planned_start_date'), 'Completion date must be after start date'),
  planned_lead_time: yup
    .number()
    .required('Planned lead time is required')
    .positive('Lead time must be positive')
    .integer('Lead time must be a whole number'),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high', 'urgent'], 'Invalid priority')
    .required('Priority is required'),
  total_value: yup
    .number()
    .required('Total value is required')
    .positive('Total value must be positive'),
  currency: yup.string().required('Currency is required').length(3, 'Currency must be 3 characters'),
  remarks: yup.string().max(1000, 'Remarks too long'),
})

export const customerSchema = yup.object({
  code: yup.string().required('Customer code is required').max(20, 'Code too long'),
  name: yup.string().required('Customer name is required').max(200, 'Name too long'),
  contact_person: yup.string().required('Contact person is required').max(100, 'Name too long'),
  email: emailSchema,
  phone: phoneSchema,
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  zip_code: yup.string().required('ZIP code is required'),
  payment_terms: yup.string().max(50, 'Payment terms too long'),
  credit_limit: yup.number().positive('Credit limit must be positive'),
})

export const userSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: yup.string().required('First name is required').max(30, 'First name too long'),
  last_name: yup.string().required('Last name is required').max(30, 'Last name too long'),
  employee_id: yup.string().required('Employee ID is required').max(20, 'Employee ID too long'),
  department: yup.string().required('Department is required').max(50, 'Department name too long'),
  role: yup
    .string()
    .oneOf(
      ['admin', 'sales', 'engineering', 'production', 'quality', 'logistics', 'management'],
      'Invalid role'
    )
    .required('Role is required'),
  phone: phoneSchema,
  extension: yup.string().max(10, 'Extension too long'),
})

export const loginSchema = yup.object({
  email: emailSchema,
  password: yup.string().required('Password is required'),
})

export const passwordChangeSchema = yup.object({
  old_password: yup.string().required('Current password is required'),
  new_password: passwordSchema,
  confirm_password: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('new_password')], 'Passwords must match'),
})

export const materialSchema = yup.object({
  material_type: yup
    .string()
    .oneOf(
      ['steel', 'aluminum', 'stainless', 'copper', 'brass', 'plastic', 'composite'],
      'Invalid material type'
    )
    .required('Material type is required'),
  material_grade: yup.string().required('Material grade is required').max(50, 'Grade too long'),
  thickness: yup
    .number()
    .required('Thickness is required')
    .positive('Thickness must be positive')
    .max(1000, 'Thickness too large'),
  length: yup
    .number()
    .required('Length is required')
    .positive('Length must be positive')
    .max(10000, 'Length too large'),
  width: yup
    .number()
    .required('Width is required')
    .positive('Width must be positive')
    .max(10000, 'Width too large'),
  required_quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number')
    .max(1000000, 'Quantity too large'),
})

export const productionSchema = yup.object({
  ok_quantity: yup
    .number()
    .required('OK quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number'),
  rework_quantity: yup
    .number()
    .required('Rework quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number'),
  rejection_quantity: yup
    .number()
    .required('Rejection quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number'),
  production_start_date: yup.date(),
  production_end_date: yup
    .date()
    .when('production_start_date', (startDate, schema) => {
      if (startDate) {
        return schema.min(startDate, 'End date must be after start date')
      }
      return schema
    }),
  shift: yup.string().max(20, 'Shift too long'),
  machine_used: yup.string().max(100, 'Machine name too long'),
  operator: yup.number().positive('Invalid operator'),
  remarks: yup.string().max(1000, 'Remarks too long'),
})

export const validateFile = (file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
  maxFiles?: number
} = {}) => {
  const { maxSize = 50 * 1024 * 1024, allowedTypes = [], maxFiles = 1 } = options
  const errors: string[] = []

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`)
  }

  if (allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const mimeType = file.type
    
    const isAllowed = allowedTypes.some(type => 
      type.startsWith('.') 
        ? fileExtension === type.substring(1)
        : mimeType.includes(type.replace('.', ''))
    )
    
    if (!isAllowed) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }
  }

  return errors
}
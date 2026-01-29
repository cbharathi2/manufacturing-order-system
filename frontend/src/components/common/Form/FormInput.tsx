import React from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import { Controller, Control, FieldError } from 'react-hook-form'

interface FormInputProps {
  name: string
  control: Control<any>
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  fullWidth?: boolean
  multiline?: boolean
  rows?: number
  minRows?: number
  maxRows?: number
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  size?: 'small' | 'medium'
  margin?: 'none' | 'dense' | 'normal'
  error?: FieldError
  helperText?: string
  variant?: 'outlined' | 'filled' | 'standard'
  InputProps?: any
  inputProps?: any
  sx?: any
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows,
  minRows,
  maxRows,
  startAdornment,
  endAdornment,
  clearable = false,
  onClear,
  size = 'medium',
  margin = 'normal',
  error,
  helperText,
  variant = 'outlined',
  InputProps,
  inputProps,
  sx,
}) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password'
    }
    return type
  }

  const getEndAdornment = () => {
    const adornments = []

    if (type === 'password') {
      adornments.push(
        <InputAdornment position="end" key="password-toggle">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            size="small"
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      )
    }

    if (clearable) {
      adornments.push(
        <InputAdornment position="end" key="clear">
          <IconButton
            aria-label="clear input"
            onClick={onClear}
            edge="end"
            size="small"
            sx={{ visibility: 'visible' }}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      )
    }

    if (endAdornment) {
      adornments.push(
        <InputAdornment position="end" key="custom-end">
          {endAdornment}
        </InputAdornment>
      )
    }

    return adornments.length > 0 ? adornments : null
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box sx={{ position: 'relative', ...sx }}>
          <TextField
            {...field}
            label={label}
            type={getInputType()}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={rows}
            minRows={minRows}
            maxRows={maxRows}
            size={size}
            margin={margin}
            error={!!fieldState.error || !!error}
            helperText={fieldState.error?.message || helperText}
            variant={variant}
            InputProps={{
              startAdornment: startAdornment ? (
                <InputAdornment position="start">{startAdornment}</InputAdornment>
              ) : null,
              endAdornment: getEndAdornment(),
              ...InputProps,
            }}
            inputProps={inputProps}
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e)
            }}
            onBlur={field.onBlur}
          />
        </Box>
      )}
    />
  )
}

export default FormInput
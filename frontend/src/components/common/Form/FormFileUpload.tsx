import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Paper,
  Alert,
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocumentIcon,
} from '@mui/icons-material'
import { formatFileSize } from '@/lib/utils/formatters'

export interface UploadedFile {
  file: File
  progress?: number
  error?: string
  uploaded?: boolean
  url?: string
  id?: string
}

interface FormFileUploadProps {
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  label?: string
  helperText?: string
  error?: boolean
  errorMessage?: string
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  onFileRemove?: (file: UploadedFile) => void
  showPreview?: boolean
  showProgress?: boolean
  sx?: any
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc', '.docx'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls', '.xlsx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  maxFiles = 10,
  multiple = false,
  disabled = false,
  label = 'Drag & drop files here or click to browse',
  helperText = `Maximum file size: ${maxSize / 1024 / 1024}MB`,
  error = false,
  errorMessage,
  files = [],
  onFilesChange,
  onFileRemove,
  showPreview = false,
  showProgress = false,
  sx,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (disabled) return

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const newFiles = rejectedFiles.map(({ file, errors }) => ({
          file,
          error: errors.map(e => e.message).join(', '),
        }))
        onFilesChange([...files, ...newFiles])
        return
      }

      // Check max files limit
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      // Add new files
      const newFiles = acceptedFiles.map(file => ({ file }))
      onFilesChange([...files, ...newFiles])
    },
    [files, maxFiles, onFilesChange, disabled]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled,
  })

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index]
    if (onFileRemove) {
      onFileRemove(fileToRemove)
    }
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onFilesChange(newFiles)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PdfIcon color="error" />
    if (fileType.includes('image')) return <ImageIcon color="primary" />
    if (fileType.includes('text') || fileType.includes('document')) 
      return <DocumentIcon color="action" />
    return <FileIcon color="action" />
  }

  const getFileStatusIcon = (file: UploadedFile) => {
    if (file.error) return <ErrorIcon color="error" />
    if (file.uploaded) return <CheckIcon color="success" />
    return null
  }

  return (
    <Box sx={sx}>
      {/* Dropzone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: error ? 'error.main' : isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: disabled ? 'grey.300' : 'primary.main',
            backgroundColor: disabled ? 'background.paper' : 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon
          sx={{
            fontSize: 48,
            color: error ? 'error.main' : isDragActive ? 'primary.main' : 'grey.400',
            mb: 2,
          }}
        />
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {helperText}
        </Typography>
        <Button
          variant="contained"
          disabled={disabled}
          sx={{ mt: 1 }}
        >
          Browse Files
        </Button>
      </Paper>

      {/* Error Message */}
      {error && errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files ({files.length}/{maxFiles})
          </Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: file.error ? 'error.light' : file.uploaded ? 'success.light' : 'background.paper',
                }}
              >
                <ListItemIcon>
                  {getFileIcon(file.file.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {file.file.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" component="div">
                        {formatFileSize(file.file.size)}
                      </Typography>
                      {file.error && (
                        <Typography variant="caption" color="error">
                          {file.error}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                {showProgress && file.progress !== undefined && (
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={file.progress}
                      color={file.error ? 'error' : file.uploaded ? 'success' : 'primary'}
                    />
                    <Typography variant="caption" align="center" display="block">
                      {file.progress}%
                    </Typography>
                  </Box>
                )}
                <ListItemSecondaryAction>
                  {getFileStatusIcon(file)}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveFile(index)}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* File Preview */}
      {showPreview && files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Preview
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {files.map((file, index) => {
              if (file.file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file.file)
                return (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={url}
                      alt={file.file.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                  </Box>
                )
              }
              return null
            })}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default FormFileUpload
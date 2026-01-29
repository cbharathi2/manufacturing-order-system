import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

export type ConfirmationType = 'delete' | 'warning' | 'info' | 'success'

interface ConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  message: string | React.ReactNode
  type?: ConfirmationType
  confirmText?: string
  cancelText?: string
  loading?: boolean
  disabled?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  hideCancelButton?: boolean
  destructive?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  maxWidth = 'sm',
  fullWidth = true,
  hideCancelButton = false,
  destructive = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <DeleteIcon color="error" sx={{ fontSize: 64 }} />
      case 'warning':
        return <WarningIcon color="warning" sx={{ fontSize: 64 }} />
      case 'success':
        return <SuccessIcon color="success" sx={{ fontSize: 64 }} />
      case 'info':
        return <InfoIcon color="info" sx={{ fontSize: 64 }} />
      default:
        return <WarningIcon color="warning" sx={{ fontSize: 64 }} />
    }
  }

  const getConfirmButtonColor = () => {
    if (destructive) return 'error'
    switch (type) {
      case 'delete':
        return 'error'
      case 'warning':
        return 'warning'
      case 'success':
        return 'success'
      case 'info':
        return 'info'
      default:
        return 'primary'
    }
  }

  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (error) {
      // Error handling is done by the parent component
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ position: 'relative', pr: 6 }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          {getIcon()}
          <DialogContentText sx={{ mt: 2, mb: 1 }}>
            {typeof message === 'string' ? (
              <Typography variant="body1" color="text.primary">
                {message}
              </Typography>
            ) : (
              message
            )}
          </DialogContentText>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!hideCancelButton && (
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          color={getConfirmButtonColor()}
          variant="contained"
          disabled={loading || disabled}
          sx={{ minWidth: 100 }}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationModal
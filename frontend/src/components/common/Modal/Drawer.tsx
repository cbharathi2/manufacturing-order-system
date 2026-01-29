import React from 'react'
import {
  Drawer as MuiDrawer,
  Box,
  IconButton,
  Typography,
  Divider,
  Toolbar,
  Paper,
} from '@mui/material'
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  anchor?: 'left' | 'right' | 'top' | 'bottom'
  width?: number | string
  height?: number | string
  persistent?: boolean
  showCloseButton?: boolean
  showHeader?: boolean
  elevation?: number
  PaperProps?: any
  sx?: any
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  width = 400,
  height = '100%',
  persistent = false,
  showCloseButton = true,
  showHeader = true,
  elevation = 16,
  PaperProps,
  sx,
}) => {
  const drawerWidth = typeof width === 'number' ? `${width}px` : width
  const drawerHeight = typeof height === 'number' ? `${height}px` : height

  const handleClose = () => {
    if (!persistent) {
      onClose()
    }
  }

  const isHorizontal = anchor === 'top' || anchor === 'bottom'

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: !isHorizontal ? drawerWidth : '100%',
          height: isHorizontal ? drawerHeight : '100%',
          maxWidth: '100%',
          ...PaperProps?.sx,
        },
        elevation,
        ...PaperProps,
      }}
      ModalProps={{
        disableEscapeKeyDown: persistent,
        ...(persistent && {
          BackdropProps: {
            invisible: true,
          },
        }),
      }}
      sx={sx}
    >
      {showHeader && (
        <>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 64,
              px: 2,
            }}
          >
            {title && (
              <Typography variant="h6" component="div" noWrap>
                {title}
              </Typography>
            )}
            {showCloseButton && (
              <IconButton onClick={onClose} size="small">
                {anchor === 'left' ? (
                  <ChevronLeftIcon />
                ) : anchor === 'right' ? (
                  <ChevronRightIcon />
                ) : (
                  <CloseIcon />
                )}
              </IconButton>
            )}
          </Toolbar>
          <Divider />
        </>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
        }}
      >
        {children}
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
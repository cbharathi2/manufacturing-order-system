import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, CssBaseline, Toolbar } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAppSelector } from '@/store/hooks'

const drawerWidth = 260

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        user={user}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
        }}
      >
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
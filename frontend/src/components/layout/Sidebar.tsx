import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Tooltip,
  Typography,
  Avatar,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ReceiptLong as OrdersIcon,
  Factory as ProductionIcon,
  Engineering as EngineeringIcon,
  Verified as QualityIcon,
  LocalShipping as LogisticsIcon,
  Groups as CustomersIcon,
  Assessment as ReportsIcon,
  AdminPanelSettings as AdminIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setSidebarOpen, setActiveModule } from '@/store/slices/uiSlice'
import { getNavigationItems } from '@/lib/constants/routes'
import { getRoleLabel } from '@/lib/utils/helpers'
import { User } from '@/types'

interface SidebarProps {
  mobileOpen: boolean
  onDrawerToggle: () => void
  user: User | null
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle, user }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})

  const drawerWidth = 260

  const handleItemClick = (path: string, module?: string) => {
    navigate(path)
    if (module) {
      dispatch(setActiveModule(module))
    }
    if (mobileOpen) {
      onDrawerToggle()
    }
  }

  const handleExpandClick = (itemKey: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }))
  }

  const navigationItems = user ? getNavigationItems(user.role) : []

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Info */}
      {user && (
        <>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {getRoleLabel(user.role)}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        {navigationItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0
          const isItemActive = isActive(item.path)
          const isExpanded = expandedItems[item.label] || false

          return (
            <React.Fragment key={item.label}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  selected={isItemActive}
                  onClick={() => {
                    if (hasChildren) {
                      handleExpandClick(item.label)
                    } else {
                      handleItemClick(item.path, item.label)
                    }
                  }}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isItemActive ? 'primary.main' : 'inherit',
                    }}
                  >
                    {(() => {
                      switch (item.icon) {
                        case 'dashboard': return <DashboardIcon />
                        case 'receipt_long': return <OrdersIcon />
                        case 'factory': return <ProductionIcon />
                        case 'engineering': return <EngineeringIcon />
                        case 'verified': return <QualityIcon />
                        case 'local_shipping': return <LogisticsIcon />
                        case 'groups': return <CustomersIcon />
                        case 'assessment': return <ReportsIcon />
                        case 'admin_panel_settings': return <AdminIcon />
                        default: return <DashboardIcon />
                      }
                    })()}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <>
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{
                          fontWeight: isItemActive ? 'bold' : 'normal',
                        }}
                      />
                      {hasChildren && (
                        isExpanded ? <ExpandLess /> : <ExpandMore />
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Children Items */}
              {hasChildren && sidebarOpen && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.label}
                        selected={isActive(child.path)}
                        onClick={() => handleItemClick(child.path, item.label)}
                        sx={{
                          pl: 4,
                          borderRadius: 1,
                          mb: 0.5,
                        }}
                      >
                        <ListItemText 
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: isActive(child.path) ? 'bold' : 'normal',
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          )
        })}
      </List>

      {/* Collapse Button */}
      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
        <ListItemButton
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
          sx={{ justifyContent: 'center' }}
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: sidebarOpen ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : 0,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open={sidebarOpen}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Sidebar
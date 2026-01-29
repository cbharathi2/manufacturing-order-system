import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  Edit as EditIcon,
  Print as PrintIcon,
  ArrowBack as BackIcon,
  Timeline as TimelineIcon,
  Engineering as EngineeringIcon,
  Build as BuildIcon,
  Verified as VerifiedIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { useQuery } from 'react-query'
import Loading from '@/components/common/Loading'
import { ordersAPI, productionAPI, engineeringAPI, qualityAPI } from '@/lib/api'
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  formatDate,
  formatCurrency,
  formatTimeAgo,
} from '@/lib/utils/helpers'
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/lib/constants/status'
import StatusTimeline from './StatusTimeline'

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusRemarks, setStatusRemarks] = useState('')

  const { data: order, isLoading: orderLoading } = useQuery(
    ['order', id],
    () => ordersAPI.getOrder(id!),
    { enabled: !!id }
  )

  const { data: production, isLoading: productionLoading } = useQuery(
    ['production', id],
    () => productionAPI.getProductionTracking(id!),
    { enabled: !!id }
  )

  const { data: drawings, isLoading: drawingsLoading } = useQuery(
    ['drawings', id],
    () => engineeringAPI.getDrawings(id!),
    { enabled: !!id }
  )

  const { data: inspections, isLoading: inspectionsLoading } = useQuery(
    ['inspections', id],
    () => qualityAPI.getInspections(id!),
    { enabled: !!id }
  )

  if (orderLoading) {
    return <Loading fullScreen />
  }

  if (!order) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Order not found
      </Alert>
    )
  }

  const statusSteps = ORDER_STATUSES.map((status) => ({
    label: ORDER_STATUS_LABELS[status],
    value: status,
  }))

  const currentStepIndex = statusSteps.findIndex(step => step.value === order.status)

  const handleStatusUpdate = async () => {
    try {
      await ordersAPI.updateStatus(order.id, selectedStatus, statusRemarks)
      // Refresh data
      // queryClient.invalidateQueries(['order', id])
      setStatusDialogOpen(false)
      setSelectedStatus('')
      setStatusRemarks('')
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Quote Number
                      </Typography>
                      <Typography variant="body1">{order.quote_number}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Purchase Order
                      </Typography>
                      <Typography variant="body1">{order.purchase_order}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Work Order
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {order.work_order_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Project Name
                      </Typography>
                      <Typography variant="body1">{order.project_name}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem button onClick={() => setActiveTab(1)}>
                      <ListItemIcon>
                        <BuildIcon />
                      </ListItemIcon>
                      <ListItemText primary="Update Production" />
                    </ListItem>
                    <ListItem button onClick={() => setActiveTab(2)}>
                      <ListItemIcon>
                        <EngineeringIcon />
                      </ListItemIcon>
                      <ListItemText primary="Upload Drawing" />
                    </ListItem>
                    <ListItem button onClick={() => setActiveTab(3)}>
                      <ListItemIcon>
                        <VerifiedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Quality Inspection" />
                    </ListItem>
                    <ListItem button onClick={() => setStatusDialogOpen(true)}>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Update Status" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status Timeline
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <StatusTimeline orderId={order.id} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      case 1: // Production
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Production Tracking
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {productionLoading ? (
                <Loading />
              ) : production ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h3" color="success.main">
                        {production.ok_percentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        OK Rate
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h3" color="warning.main">
                        {production.rework_percentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rework Rate
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h3" color="error.main">
                        {production.rejection_percentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rejection Rate
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  No production data available
                </Alert>
              )}
            </CardContent>
          </Card>
        )
      case 2: // Engineering
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engineering Drawings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {drawingsLoading ? (
                <Loading />
              ) : drawings && drawings.length > 0 ? (
                <List>
                  {drawings.map((drawing) => (
                    <ListItem key={drawing.id}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={drawing.part_name}
                        secondary={`Version: ${drawing.version} • Uploaded: ${formatTimeAgo(drawing.uploaded_at)}`}
                      />
                      <Button size="small">View</Button>
                      <Button size="small" color="error">Delete</Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No drawings uploaded yet
                </Alert>
              )}
            </CardContent>
          </Card>
        )
      case 3: // Quality
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quality Inspections
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {inspectionsLoading ? (
                <Loading />
              ) : inspections && inspections.length > 0 ? (
                <List>
                  {inspections.map((inspection) => (
                    <ListItem key={inspection.id}>
                      <ListItemIcon>
                        {inspection.result === 'pass' ? (
                          <CheckIcon color="success" />
                        ) : inspection.result === 'fail' ? (
                          <ErrorIcon color="error" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${inspection.inspection_type} Inspection`}
                        secondary={`Result: ${inspection.result} • Date: ${formatDate(inspection.inspection_date)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No inspections conducted yet
                </Alert>
              )}
            </CardContent>
          </Card>
        )
      case 4: // Customer
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">{order.customer.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">{order.customer.contact_person}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      {order.customer.email}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" />
                      {order.customer.phone}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" />
                      {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip_code}, {order.customer.country}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/orders')} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {order.work_order_number}
            <Chip
              label={getStatusLabel(order.status)}
              size="small"
              sx={{
                ml: 2,
                backgroundColor: getStatusColor(order.status) + '20',
                color: getStatusColor(order.status),
                fontWeight: 'bold',
              }}
            />
          </Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/orders/${order.id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button startIcon={<PrintIcon />} variant="outlined">
            Print
          </Button>
        </Box>

        {/* Project Info */}
        <Typography variant="h6" color="text.secondary">
          {order.project_name} • {order.customer.name}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={order.status_percentage}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {order.status_percentage.toFixed(1)}% Complete
            </Typography>
            {order.is_delayed && (
              <Typography variant="body2" color="error">
                Delayed by {order.delay_days} days
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Status Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStepIndex} alternativeLabel>
          {statusSteps.map((step) => (
            <Step key={step.value}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Production" />
          <Tab label="Engineering" />
          <Tab label="Quality" />
          <Tab label="Customer" />
          <Tab label="Financial" />
          <Tab label="Documents" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Status: {getStatusLabel(order.status)}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="New Status"
              >
                {statusSteps
                  .filter(step => step.value !== order.status)
                  .map((step) => (
                    <MenuItem key={step.value} value={step.value}>
                      {step.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks (Optional)"
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={!selectedStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderDetail
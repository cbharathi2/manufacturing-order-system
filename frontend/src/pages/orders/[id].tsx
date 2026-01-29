import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material'
import {
  Edit,
  Print,
  ArrowBack,
  Timeline,
  Engineering,
  ProductionQuantityLimits,
  CheckCircle,
  LocalShipping,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { ordersAPI, productionAPI, engineeringAPI, qualityAPI } from '@/lib/api'
import OrderForm from '@/components/orders/OrderForm'
import StatusTimeline from '@/components/orders/StatusTimeline'
import ProductionCard from '@/components/production/ProductionCard'
import DrawingUpload from '@/components/engineering/DrawingUpload'
import { useAuth } from '@/hooks/useAuth'
import { OrderStatus } from '@/types/order'

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState(0)
  const [editMode, setEditMode] = useState(false)
  
  // Fetch order data
  const { data: order, isLoading } = useQuery(
    ['order', id],
    () => ordersAPI.getOrder(id!),
    { enabled: !!id }
  )
  
  // Fetch production data
  const { data: production } = useQuery(
    ['production', id],
    () => productionAPI.getProductionTracking(id!),
    { enabled: !!id }
  )
  
  // Fetch drawings
  const { data: drawings } = useQuery(
    ['drawings', id],
    () => engineeringAPI.getDrawings(id!),
    { enabled: !!id }
  )
  
  // Update order status mutation
  const updateStatusMutation = useMutation(
    (status: OrderStatus) => ordersAPI.updateStatus(id!, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', id])
      },
    }
  )
  
  if (isLoading) {
    return <LinearProgress />
  }
  
  if (!order) {
    return (
      <Container>
        <Alert severity="error">Order not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Container>
    )
  }
  
  const statusSteps = [
    { label: 'Quoted', icon: <Timeline /> },
    { label: 'Confirmed', icon: <Timeline /> },
    { label: 'Engineering', icon: <Engineering /> },
    { label: 'Production', icon: <ProductionQuantityLimits /> },
    { label: 'Quality', icon: <CheckCircle /> },
    { label: 'Dispatch', icon: <LocalShipping /> },
  ]
  
  const currentStep = statusSteps.findIndex(step => 
    step.label.toLowerCase() === order.status.toLowerCase()
  )
  
  const handleStatusUpdate = (newStatus: OrderStatus) => {
    if (window.confirm(`Change order status to ${newStatus}?`)) {
      updateStatusMutation.mutate(newStatus)
    }
  }
  
  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
            sx={{ mb: 1 }}
          >
            Back to Orders
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            {order.work_order_number}
            <Chip
              label={order.status}
              color={
                order.status === 'delayed' ? 'error' :
                order.status === 'completed' ? 'success' : 'primary'
              }
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {order.project_name} • {order.customer.name}
          </Typography>
        </Box>
        
        <Box>
          {user?.can_create_orders && (
            <Button
              startIcon={<Edit />}
              onClick={() => setEditMode(!editMode)}
              sx={{ mr: 1 }}
            >
              {editMode ? 'Cancel Edit' : 'Edit Order'}
            </Button>
          )}
          <Button startIcon={<Print />} variant="outlined">
            Print
          </Button>
        </Box>
      </Box>
      
      {/* Status Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {statusSteps.map((step) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Status Progress */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Order Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={order.status_percentage}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">
              {order.status_percentage}% Complete
            </Typography>
            {order.is_delayed && (
              <Typography variant="body2" color="error">
                Delayed by {order.delay_days} days
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Order Details" />
          <Tab label="Production" />
          <Tab label="Engineering" />
          <Tab label="Quality" />
          <Tab label="Logistics" />
          <Tab label="Timeline" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={editMode ? 12 : 8}>
            {editMode ? (
              <OrderForm
                order={order}
                onSuccess={() => {
                  setEditMode(false)
                  queryClient.invalidateQueries(['order', id])
                }}
                onCancel={() => setEditMode(false)}
              />
            ) : (
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Customer Details */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Customer Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography><strong>Name:</strong> {order.customer.name}</Typography>
                        <Typography><strong>Contact:</strong> {order.customer.contact_person}</Typography>
                        <Typography><strong>Email:</strong> {order.customer.email}</Typography>
                        <Typography><strong>Phone:</strong> {order.customer.phone}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Order Details */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Order Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography><strong>Quote #:</strong></Typography>
                            <Typography><strong>PO #:</strong></Typography>
                            <Typography><strong>Order Date:</strong></Typography>
                            <Typography><strong>Priority:</strong></Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography>{order.quote_number}</Typography>
                            <Typography>{order.purchase_order}</Typography>
                            <Typography>
                              {new Date(order.order_date).toLocaleDateString()}
                            </Typography>
                            <Typography>
                              <Chip
                                label={order.priority}
                                size="small"
                                color={
                                  order.priority === 'urgent' ? 'error' :
                                  order.priority === 'high' ? 'warning' :
                                  order.priority === 'medium' ? 'info' : 'default'
                                }
                              />
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Timeline Card */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Timeline
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <StatusTimeline orderId={id!} />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
          
          {!editMode && (
            <Grid item xs={12} md={4}>
              {/* Quick Actions */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {order.status === 'confirmed' && user?.role === 'engineering' && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleStatusUpdate('engineering')}
                      >
                        Start Engineering
                      </Button>
                    </Grid>
                  )}
                  
                  {order.status === 'engineering' && user?.role === 'production' && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleStatusUpdate('production')}
                      >
                        Start Production
                      </Button>
                    </Grid>
                  )}
                  
                  {order.status === 'production' && user?.role === 'quality' && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleStatusUpdate('quality')}
                      >
                        Quality Inspection
                      </Button>
                    </Grid>
                  )}
                  
                  {order.status === 'quality' && user?.role === 'logistics' && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleStatusUpdate('ready_for_dispatch')}
                      >
                        Ready for Dispatch
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Paper>
              
              {/* Order Summary */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Planned Lead Time:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {order.planned_lead_time} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2">Actual Lead Time:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {order.actual_lead_time || 'In progress'} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2">Total Value:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {order.currency} {order.total_value.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2">Created By:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {order.created_by.first_name} {order.created_by.last_name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2">Assigned To:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {order.assigned_to 
                        ? `${order.assigned_to.first_name} ${order.assigned_to.last_name}`
                        : 'Unassigned'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
      
      {activeTab === 1 && production && (
        <ProductionCard orderId={id!} production={production} />
      )}
      
      {activeTab === 2 && (
        <DrawingUpload orderId={id!} drawings={drawings || []} />
      )}
      
      {activeTab === 5 && (
        <Paper sx={{ p: 3 }}>
          <StatusTimeline orderId={id!} detailed />
        </Paper>
      )}
    </Container>
  )
}

export default OrderDetail
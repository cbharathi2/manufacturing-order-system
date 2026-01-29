import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material'
import {
  Timeline,
  CheckCircle,
  Error,
  LocalShipping,
  TrendingUp,
} from '@mui/icons-material'
import { useQuery } from 'react-query'
import { dashboardAPI } from '@/lib/api'

const KPIcards: React.FC = () => {
  const { data: kpis, isLoading } = useQuery('dashboard-kpis', () =>
    dashboardAPI.getKPIs()
  )
  
  if (isLoading) {
    return <LinearProgress />
  }
  
  const cards = [
    {
      title: 'Total Orders',
      value: kpis?.total_orders || 0,
      icon: <Timeline color="primary" />,
      color: '#1976d2',
      change: kpis?.order_growth || 0,
    },
    {
      title: 'In Production',
      value: kpis?.in_production || 0,
      icon: <TrendingUp color="success" />,
      color: '#2e7d32',
      change: kpis?.production_growth || 0,
    },
    {
      title: 'Completed',
      value: kpis?.completed || 0,
      icon: <CheckCircle color="action" />,
      color: '#757575',
      change: kpis?.completion_rate || 0,
    },
    {
      title: 'Delayed',
      value: kpis?.delayed || 0,
      icon: <Error color="error" />,
      color: '#d32f2f',
      change: kpis?.delay_rate || 0,
    },
    {
      title: 'Ready for Dispatch',
      value: kpis?.ready_for_dispatch || 0,
      icon: <LocalShipping color="warning" />,
      color: '#ed6c02',
      change: kpis?.dispatch_rate || 0,
    },
  ]
  
  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: `${card.color}15`,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: card.color, fontWeight: 'bold' }}
                >
                  {card.change > 0 ? '+' : ''}
                  {card.change}%
                </Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default KPIcards
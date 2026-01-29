import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material'
import { useDebounce } from '@/hooks/useDebounce'
import DataTable, { Column, Action } from '@/components/common/Table/DataTable'
import TableActions from '@/components/common/Table/TableActions'
import Loading from '@/components/common/Loading'
import ConfirmationModal from '@/components/common/Modal/ConfirmationModal'
import { useOrders } from '@/hooks/useOrders'
import { Order, OrderStatus, OrderPriority } from '@/types'
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  formatDate,
  formatCurrency,
} from '@/lib/utils/helpers'
import { ORDER_STATUSES, ORDER_PRIORITY_LABELS } from '@/lib/constants/status'

const OrderList: React.FC = () => {
  const navigate = useNavigate()
  const {
    orders,
    pagination,
    filters,
    isLoading,
    selectedOrders,
    loadOrders,
    addOrder,
    removeOrder,
    applyFilters,
    resetFilters,
    selectAllOrders,
    deselectAllOrders,
    getSelectedOrders,
  } = useOrders()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const columns: Column<Order>[] = useMemo(
    () => [
      {
        id: 'work_order_number',
        label: 'Work Order',
        minWidth: 150,
        sortable: true,
        format: (value, row) => (
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.quote_number}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'project_name',
        label: 'Project',
        minWidth: 200,
        sortable: true,
      },
      {
        id: 'customer',
        label: 'Customer',
        minWidth: 180,
        format: (value) => value.name,
      },
      {
        id: 'status',
        label: 'Status',
        minWidth: 150,
        align: 'center',
        format: (value: OrderStatus) => (
          <Chip
            label={getStatusLabel(value)}
            size="small"
            sx={{
              backgroundColor: getStatusColor(value) + '20',
              color: getStatusColor(value),
              fontWeight: 'bold',
            }}
          />
        ),
      },
      {
        id: 'priority',
        label: 'Priority',
        minWidth: 100,
        align: 'center',
        format: (value: OrderPriority) => (
          <Chip
            label={ORDER_PRIORITY_LABELS[value]}
            size="small"
            sx={{
              backgroundColor: getPriorityColor(value) + '20',
              color: getPriorityColor(value),
              fontWeight: 'bold',
            }}
          />
        ),
      },
      {
        id: 'planned_completion_date',
        label: 'Due Date',
        minWidth: 120,
        format: (value) => formatDate(value),
      },
      {
        id: 'total_value',
        label: 'Value',
        minWidth: 120,
        align: 'right',
        format: (value, row) => formatCurrency(value, row.currency),
      },
      {
        id: 'status_percentage',
        label: 'Progress',
        minWidth: 150,
        format: (value) => (
          <Box>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {value.toFixed(1)}%
            </Typography>
          </Box>
        ),
      },
      {
        id: 'created_at',
        label: 'Created',
        minWidth: 120,
        format: (value) => formatDate(value),
      },
    ],
    []
  )

  const actions: Action<Order>[] = useMemo(
    () => [
      {
        icon: <ViewIcon fontSize="small" />,
        tooltip: 'View Order',
        onClick: (row) => navigate(`/orders/${row.id}`),
        color: 'info',
      },
      {
        icon: <EditIcon fontSize="small" />,
        tooltip: 'Edit Order',
        onClick: (row) => navigate(`/orders/${row.id}/edit`),
        color: 'primary',
      },
      {
        icon: <DeleteIcon fontSize="small" />,
        tooltip: 'Delete Order',
        onClick: (row) => {
          setOrderToDelete(row)
          setDeleteModalOpen(true)
        },
        color: 'error',
      },
    ],
    [navigate]
  )

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters({ ...filters, search: term })
  }

  const handleStatusFilter = (statuses: OrderStatus[]) => {
    applyFilters({ ...filters, status: statuses })
  }

  const handlePriorityFilter = (priorities: OrderPriority[]) => {
    applyFilters({ ...filters, priority: priorities })
  }

  const handleClearFilters = () => {
    resetFilters()
    setSearchTerm('')
  }

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      await removeOrder(orderToDelete.id)
      setDeleteModalOpen(false)
      setOrderToDelete(null)
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export selected orders:', getSelectedOrders())
  }

  const handleRefresh = () => {
    loadOrders(pagination.page, filters)
  }

  const selectedCount = selectedOrders.length

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Orders
          </Typography>
          <TableActions
            onAdd={() => navigate('/orders/create')}
            onDelete={() => {
              if (selectedCount === 1) {
                const order = orders.find(o => o.id === selectedOrders[0])
                if (order) {
                  setOrderToDelete(order)
                  setDeleteModalOpen(true)
                }
              }
            }}
            onExport={handleExport}
            onRefresh={handleRefresh}
            onFilter={() => setFilterAnchorEl(document.getElementById('filter-button'))}
            showAdd
            showDelete={selectedCount > 0}
            showExport
            showRefresh
            showFilter
            selectedCount={selectedCount}
            addLabel="New Order"
            deleteLabel={`Delete (${selectedCount})`}
          />
        </Box>

        {/* Search and Filters */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {filters.status && filters.status.length > 0 && (
                <Chip
                  label={`Status: ${filters.status.length}`}
                  onDelete={() => handleStatusFilter([])}
                  size="small"
                />
              )}
              {filters.priority && filters.priority.length > 0 && (
                <Chip
                  label={`Priority: ${filters.priority.length}`}
                  onDelete={() => handlePriorityFilter([])}
                  size="small"
                />
              )}
              {(filters.status?.length > 0 || filters.priority?.length > 0) && (
                <Chip
                  label="Clear All"
                  onClick={handleClearFilters}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Data Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={orders}
          loading={isLoading}
          pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalRows={pagination.count}
          onPageChange={(page) => loadOrders(page, filters)}
          onPageSizeChange={(pageSize) => console.log('Page size:', pageSize)}
          selection
          selectedRows={orders.filter(order => selectedOrders.includes(order.id))}
          onSelectionChange={(selected) => {
            if (selected.length === 0) {
              deselectAllOrders()
            } else if (selected.length === orders.length) {
              selectAllOrders()
            }
          }}
          actions={actions}
          onRowClick={(row) => navigate(`/orders/${row.id}`)}
          searchable={false}
          emptyMessage="No orders found"
          rowKey="id"
        />
      </Paper>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Filter by Status
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.status || []}
            onChange={(e) => handleStatusFilter(e.target.value as OrderStatus[])}
            renderValue={(selected) => `${selected.length} selected`}
          >
            {ORDER_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                <Checkbox checked={(filters.status || []).includes(status)} />
                <ListItemText primary={getStatusLabel(status)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle2" gutterBottom>
          Filter by Priority
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            multiple
            value={filters.priority || []}
            onChange={(e) => handlePriorityFilter(e.target.value as OrderPriority[])}
            renderValue={(selected) => `${selected.length} selected`}
          >
            {Object.entries(ORDER_PRIORITY_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                <Checkbox checked={(filters.priority || []).includes(value as any)} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Menu>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        message={
          orderToDelete && (
            <Typography>
              Are you sure you want to delete order{' '}
              <strong>{orderToDelete.work_order_number}</strong>?
              <br />
              This action cannot be undone.
            </Typography>
          )
        }
        type="delete"
        confirmText="Delete"
        destructive
      />
    </Box>
  )
}

export default OrderList
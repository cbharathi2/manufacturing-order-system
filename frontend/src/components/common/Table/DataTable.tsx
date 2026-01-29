import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  TablePagination,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material'
import Loading from '../Loading'

export interface Column<T> {
  id: keyof T
  label: string
  align?: 'left' | 'right' | 'center'
  minWidth?: number
  format?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}

export interface Action<T> {
  icon: React.ReactNode
  tooltip: string
  onClick: (row: T) => void
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  hidden?: (row: T) => boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: boolean
  page?: number
  pageSize?: number
  totalRows?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  selection?: boolean
  selectedRows?: T[]
  onSelectionChange?: (selected: T[]) => void
  actions?: Action<T>[]
  onRowClick?: (row: T) => void
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void
  searchable?: boolean
  onSearch?: (searchTerm: string) => void
  searchPlaceholder?: string
  emptyMessage?: string
  rowKey?: keyof T | ((row: T) => string | number)
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination = false,
  page = 0,
  pageSize = 10,
  totalRows = 0,
  onPageChange,
  onPageSizeChange,
  selection = false,
  selectedRows = [],
  onSelectionChange,
  actions = [],
  onRowClick,
  sortBy,
  sortDirection = 'asc',
  onSort,
  searchable = false,
  onSearch,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  rowKey = 'id',
}: DataTableProps<T>) => {
  const [selected, setSelected] = useState<Set<string | number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = new Set(data.map(row => getRowId(row)))
      setSelected(newSelected)
      onSelectionChange?.(data.filter(row => newSelected.has(getRowId(row))))
    } else {
      setSelected(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (event: React.MouseEvent, row: T) => {
    event.stopPropagation()
    const rowId = getRowId(row)
    const newSelected = new Set(selected)
    
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId)
    } else {
      newSelected.add(rowId)
    }
    
    setSelected(newSelected)
    onSelectionChange?.(data.filter(row => newSelected.has(getRowId(row))))
  }

  const handleSort = (columnId: keyof T) => {
    if (!onSort) return
    
    const isAsc = sortBy === columnId && sortDirection === 'asc'
    const newDirection = isAsc ? 'desc' : 'asc'
    onSort(columnId, newDirection)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    onSearch?.(value)
  }

  const getRowId = (row: T): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row)
    }
    return row[rowKey]
  }

  const isSelected = (row: T) => selected.has(getRowId(row))

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row)
    }
  }

  const handlePageChange = (_event: unknown, newPage: number) => {
    onPageChange?.(newPage + 1)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10)
    onPageSizeChange?.(newPageSize)
    onPageChange?.(1)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Search Bar */}
      {searchable && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>
      )}

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {/* Selection Checkbox */}
              {selection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.size > 0 && selected.size < data.length
                    }
                    checked={data.length > 0 && selected.size === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {/* Columns */}
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={sortBy === column.id ? sortDirection : false}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {/* Actions Column */}
              {actions.length > 0 && (
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selection ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row)
                const isItemSelected = isSelected(row)

                return (
                  <TableRow
                    hover
                    key={rowId}
                    selected={isItemSelected}
                    onClick={() => handleRowClick(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {/* Selection Checkbox */}
                    {selection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) => handleSelectRow(event, row)}
                        />
                      </TableCell>
                    )}

                    {/* Data Cells */}
                    {columns.map((column) => (
                      <TableCell key={column.id as string} align={column.align || 'left'}>
                        {column.format
                          ? column.format(row[column.id], row)
                          : row[column.id]}
                      </TableCell>
                    ))}

                    {/* Action Cells */}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          {actions.map((action, index) => {
                            if (action.hidden && action.hidden(row)) {
                              return null
                            }
                            return (
                              <Tooltip key={index} title={action.tooltip}>
                                <IconButton
                                  size="small"
                                  color={action.color || 'primary'}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    action.onClick(row)
                                  }}
                                >
                                  {action.icon}
                                </IconButton>
                              </Tooltip>
                            )
                          })}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalRows}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </Paper>
  )
}

export default DataTable
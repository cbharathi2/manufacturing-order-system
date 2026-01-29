import React from 'react'
import {
  TablePagination as MuiTablePagination,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material'

interface PaginationProps {
  count: number
  page: number
  rowsPerPage: number
  rowsPerPageOptions?: number[]
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  label?: string
  showFirstLastButtons?: boolean
  showRowsPerPage?: boolean
  showTotal?: boolean
  disabled?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 25, 50],
  onPageChange,
  onRowsPerPageChange,
  label = 'Rows per page:',
  showFirstLastButtons = true,
  showRowsPerPage = true,
  showTotal = true,
  disabled = false,
}) => {
  const handleFirstPageButtonClick = () => {
    onPageChange(0)
  }

  const handleBackButtonClick = () => {
    onPageChange(page - 1)
  }

  const handleNextButtonClick = () => {
    onPageChange(page + 1)
  }

  const handleLastPageButtonClick = () => {
    const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    onPageChange(lastPage)
  }

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    onRowsPerPageChange(newRowsPerPage)
    onPageChange(0) // Reset to first page
  }

  if (count === 0) {
    return null
  }

  const from = page * rowsPerPage + 1
  const to = Math.min((page + 1) * rowsPerPage, count)
  const totalPages = Math.ceil(count / rowsPerPage)

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      p: 1,
      borderTop: 1,
      borderColor: 'divider',
    }}>
      {/* Left side - Rows per page */}
      {showRowsPerPage && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            disabled={disabled}
            sx={{ minWidth: 80 }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      {/* Center - Page navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showFirstLastButtons && (
          <Tooltip title="First page">
            <span>
              <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={disabled || page === 0}
                size="small"
              >
                <FirstPageIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}

        <Tooltip title="Previous page">
          <span>
            <IconButton
              onClick={handleBackButtonClick}
              disabled={disabled || page === 0}
              size="small"
            >
              <KeyboardArrowLeft />
            </IconButton>
          </span>
        </Tooltip>

        <Typography variant="body2" color="text.secondary">
          {from}-{to} of {count}
        </Typography>

        <Tooltip title="Next page">
          <span>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={disabled || page >= totalPages - 1}
              size="small"
            >
              <KeyboardArrowRight />
            </IconButton>
          </span>
        </Tooltip>

        {showFirstLastButtons && (
          <Tooltip title="Last page">
            <span>
              <IconButton
                onClick={handleLastPageButtonClick}
                disabled={disabled || page >= totalPages - 1}
                size="small"
              >
                <LastPageIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>

      {/* Right side - Page info */}
      {showTotal && (
        <Typography variant="body2" color="text.secondary">
          Page {page + 1} of {totalPages}
        </Typography>
      )}
    </Box>
  )
}

export default Pagination
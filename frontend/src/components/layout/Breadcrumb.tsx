import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Box,
} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { useAppSelector } from '@/store/hooks'

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const { breadcrumbs } = useAppSelector((state) => state.ui)

  const pathnames = location.pathname.split('/').filter((x) => x)

  if (breadcrumbs.length > 1) {
    return (
      <Box sx={{ mb: 2 }}>
        <MuiBreadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1

            return isLast ? (
              <Typography key={crumb.label} color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.label}
                to={crumb.path || '#'}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {crumb.label}
              </Link>
            )
          })}
        </MuiBreadcrumbs>
      </Box>
    )
  }

  return null
}

export default Breadcrumb
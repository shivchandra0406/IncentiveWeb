import React from 'react';
import {
  Typography,
  Box,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import UsersTable from '../components/Users/UsersTable';

const Users: React.FC = () => {
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">User Management</Typography>
      </Breadcrumbs>

      {/* Page Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Manage users, roles, and permissions. You can create, edit, and delete users, as well as assign roles and reset passwords.
      </Typography>

      {/* Users Table */}
      <UsersTable />
    </Box>
  );
};

export default Users;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import roleService from '../../infrastructure/roles/RoleServiceImpl';
import RoleForm from './RoleForm';
import type { Role } from '../../core/models/role';

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openRoleForm, setOpenRoleForm] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await roleService.getRoles();
      if (response.succeeded) {
        setRoles(response.data);
      } else {
        setError(response.message || 'Failed to fetch roles');
      }
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      setError(err.message || 'An error occurred while fetching roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAdded = (roleName: string) => {
    fetchRoles(); // Refresh the roles list
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Roles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenRoleForm(true)}
          sx={{
            fontWeight: 500,
            px: 3,
            py: 1.2,
            borderRadius: '4px',
            backgroundColor: '#00b8a9',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,184,169,0.3)',
            '&:hover': {
              backgroundColor: '#00a599',
              boxShadow: '0 4px 8px rgba(0,184,169,0.4)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              backgroundColor: '#00877c',
              transform: 'translateY(0px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Add Role
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No roles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <RoleForm
        open={openRoleForm}
        onClose={() => setOpenRoleForm(false)}
        onSuccess={handleRoleAdded}
      />
    </Box>
  );
};

export default RolesList;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import axios from 'axios';

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (roleName: string) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Form validation
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    permissions?: string;
  }>({});

  useEffect(() => {
    if (open) {
      fetchPermissions();
    }
  }, [open]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://localhost:44307/api/users/default-permission',
        {
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'tenantId': 'root'
          }
        }
      );

      if (response.data.succeeded) {
        setAvailablePermissions(response.data.data);
      } else {
        console.error('Failed to fetch permissions:', response.data.message);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setFormErrors({});
    setError(null);
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (permission: string) => {
    const currentIndex = selectedPermissions.indexOf(permission);
    const newSelectedPermissions = [...selectedPermissions];

    if (currentIndex === -1) {
      newSelectedPermissions.push(permission);
    } else {
      newSelectedPermissions.splice(currentIndex, 1);
    }

    setSelectedPermissions(newSelectedPermissions);
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      permissions?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Role name is required';
    }

    if (selectedPermissions.length === 0) {
      errors.permissions = 'At least one permission must be selected';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare permissions in the required format
      const permissions = selectedPermissions.map(permission => ({
        claimType: "Permission",
        claimValue: permission
      }));

      const response = await axios.post(
        'https://localhost:44307/api/Roles/with-claims',
        {
          name,
          description,
          tenantId: 'root',
          permissions
        },
        {
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'tenantId': 'root',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.id) {
        onSuccess(name);
        resetForm();
        onClose();
      } else {
        setError('Failed to create role');
      }
    } catch (err: any) {
      console.error('Error creating role:', err);
      setError(err.response?.data?.message || 'An error occurred while creating the role');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedPermissions([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Group permissions by category
  const getGroupedPermissions = () => {
    const categories = [...new Set(availablePermissions.map(p => {
      const parts = p.split('.');
      return parts.length > 1 ? parts[1] : 'Other';
    }))];

    return categories.map(category => {
      // Filter permissions for this category
      const categoryPermissions = availablePermissions.filter(p => {
        const parts = p.split('.');
        return parts.length > 1 && parts[1] === category;
      });

      // Check if all permissions in this category are selected
      const allSelected = categoryPermissions.length > 0 &&
        categoryPermissions.every(p => selectedPermissions.includes(p));

      // Handle select all for this category
      const handleSelectAllCategory = () => {
        const newSelectedPermissions = [...selectedPermissions];

        if (allSelected) {
          // Remove all permissions from this category
          categoryPermissions.forEach(p => {
            const index = newSelectedPermissions.indexOf(p);
            if (index !== -1) {
              newSelectedPermissions.splice(index, 1);
            }
          });
        } else {
          // Add all permissions from this category
          categoryPermissions.forEach(p => {
            if (!newSelectedPermissions.includes(p)) {
              newSelectedPermissions.push(p);
            }
          });
        }

        setSelectedPermissions(newSelectedPermissions);
      };

      return {
        category,
        permissions: categoryPermissions,
        allSelected,
        handleSelectAllCategory
      };
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Role</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
            Role Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
            placeholder="Enter role name"
            disabled={loading}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
            Description
          </Typography>
          <TextField
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter role description"
            disabled={loading}
            size="small"
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
            Select Permissions <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          {formErrors.permissions && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mb: 1 }}>
              {formErrors.permissions}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px', p: 2 }}>
              {getGroupedPermissions().map(({ category, permissions, allSelected, handleSelectAllCategory }) => (
                <Box key={category} sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allSelected}
                        onChange={handleSelectAllCategory}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          textTransform: 'capitalize',
                          color: '#00b8a9',
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }}
                      >
                        {category}
                      </Typography>
                    }
                  />
                  <Divider sx={{ mt: 0.5, mb: 1.5 }} />

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, pl: 3 }}>
                    {permissions.map((permission) => {
                      // Extract the action part (e.g., "View" from "Permissions.Users.View")
                      const parts = permission.split('.');
                      const action = parts.length > 2 ? parts[2] : permission;

                      return (
                        <FormControlLabel
                          key={permission}
                          control={
                            <Checkbox
                              checked={selectedPermissions.includes(permission)}
                              onChange={() => handlePermissionChange(permission)}
                              color="primary"
                              size="small"
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: '0.9rem' }}>
                              {action}
                            </Typography>
                          }
                        />
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClear}
          variant="outlined"
          disabled={loading || selectedPermissions.length === 0}
          sx={{
            mr: 1,
            color: '#666',
            borderColor: '#ccc',
            '&:hover': {
              borderColor: '#999',
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleForm;

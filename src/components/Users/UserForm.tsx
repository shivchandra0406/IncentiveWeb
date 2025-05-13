import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormHelperText,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../core/models/user';
import userService from '../../infrastructure/users/UserServiceImpl';
import RoleForm from '../Roles/RoleForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  user: User | null;
  mode: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSubmit, user, mode }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [openRoleForm, setOpenRoleForm] = useState(false);

  // Form fields
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchRole, setSearchRole] = useState('');

  // Form validation
  const [formErrors, setFormErrors] = useState<{
    userName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
    roles?: string;
  }>({});

  useEffect(() => {
    if (open) {
      resetForm();
      fetchRoles();
      if (mode === 'edit' && user) {
        populateForm(user);
        fetchUserRoles(user.id);
      }
    }
  }, [open, user, mode]);

  const resetForm = () => {
    setUserName('');
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setIsActive(true);
    setSelectedRoles([]);
    setFormErrors({});
    setTabValue(0);
    setError(null);
  };

  const populateForm = (user: User) => {
    setUserName(user.username);
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsActive(user.isActive);
  };

  const fetchRoles = async () => {
    try {
      // Fetch roles from the API
      const response = await axios.get(
        'https://localhost:44307/api/Roles',
        {
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'tenantId': 'root'
          }
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const roleNames = response.data.map((role: { name: string }) => role.name);
        setAvailableRoles(roleNames);
      } else {
        console.error('Invalid response format from roles API:', response.data);
        setAvailableRoles([]);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setAvailableRoles([]);
    }
  };

  const fetchUserRoles = async (userId: string) => {
    try {
      const roles = await userService.getUserRoles(userId);
      setSelectedRoles(roles);
    } catch (err) {
      console.error('Error fetching user roles:', err);
    }
  };



  const validateForm = () => {
    const errors: {
      userName?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      password?: string;
      confirmPassword?: string;
      roles?: string;
    } = {};

    if (!userName.trim()) {
      errors.userName = 'Username is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (mode === 'create') {
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (selectedRoles.length === 0) {
      errors.roles = 'At least one role must be selected';
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
      if (mode === 'create') {
        const userData: CreateUserRequest = {
          userName,
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
          tenantId: 'root', // Default tenant
          isActive,
          roles: selectedRoles
        };

        const response = await userService.createUser(userData);
        if (response.succeeded) {
          onSubmit();
        } else {
          setError(response.message || 'Failed to create user');
        }
      } else if (mode === 'edit' && user) {
        const userData: UpdateUserRequest = {
          email,
          firstName,
          lastName,
          isActive
        };

        const response = await userService.updateUser(user.id, userData);
        if (response.succeeded) {
          // Update roles if they've changed
          if (JSON.stringify(user.roles.sort()) !== JSON.stringify(selectedRoles.sort())) {
            await userService.assignRolesToUser({
              userId: user.id,
              roles: selectedRoles
            });
          }

          onSubmit();
        } else {
          setError(response.message || 'Failed to update user');
        }
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError('An error occurred while saving the user');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRoleChange = (role: string) => {
    const currentIndex = selectedRoles.indexOf(role);
    const newSelectedRoles = [...selectedRoles];

    if (currentIndex === -1) {
      newSelectedRoles.push(role);
    } else {
      newSelectedRoles.splice(currentIndex, 1);
    }

    setSelectedRoles(newSelectedRoles);
  };



  const handleAddRole = (roleName: string) => {
    // Add the new role to the available roles list
    if (!availableRoles.includes(roleName)) {
      setAvailableRoles([...availableRoles, roleName]);
    }

    // Select the new role
    if (!selectedRoles.includes(roleName)) {
      setSelectedRoles([...selectedRoles, roleName]);
    }

    // Close the role form
    setOpenRoleForm(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'create' ? 'Create New User' : 'Edit User'}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="user form tabs">
          <Tab label="User Details" />
          <Tab label="Roles" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                error={!!formErrors.userName}
                helperText={formErrors.userName}
                disabled={mode === 'edit'} // Username cannot be changed after creation
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
              />
            </Grid>

            {mode === 'create' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              Roles
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenRoleForm(true)}
              sx={{
                fontWeight: 700,
                px: 2,
                py: 0.8,
                borderRadius: '8px',
                backgroundColor: '#00b8a9',
                color: 'white',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#00a599',
                  boxShadow: '0 2px 4px rgba(0,184,169,0.3)',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  backgroundColor: '#00877c',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Add Role
            </Button>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Select one or more roles to assign to this user.
          </Typography>

          {formErrors.roles && (
            <FormHelperText error sx={{ mb: 2 }}>
              {formErrors.roles}
            </FormHelperText>
          )}

          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'action.active',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              🔍
            </Box>
            <TextField
              fullWidth
              placeholder="Search roles..."
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  pl: 4,
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                }
              }}
            />
          </Box>

          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              maxHeight: '200px',
              overflowY: 'auto',
              mb: 2
            }}
          >
            <Box sx={{
              p: 2,
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5'
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.length === availableRoles.length && availableRoles.length > 0}
                    onChange={() => {
                      if (selectedRoles.length === availableRoles.length) {
                        setSelectedRoles([]);
                      } else {
                        setSelectedRoles([...availableRoles]);
                      }
                    }}
                    color="primary"
                  />
                }
                label={<Typography sx={{ fontWeight: 500 }}>Select All</Typography>}
              />
            </Box>

            <Box sx={{
              p: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3
            }}>
              {availableRoles
                .filter(role => role.toLowerCase().includes(searchRole.toLowerCase()))
                .map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleRoleChange(role)}
                      color="primary"
                    />
                  }
                  label={role}
                  sx={{
                    m: 0,
                    minWidth: '150px',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Role Form Dialog */}
          <RoleForm
            open={openRoleForm}
            onClose={() => setOpenRoleForm(false)}
            onSuccess={handleAddRole}
          />
        </TabPanel>


      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;

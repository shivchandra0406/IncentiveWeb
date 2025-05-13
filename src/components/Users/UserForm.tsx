import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Chip,
  OutlinedInput,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { User, CreateUserRequest, UpdateUserRequest } from '../../core/models/user';
import userService from '../../infrastructure/users/UserServiceImpl';

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
  const [userClaims, setUserClaims] = useState<{ claimType: string; claimValue: string }[]>([]);

  // Form fields
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

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
        fetchUserClaims(user.id);
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
      // In a real implementation, this would fetch roles from the API
      setAvailableRoles(['Admin', 'Manager', 'Agent', 'READONLY']);
    } catch (err) {
      console.error('Error fetching roles:', err);
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

  const fetchUserClaims = async (userId: string) => {
    try {
      const claims = await userService.getUserClaims(userId);
      setUserClaims(claims);
    } catch (err) {
      console.error('Error fetching user claims:', err);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedRoles(typeof value === 'string' ? value.split(',') : value);
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
          <Tab label="Roles & Permissions" />
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
          <FormControl fullWidth error={!!formErrors.roles}>
            <InputLabel id="roles-select-label">Roles</InputLabel>
            <Select
              labelId="roles-select-label"
              multiple
              value={selectedRoles}
              onChange={handleRoleChange}
              input={<OutlinedInput label="Roles" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
            {formErrors.roles && <FormHelperText>{formErrors.roles}</FormHelperText>}
          </FormControl>

          {mode === 'edit' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                User Claims
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {userClaims.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userClaims.map((claim, index) => (
                    <Chip
                      key={index}
                      label={`${claim.claimType}: ${claim.claimValue}`}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No claims assigned to this user.
                </Typography>
              )}
            </Box>
          )}
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

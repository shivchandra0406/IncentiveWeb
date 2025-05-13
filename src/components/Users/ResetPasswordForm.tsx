import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import userService from '../../infrastructure/users/UserServiceImpl';

interface ResetPasswordFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  userId: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  userId 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form validation
  const [formErrors, setFormErrors] = useState<{
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  const resetForm = () => {
    setNewPassword('');
    setConfirmNewPassword('');
    setFormErrors({});
    setError(null);
    setSuccess(false);
  };

  const validateForm = () => {
    const errors: {
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your password';
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
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
    setSuccess(false);
    
    try {
      const response = await userService.resetPassword({
        userId,
        newPassword,
        confirmNewPassword
      });
      
      if (response.succeeded) {
        setSuccess(true);
        setTimeout(() => {
          onSubmit();
          resetForm();
        }, 1500);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('An error occurred while resetting the password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Reset User Password</DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password has been reset successfully.
          </Alert>
        )}
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Enter a new password for this user. The user will need to use this password for their next login.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!formErrors.newPassword}
              helperText={formErrors.newPassword}
              required
              disabled={loading || success}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              error={!!formErrors.confirmNewPassword}
              helperText={formErrors.confirmNewPassword}
              required
              disabled={loading || success}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading || success}
        >
          {loading ? <CircularProgress size={24} /> : 'Reset Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordForm;

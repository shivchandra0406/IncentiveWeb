import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Grid,
  CssBaseline,
  InputAdornment,
  IconButton,
  Divider,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthStore } from '../app/store/authStore';

const Login: React.FC = () => {
  const [subdomain, setSubdomain] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error: authError } = useAuthStore();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Set error from auth store
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setError('');

      // Use the auth store login method
      await login({ email: username, password });

      // Navigation will happen automatically via the useEffect hook
    } catch (err: any) {
      console.error('Login error:', err);
      // Error is handled by the auth store and will be displayed via useEffect
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: '#00b8a9',
                fontWeight: 500,
                mb: 1
              }}
            >
              Mr. Munim
            </Typography>
          </Box>

          <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 500 }}>
            Login
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please enter your username and password to login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Subdomain Name
            </Typography>

            <Box sx={{ mb: 3, display: 'flex' }}>
              <TextField
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  flex: '1 1 auto',
                  '& .MuiOutlinedInput-root': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                }}
              />
              <TextField
                value=".mrmunim.com"
                disabled
                variant="outlined"
                size="small"
                sx={{
                  width: '130px',
                  '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Username <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Password <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                bgcolor: '#00b8a9',
                '&:hover': {
                  bgcolor: '#009b8e'
                },
                borderRadius: 1,
                textTransform: 'uppercase',
                fontWeight: 500
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: '#00b8a9',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './app/routes/AppRoutes';
import { useAuthStore } from './app/store/authStore';
import './App.css';

// Mock implementation of useAuthStore until we fix the real implementation
const mockAuthStore = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  clearError: () => {}
};

// Create a theme instance based on the requirements
const theme = createTheme({
  palette: {
    primary: {
      main: '#00b8a9', // Teal/mint green accent color
      light: '#4febd9',
      dark: '#00877c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1a1a2e', // Dark color for sidebar
      light: '#2c2c44',
      dark: '#0d0d17',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f7f7', // Light main content area
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#6c757d',
    },
    error: {
      main: '#f44336',
      light: '#ffebee',
      dark: '#c62828',
    },
    warning: {
      main: '#ff9800',
      light: '#fff8e1',
      dark: '#ef6c00',
    },
    info: {
      main: '#2196f3',
      light: '#e3f2fd',
      dark: '#0d47a1',
    },
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
      dark: '#2e7d32',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Poppins',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          backgroundColor: '#00b8a9',
          '&:hover': {
            backgroundColor: '#00877c',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#333333',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a2e', // Dark sidebar
          color: '#ffffff',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Light hover effect
            color: '#ffffff', // White active highlights
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: '#00b8a9', // Accent color for active indicator
              borderRadius: '0 4px 4px 0',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)', // Light hover effect
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'rgba(255, 255, 255, 0.7)', // Light icon color for dark sidebar
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9rem',
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#333333',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          height: 8,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#00b8a9',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#00b8a9',
        },
      },
    },
  },
});

function App() {
  // Use the mock store for now to avoid errors
  // const { checkAuth } = useAuthStore();
  const { checkAuth } = mockAuthStore;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check authentication status when app loads
    const initApp = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initApp();
  }, [checkAuth]);

  // Show a loading indicator until the app is initialized
  if (!isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

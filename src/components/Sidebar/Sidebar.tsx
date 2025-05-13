import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  AccountTree as AccountTreeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
// import { useAuthStore } from '../../app/store/authStore';
import * as AuthModels from '../../core/models/auth';

// Type aliases for better readability
const UserRole = AuthModels.UserRole;

// Mock implementation of useAuthStore until we fix the real implementation
const mockAuthStore = {
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  token: 'mock-token',
  refreshToken: 'mock-refresh-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  clearError: () => {}
};

const drawerWidth = 230;

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  height: 56,
  color: '#ffffff',
  fontWeight: 'bold'
}));

// Custom styles for sidebar items
const sidebarItemButtonStyles = {
  borderRadius: 0, // Completely squared corners
  margin: '2px 0', // Remove horizontal margin for full-width effect
  padding: '8px 16px 8px 12px', // Slightly more padding for better appearance
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
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
      width: 4, // Slightly wider for more visibility
      backgroundColor: '#00b8a9',
      borderRadius: 0, // No border radius
      boxShadow: '1px 0 3px rgba(0, 184, 169, 0.4)', // Add subtle shadow for 3D effect
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
};

const sidebarItemIconStyles = {
  color: 'rgba(255, 255, 255, 0.7)',
  minWidth: 40,
  fontSize: '1.2rem',
};

const sidebarItemTextStyles = {
  '& .MuiTypography-root': {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
  marginLeft: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'persistent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
  const location = useLocation();
  // const { user } = useAuthStore();
  const { user } = mockAuthStore;

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.READONLY]
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/users',
      roles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      text: 'Incentive Plans',
      icon: <DescriptionIcon />,
      path: '/incentive-plans',
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.READONLY]
    },
    {
      text: 'Deals',
      icon: <BusinessIcon />,
      path: '/deals',
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.READONLY]
    },
    {
      text: 'Payouts',
      icon: <PaymentIcon />,
      path: '/payouts',
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.READONLY]
    },
    {
      text: 'Workflows',
      icon: <AccountTreeIcon />,
      path: '/workflows',
      roles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: [UserRole.ADMIN]
    }
  ];

  const filteredMenuItems = user
    ? menuItems.filter(item => item.roles.includes(user.role))
    : [];

  const drawer = (
    <>
      <Logo>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            component="span"
            sx={{
              bgcolor: '#00b8a9',
              color: 'white',
              width: 28,
              height: 28,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              marginLeft: 5
            }}
          >
            M
          </Box>
          Mr. Munim
        </Typography>
      </Logo>
      <Divider sx={{ my: 0.5 }} />
      <List sx={{ py: 0.5, px: 0 }}> {/* Remove horizontal padding */}
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding dense sx={{ px: 0 }}> {/* Remove horizontal padding */}
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                ...sidebarItemButtonStyles,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                width: '100%' // Ensure full width
              }}
            >
              <ListItemIcon sx={sidebarItemIconStyles}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={sidebarItemTextStyles}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#1a1a2e', // Dark sidebar
            color: '#ffffff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

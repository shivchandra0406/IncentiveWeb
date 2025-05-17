import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { useAuthStore } from '../app/store/authStore';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant={isMobile ? 'temporary' : 'permanent'}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 1 },
          pl: { xs: 1, sm: 1 }, // Reduced left padding to minimize space between sidebar and content
          pr: { xs: 1.5, sm: 2 }, // Keep right padding consistent
          width: { sm: `calc(100% - 230px)` },
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* This creates space for the fixed AppBar */}
        <Box sx={{ width: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;

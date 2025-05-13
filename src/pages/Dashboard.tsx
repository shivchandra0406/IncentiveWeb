import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Business,
  Assignment,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
// import { useAuthStore } from '../app/store/authStore';

// Mock implementation of useAuthStore until we fix the real implementation
const mockAuthStore = {
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
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

const Dashboard: React.FC = () => {
  // const { user } = useAuthStore();
  const { user } = mockAuthStore;

  // State for interactive features
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [timeRangeMenuAnchorEl, setTimeRangeMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [dealMenuAnchorEl, setDealMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);

  // Mock data for dashboard
  const [stats, setStats] = useState([
    { title: 'Total Deals', value: '124', icon: <Business color="primary" />, change: '+12%', trend: 'up' },
    { title: 'Active Incentive Plans', value: '8', icon: <Assignment color="secondary" />, change: '+2', trend: 'up' },
    { title: 'Total Payouts', value: '$45,250', icon: <AttachMoney color="success" />, change: '+8%', trend: 'up' },
    { title: 'Team Members', value: '16', icon: <People color="info" />, change: '+1', trend: 'up' }
  ]);

  const [recentDeals, setRecentDeals] = useState([
    { id: 1, name: 'Enterprise Software Deal', client: 'Acme Corp', amount: '$12,500', status: 'Closed Won' },
    { id: 2, name: 'Cloud Migration Project', client: 'TechFirm Inc', amount: '$28,750', status: 'Negotiation' },
    { id: 3, name: 'Security Upgrade', client: 'SecureData Ltd', amount: '$8,900', status: 'Pending' },
    { id: 4, name: 'Hardware Refresh', client: 'Global Manufacturing', amount: '$15,200', status: 'New' }
  ]);

  const [topPerformers, setTopPerformers] = useState([
    { id: 1, name: 'Jane Smith', deals: 24, amount: '$125,000', avatar: 'JS' },
    { id: 2, name: 'John Doe', deals: 18, amount: '$98,500', avatar: 'JD' },
    { id: 3, name: 'Emily Johnson', deals: 15, amount: '$87,200', avatar: 'EJ' }
  ]);

  const [incentiveProgress, setIncentiveProgress] = useState([
    { id: 1, name: 'Q2 Sales Target', progress: 78, target: '$250,000', current: '$195,000' },
    { id: 2, name: 'New Clients', progress: 45, target: '20', current: '9' },
    { id: 3, name: 'Renewal Rate', progress: 92, target: '85%', current: '78%' }
  ]);

  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle time range menu
  const handleTimeRangeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTimeRangeMenuAnchorEl(event.currentTarget);
  };

  const handleTimeRangeMenuClose = () => {
    setTimeRangeMenuAnchorEl(null);
  };

  // Handle time range change
  const handleTimeRangeChange = (range: 'day' | 'week' | 'month' | 'quarter') => {
    setTimeRange(range);
    setTimeRangeMenuAnchorEl(null);
    refreshData();
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle deal menu
  const handleDealMenuOpen = (event: React.MouseEvent<HTMLElement>, dealId: number) => {
    setDealMenuAnchorEl(event.currentTarget);
    setSelectedDealId(dealId);
  };

  const handleDealMenuClose = () => {
    setDealMenuAnchorEl(null);
    setSelectedDealId(null);
  };

  // Refresh data function
  const refreshData = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Update stats with random changes
      const newStats = stats.map(stat => {
        const randomChange = Math.floor(Math.random() * 15);
        const trend = Math.random() > 0.3 ? 'up' : 'down';
        return {
          ...stat,
          change: trend === 'up' ? `+${randomChange}%` : `-${randomChange}%`,
          trend
        };
      });

      setStats(newStats);
      setIsLoading(false);
    }, 1000);
  };

  // Effect to simulate initial data loading
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get time range display text
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      default:
        return 'This Month';
    }
  };

  return (
    <Box sx={{ bgcolor: '#f7f7f7', minHeight: '100%', py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DateRangeIcon />}
            endIcon={<FilterListIcon />}
            onClick={handleTimeRangeMenuOpen}
            sx={{ borderRadius: 2 }}
          >
            {getTimeRangeText()}
          </Button>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={refreshData}
              color="primary"
              disabled={isLoading}
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 184, 169, 0.08)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Time Range Menu */}
      <Menu
        anchorEl={timeRangeMenuAnchorEl}
        open={Boolean(timeRangeMenuAnchorEl)}
        onClose={handleTimeRangeMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => handleTimeRangeChange('day')}
          selected={timeRange === 'day'}
        >
          Today
        </MenuItem>
        <MenuItem
          onClick={() => handleTimeRangeChange('week')}
          selected={timeRange === 'week'}
        >
          This Week
        </MenuItem>
        <MenuItem
          onClick={() => handleTimeRangeChange('month')}
          selected={timeRange === 'month'}
        >
          This Month
        </MenuItem>
        <MenuItem
          onClick={() => handleTimeRangeChange('quarter')}
          selected={timeRange === 'quarter'}
        >
          This Quarter
        </MenuItem>
      </Menu>

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose}>Export Dashboard</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print View</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      </Menu>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  mr: 2,
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Business color="primary" />
              </Box>
              <Typography variant="subtitle2" color="textSecondary">
                Total Deals
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              124
            </Typography>
            <Typography
              variant="body2"
              color={stats[0].trend === 'up' ? 'success.main' : 'error.main'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {stats[0].trend === 'up' ?
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> :
                <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
              }
              {stats[0].change} from last {timeRange}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  mr: 2,
                  bgcolor: 'rgba(156, 39, 176, 0.1)',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Assignment color="secondary" />
              </Box>
              <Typography variant="subtitle2" color="textSecondary">
                Active Incentive Plans
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              8
            </Typography>
            <Typography
              variant="body2"
              color={stats[1].trend === 'up' ? 'success.main' : 'error.main'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {stats[1].trend === 'up' ?
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> :
                <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
              }
              {stats[1].change} from last {timeRange}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  mr: 2,
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AttachMoney color="success" />
              </Box>
              <Typography variant="subtitle2" color="textSecondary">
                Total Payouts
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              $45,250
            </Typography>
            <Typography
              variant="body2"
              color={stats[2].trend === 'up' ? 'success.main' : 'error.main'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {stats[2].trend === 'up' ?
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> :
                <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
              }
              {stats[2].change} from last {timeRange}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  mr: 2,
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <People color="info" />
              </Box>
              <Typography variant="subtitle2" color="textSecondary">
                Team Members
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              16
            </Typography>
            <Typography
              variant="body2"
              color={stats[3].trend === 'up' ? 'success.main' : 'error.main'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {stats[3].trend === 'up' ?
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> :
                <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
              }
              {stats[3].change} from last {timeRange}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Deals */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="medium">Recent Deals</Typography>
              <Box>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ minHeight: 0 }}
                >
                  <Tab
                    label="All"
                    sx={{
                      minHeight: 0,
                      py: 1,
                      px: 2,
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  />
                  <Tab
                    label="My Deals"
                    sx={{
                      minHeight: 0,
                      py: 1,
                      px: 2,
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  />
                </Tabs>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ p: 0 }}>
              <List disablePadding>
                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="medium">Enterprise Software Deal</Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">Acme Corp — $12,500</Typography>
                        <Box
                          sx={{
                            ml: 'auto',
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          Closed Won
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="medium">Cloud Migration Project</Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">TechFirm Inc — $28,750</Typography>
                        <Box
                          sx={{
                            ml: 'auto',
                            bgcolor: 'warning.light',
                            color: 'warning.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          Negotiation
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="medium">Security Upgrade</Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">SecureData Ltd — $8,900</Typography>
                        <Box
                          sx={{
                            ml: 'auto',
                            bgcolor: 'info.light',
                            color: 'info.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          Pending
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="medium">Hardware Refresh</Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">Global Manufacturing — $15,200</Typography>
                        <Box
                          sx={{
                            ml: 'auto',
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          New
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'white' }}>
              <Typography variant="h6" fontWeight="medium">Top Performers</Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 0 }}>
              <List disablePadding>
                {topPerformers.map((performer, index) => (
                  <React.Fragment key={performer.id}>
                    <ListItem sx={{ px: 2, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{performer.avatar}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="medium">{performer.name}</Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            {performer.deals} deals — {performer.amount}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < topPerformers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Incentive Progress */}
        <Grid item xs={12} md={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'white' }}>
              <Typography variant="h6" fontWeight="medium">Incentive Progress</Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {incentiveProgress.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{`${item.progress}%`}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        {item.current} of {item.target}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

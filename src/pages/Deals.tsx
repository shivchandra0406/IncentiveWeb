import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';

// Mock data for deals
interface Deal {
  id: string;
  name: string;
  client: string;
  amount: number;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  assignedTo: string;
  createdDate: string;
  closedDate: string | null;
}

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'Enterprise Software Deal',
    client: 'Acme Corp',
    amount: 12500,
    status: 'closed-won',
    assignedTo: 'Jane Smith',
    createdDate: '2023-05-01',
    closedDate: '2023-05-15'
  },
  {
    id: '2',
    name: 'Cloud Migration Project',
    client: 'TechFirm Inc',
    amount: 28750,
    status: 'negotiation',
    assignedTo: 'John Doe',
    createdDate: '2023-05-05',
    closedDate: null
  },
  {
    id: '3',
    name: 'Security Upgrade',
    client: 'SecureData Ltd',
    amount: 8900,
    status: 'proposal',
    assignedTo: 'Emily Johnson',
    createdDate: '2023-05-10',
    closedDate: null
  },
  {
    id: '4',
    name: 'Hardware Refresh',
    client: 'Global Manufacturing',
    amount: 15200,
    status: 'new',
    assignedTo: 'John Doe',
    createdDate: '2023-05-12',
    closedDate: null
  },
  {
    id: '5',
    name: 'Software License Renewal',
    client: 'Finance Group',
    amount: 9800,
    status: 'qualified',
    assignedTo: 'Jane Smith',
    createdDate: '2023-05-08',
    closedDate: null
  },
  {
    id: '6',
    name: 'Network Infrastructure Upgrade',
    client: 'Healthcare Systems',
    amount: 32000,
    status: 'closed-lost',
    assignedTo: 'Emily Johnson',
    createdDate: '2023-04-20',
    closedDate: '2023-05-10'
  }
];

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
      id={`deals-tabpanel-${index}`}
      aria-labelledby={`deals-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `deals-tab-${index}`,
    'aria-controls': `deals-tabpanel-${index}`,
  };
}

const Deals: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dealId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedDealId(dealId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDealId(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCardClick = (cardTitle: string) => {
    // Set the appropriate tab based on the card clicked
    switch(cardTitle) {
      case 'Total Deals':
        setTabValue(0); // All Deals tab
        break;
      case 'Open Deals':
        setTabValue(2); // Active tab
        break;
      case 'Won Deals':
        setTabValue(3); // Closed Won tab
        break;
      case 'Lost Deals':
        setTabValue(4); // Closed Lost tab
        break;
      default:
        setTabValue(0); // Default to All Deals tab
    }
  };

  const filteredDeals = mockDeals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'qualified':
        return 'primary';
      case 'proposal':
        return 'secondary';
      case 'negotiation':
        return 'warning';
      case 'closed-won':
        return 'success';
      case 'closed-lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      title: 'Total Deals',
      value: mockDeals.length,
      color: 'primary.main',
      change: 12 // Positive percentage change from last month
    },
    {
      title: 'Open Deals',
      value: mockDeals.filter(d => !d.closedDate).length,
      color: 'info.main',
      change: 8 // Positive percentage change from last month
    },
    {
      title: 'Won Deals',
      value: mockDeals.filter(d => d.status === 'closed-won').length,
      color: 'success.main',
      change: 15 // Positive percentage change from last month
    },
    {
      title: 'Lost Deals',
      value: mockDeals.filter(d => d.status === 'closed-lost').length,
      color: 'error.main',
      change: -5 // Negative percentage change from last month
    },
    {
      title: 'Total Value',
      value: formatCurrency(mockDeals.reduce((sum, deal) => sum + deal.amount, 0)),
      color: 'secondary.main',
      change: 20 // Positive percentage change from last month
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 0, fontWeight: 600 }}>
          Deals
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={refreshData}
              disabled={isLoading}
              size="small"
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                padding: '4px',
                '&:hover': {
                  bgcolor: 'rgba(0, 184, 169, 0.08)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : <RefreshIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            sx={{ borderRadius: 1.5, textTransform: 'none', py: 0.5 }}
          >
            Add Deal
          </Button>
        </Box>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                  '& .card-highlight': {
                    width: '100%',
                    opacity: 0.15,
                  }
                },
              }}
            >
              <Box
                className="card-highlight"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '5px',
                  backgroundColor: card.color,
                  opacity: 0.7,
                  transition: 'all 0.3s ease-in-out'
                }}
              />
              <CardActionArea onClick={() => handleCardClick(card.title)}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="body2" color="textSecondary" display="block" sx={{ mb: 0.75, fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </Typography>
                  {card.change && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {card.change > 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: '0.9rem', color: 'success.main', mr: 0.5 }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: '0.9rem', color: 'error.main', mr: 0.5 }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: card.change > 0 ? 'success.main' : 'error.main',
                          fontWeight: 500
                        }}
                      >
                        {Math.abs(card.change)}% from last month
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="deals tabs"
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              py: 0.5,
              px: 2,
              fontSize: '0.85rem',
              textTransform: 'none'
            }
          }}
        >
          <Tab label="All Deals" {...a11yProps(0)} />
          <Tab label="My Deals" {...a11yProps(1)} />
          <Tab label="Active" {...a11yProps(2)} />
          <Tab label="Closed Won" {...a11yProps(3)} />
          <Tab label="Closed Lost" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={0} sx={{ width: '100%', borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Toolbar sx={{ pl: { sm: 1.5 }, pr: { xs: 1, sm: 1 }, minHeight: 48 }}>
            <TextField
              variant="outlined"
              placeholder="Search deals..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                mr: 1.5,
                width: 250,
                '& .MuiOutlinedInput-root': {
                  height: 36,
                  fontSize: '0.85rem'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon fontSize="small" />}
              size="small"
              sx={{
                mr: 1.5,
                borderRadius: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.85rem'
              }}
            >
              Filter
            </Button>
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>

          <TableContainer sx={{ width: '100%' }}>
            <Table
              sx={{
                minWidth: 750,
                width: '100%',
                tableLayout: 'fixed',
                '& .MuiTableCell-root': {
                  py: 2,
                  px: 2.5,
                  fontSize: '0.85rem'
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                  fontWeight: 600,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  py: 1.75
                }
              }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Deal Name</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((deal) => (
                    <TableRow
                      key={deal.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ mr: 0.75, color: 'primary.main', fontSize: '1rem' }} />
                          <Typography variant="body2" fontWeight="medium" fontSize="0.85rem">{deal.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{deal.client}</TableCell>
                      <TableCell>{formatCurrency(deal.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(deal.status)}
                          color={getStatusColor(deal.status) as any}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            height: 22,
                            fontSize: '0.75rem',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      </TableCell>
                      <TableCell>{deal.assignedTo}</TableCell>
                      <TableCell>{deal.createdDate}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <EditIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, deal.id)}
                            sx={{ p: 0.5 }}
                          >
                            <MoreVertIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDeals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-toolbar': {
                minHeight: 48,
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  fontSize: '0.85rem'
                }
              }
            }}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={0} sx={{ width: '100%', p: 3, borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Typography variant="body2" fontSize="0.85rem">My Deals content will be shown here.</Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper elevation={0} sx={{ width: '100%', p: 3, borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Typography variant="body2" fontSize="0.85rem">Active Deals content will be shown here.</Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper elevation={0} sx={{ width: '100%', p: 3, borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Typography variant="body2" fontSize="0.85rem">Closed Won Deals content will be shown here.</Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Paper elevation={0} sx={{ width: '100%', p: 3, borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Typography variant="body2" fontSize="0.85rem">Closed Lost Deals content will be shown here.</Typography>
        </Paper>
      </TabPanel>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 180,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              fontSize: '0.85rem',
              py: 0.75
            },
            '& .MuiListItemIcon-root': {
              minWidth: 32
            }
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>Edit Deal</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AttachMoneyIcon fontSize="small" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>Create Payout</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" color="success" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>Mark as Won</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>Mark as Lost</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete Deal</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Deals;

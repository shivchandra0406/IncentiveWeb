import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
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
  Avatar
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
import { useNavigate } from 'react-router-dom';
import dealService from '../../infrastructure/deals/DealServiceImpl';
import { DealStatus, CurrencyType } from '../../core/models/deal';
import type { Deal } from '../../core/models/deal';

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
        <Box sx={{ pt: 2 }}>
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

const DealsList: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const [filters, setFilters] = useState<{
    status?: DealStatus;
    search?: string;
  }>({});

  useEffect(() => {
    fetchDeals(filters);
  }, [filters]);

  // Debug function to log deal status values
  const logDealStatus = (deal: Deal) => {
    console.log('Deal Status Debug:', {
      dealId: deal.id,
      rawStatus: deal.status,
      statusType: typeof deal.status,
      statusToString: String(deal.status),
      statusToNumber: Number(deal.status),
      enumLookup: DealStatus[Number(deal.status)],
      dealObject: { ...deal },
      allDealStatusValues: Object.keys(DealStatus).filter(key => isNaN(Number(key))),
    });
  };

  const fetchDeals = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dealService.getDeals(currentFilters);
      console.log('Raw API response:', response);
      
      if (response.succeeded) {
        // Log the full response structure for debugging
        console.log('Deals data structure:', response.data);
        
        // The API response has a nested structure where deals are in response.data.data
        // Use type assertion to handle the nested structure
        const responseData = response?.data as any;
        const dealsData = responseData || [];
        console.log('Extracted deals data:', dealsData);
        
        // Log the first deal for debugging
        if (dealsData.length > 0) {
          console.log('First deal in response:', dealsData[0]);
          console.log('Status value:', dealsData[0].status, 'Type:', typeof dealsData[0].status);
          logDealStatus(dealsData[0]);
        }
        setDeals(dealsData);
      } else {
        setError(response.message || 'Failed to fetch deals');
      }
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(err.message || 'An error occurred while fetching deals');
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setFilters(prev => ({ ...prev, search: searchQuery }));
      } else if (filters.search) {
        setFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters.search;
          return newFilters;
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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

    // Apply status filter based on tab
    switch (newValue) {
      case 0: // All Deals
        setFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters.status;
          return newFilters;
        });
        break;
      case 1: // Active
        setFilters(prev => ({ ...prev, status: DealStatus.New }));
        break;
      case 2: // Won
        setFilters(prev => ({ ...prev, status: DealStatus.Won }));
        break;
      case 3: // Lost
        setFilters(prev => ({ ...prev, status: DealStatus.Lost }));
        break;
      default:
        break;
    }
  };

  const handleEditDeal = () => {
    if (selectedDealId) {
      navigate(`/deals/edit/${selectedDealId}`);
    }
    handleMenuClose();
  };

  const handleViewDeal = () => {
    if (selectedDealId) {
      navigate(`/deals/view/${selectedDealId}`);
    }
    handleMenuClose();
  };

  const handleRowClick = (dealId: string) => {
    navigate(`/deals/view/${dealId}`);
  };

  const handleCreateDeal = () => {
    navigate('/deals/create');
  };

  const refreshData = () => {
    fetchDeals(filters);
  };

  const handleCardClick = (cardTitle: string) => {
    // Set the appropriate tab based on the card clicked
    switch(cardTitle) {
      case 'Total Deals':
        setTabValue(0); // All Deals tab
        setFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters.status;
          return newFilters;
        });
        break;
      case 'Active Deals':
        setTabValue(1); // Active tab
        setFilters(prev => ({ ...prev, status: DealStatus.New }));
        break;
      case 'Won Deals':
        setTabValue(2); // Won tab
        setFilters(prev => ({ ...prev, status: DealStatus.Won }));
        break;
      case 'Lost Deals':
        setTabValue(3); // Lost tab
        setFilters(prev => ({ ...prev, status: DealStatus.Lost }));
        break;
      default:
        setTabValue(0); // Default to All Deals tab
        setFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters.status;
          return newFilters;
        });
    }
  };

  // Debug logging for deals array
  console.log('Deals array before filtering:', deals);
  console.log('Deals array length:', deals.length);
  console.log('Current filters:', filters);
  
  // Filter deals based on search query and status
  const filteredDeals = deals.filter(deal => {
    // Ensure deal is valid
    if (!deal) {
      console.log('Found invalid deal in array');
      return false;
    }
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      (deal.dealName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       deal.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (deal.customerEmail && deal.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Filter by status based on tab selection
    const matchesStatus = filters.status === undefined || deal.status === filters.status;
    
    // Debug logging
    console.log('Filtering deal:', deal.id, 'Status:', deal.status, 'Filter status:', filters.status, 'Matches status:', matchesStatus, 'Matches search:', matchesSearch);
    
    return matchesSearch && matchesStatus;
  });
  
  // Debug logging for filtered deals
  console.log('Filtered deals array:', filteredDeals);
  console.log('Filtered deals length:', filteredDeals.length);

  const getStatusLabel = (statusValue: any): string => {
    console.log('getStatusLabel called with:', statusValue, 'type:', typeof statusValue);
    
    // Handle undefined or null
    if (statusValue === undefined || statusValue === null) {
      console.log('Status is undefined or null, defaulting to "Unknown"');
      return 'Unknown';
    }
    
    // If it's already a string, return it
    if (typeof statusValue === 'string' && isNaN(Number(statusValue))) {
      return statusValue;
    }
    
    // Convert to number if it's not already
    const numericStatus = typeof statusValue === 'number' ? statusValue : Number(statusValue);
    console.log('Converted to numeric status:', numericStatus);
    
    // Map numeric values to status labels
    switch (numericStatus) {
      case 0: return 'New';
      case 1: return 'OnHold';
      case 2: return 'Cancelled';
      case 3: return 'Won';
      case 4: return 'Lost';
      case 5: return 'PartiallyPaid';
      case 6: return 'FullyPaid';
      default: 
        console.log('Unknown status value:', statusValue);
        return `Unknown (${statusValue})`;
    }
  };

  const getStatusColor = (status: any) => {
    // Convert to number if it's not already
    const numericStatus = typeof status === 'number' ? status : Number(status);
    
    switch (numericStatus) {
      case 0: // New
        return 'info';
      case 1: // OnHold
        return 'warning';
      case 2: // Cancelled
        return 'error';
      case 3: // Won
        return 'success';
      case 4: // Lost
        return 'error';
      case 5: // PartiallyPaid
        return 'warning';
      case 6: // FullyPaid
        return 'success';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number, currencyType: CurrencyType) => {
    const currencySymbol = currencyType === CurrencyType.Rupees ? '₹' : '$';
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      title: 'Total Deals',
      value: deals.length,
      color: 'primary.main',
      change: 0
    },
    {
      title: 'Active Deals',
      value: deals.filter(d => d.status === DealStatus.New || d.status === DealStatus.OnHold).length,
      color: 'info.main',
      change: 0
    },
    {
      title: 'Won Deals',
      value: deals.filter(d => d.status === DealStatus.Won || d.status === DealStatus.FullyPaid || d.status === DealStatus.PartiallyPaid).length,
      color: 'success.main',
      change: 0
    },
    {
      title: 'Lost Deals',
      value: deals.filter(d => d.status === DealStatus.Lost || d.status === DealStatus.Cancelled).length,
      color: 'error.main',
      change: 0
    },
    {
      title: 'Total Value',
      value: formatCurrency(deals.reduce((sum, deal) => sum + deal.totalAmount, 0), CurrencyType.Rupees),
      color: 'secondary.main',
      change: 0
    }
  ];

  if (loading && deals.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && deals.length === 0) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

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
              disabled={loading}
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
              {loading ? <CircularProgress size={20} /> : <RefreshIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDeal}
            sx={{
              bgcolor: '#00b8a9',
              '&:hover': {
                bgcolor: '#00a99a',
              }
            }}
          >
            New Deal
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
                  {card.change !== 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {card.change > 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: '0.9rem', color: 'success.main', mr: 0.5 }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: '0.9rem', color: 'error.main', mr: 0.5 }} />
                      )}
                      <Typography variant="caption" sx={{ color: card.change > 0 ? 'success.main' : 'error.main' }}>
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

      {/* Search and Filter */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          placeholder="Search deals..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mr: 2,
            flexGrow: 1,
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00b8a9',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00b8a9',
              },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Filter">
          <IconButton
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
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

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
          <Tab label="Active" {...a11yProps(1)} />
          <Tab label="Won" {...a11yProps(2)} />
          <Tab label="Lost" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={0} sx={{ width: '100%', borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Deal Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Deal Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((deal) => (
                    <TableRow
                      key={deal.id}
                      onClick={() => handleRowClick(deal.id)}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)', cursor: 'pointer' }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ mr: 0.75, color: 'primary.main', fontSize: '1rem' }} />
                          <Typography variant="body2" fontWeight="medium" fontSize="0.85rem">{deal.dealName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{deal.customerName}</TableCell>
                      <TableCell>{formatCurrency(deal.totalAmount, deal.currencyType)}</TableCell>
                      <TableCell>
                        {/* Log the status value outside of JSX */}
                        <React.Fragment>
                          {(() => { console.log('Deal status in render:', deal.id, deal.status); return null; })()}
                        </React.Fragment>
                        <Chip
                          label={deal.status !== undefined ? getStatusLabel(deal.status) : 'Unknown'}
                          color={(deal.status !== undefined ? getStatusColor(deal.status) : 'default') as any}
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
                      <TableCell>
                        {new Date(deal.dealDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, deal.id)}
                          sx={{ p: 0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredDeals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        No deals found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
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
          <Typography variant="body2" fontSize="0.85rem">
            Active deals will be shown here.
          </Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper elevation={0} sx={{ width: '100%', p: 3, borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Typography variant="body2" fontSize="0.85rem">
            Won deals will be shown here.
          </Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper elevation={0} sx={{ width: '100%', p: 3, borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Typography variant="body2" fontSize="0.85rem">
            Lost deals will be shown here.
          </Typography>
        </Paper>
      </TabPanel>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: {
            minWidth: 180,
            borderRadius: 1.5,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              fontSize: '0.85rem',
              py: 0.75
            }
          }
        }}
      >
        <MenuItem onClick={handleEditDeal}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>Edit Deal</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleViewDeal}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AttachMoneyIcon fontSize="small" sx={{ fontSize: '1rem' }} />
          </ListItemIcon>
          <ListItemText>Add Payment</ListItemText>
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
      </Menu>
    </Box>
  );
};

export default DealsList;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Add as AddIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
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
      id={`deal-tabpanel-${index}`}
      aria-labelledby={`deal-tab-${index}`}
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
    id: `deal-tab-${index}`,
    'aria-controls': `deal-tabpanel-${index}`,
  };
}

const DealDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDealDetails(id);
    }
  }, [id]);

  const fetchDealDetails = async (dealId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dealService.getDealById(dealId);
      
      console.log('Deal details response:', response);
      
      if (response.succeeded) {
        // The API response has a nested structure where the deal is in response.data.data
        console.log('Deal data from API:', response.data);
        
        // Log the deal status for debugging
        if (response.data) {
          console.log('Deal status in details:', response.data.status, 'type:', typeof response.data.status);
          
          // Set the deal from the nested data structure
          setDeal(response.data);
        } else {
          console.log('No deal data found in response');
          setError('No deal data found in response');
        }
      } else {
        setError(response.message || 'Failed to fetch deal details');
      }
    } catch (err: any) {
      console.error('Error fetching deal details:', err);
      setError(err.message || 'An error occurred while fetching deal details');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditDeal = () => {
    if (id) {
      navigate(`/deals/edit/${id}`);
    }
  };

  const handleBackToList = () => {
    navigate('/deals');
  };

  const getStatusLabel = (statusValue: any): string => {
    // If it's already a string, return it
    if (typeof statusValue === 'string' && isNaN(Number(statusValue))) {
      return statusValue;
    }
    
    // Convert to number if it's not already
    const numericStatus = typeof statusValue === 'number' ? statusValue : Number(statusValue);
    
    // Map numeric values to status labels
    switch (numericStatus) {
      case 0: return 'New';
      case 1: return 'OnHold';
      case 2: return 'Cancelled';
      case 3: return 'Won';
      case 4: return 'Lost';
      case 5: return 'PartiallyPaid';
      case 6: return 'FullyPaid';
      default: return `Unknown (${statusValue})`;
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!deal) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Deal not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
            sx={{ mr: 2 }}
          >
            Back to Deals
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Deal Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditDeal}
          sx={{
            bgcolor: '#00b8a9',
            '&:hover': {
              bgcolor: '#00a99d',
            }
          }}
        >
          Edit Deal
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {deal.dealName}
          </Typography>
          {/* Log the status value for debugging */}
          <React.Fragment>
            {(() => { console.log('Deal status in DealDetails:', deal.id, deal.status); return null; })()}
          </React.Fragment>
          <Chip
            label={deal.status !== undefined ? getStatusLabel(deal.status) : 'Unknown'}
            color={(deal.status !== undefined ? getStatusColor(deal.status) : 'default') as any}
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {deal.customerName}
            </Typography>
            
            {deal.customerEmail && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {deal.customerEmail}
                </Typography>
              </>
            )}
            
            {deal.customerPhone && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {deal.customerPhone}
                </Typography>
              </>
            )}
            
            {deal.customerAddress && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {deal.customerAddress}
                </Typography>
              </>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: '#00b8a9', fontWeight: 600 }}>
              {formatCurrency(deal.totalAmount, deal.currencyType)}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Paid Amount
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatCurrency(deal.paidAmount, deal.currencyType)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Remaining Amount
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatCurrency(deal.remainingAmount, deal.currencyType)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tax Percentage
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {deal.taxPercentage}%
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Discount Amount
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatCurrency(deal.discountAmount, deal.currencyType)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Deal Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(deal.dealDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Due Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(deal.paymentDueDate)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="deal details tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Payments" icon={<ReceiptIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Activities" icon={<HistoryIcon />} iconPosition="start" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={0} sx={{ width: '100%', borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Payment History
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#00b8a9',
                '&:hover': {
                  bgcolor: '#00a99d',
                }
              }}
            >
              Add Payment
            </Button>
          </Box>
          
          <Divider />
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Transaction Reference</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deal.payments && deal.payments.length > 0 ? (
                  deal.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount, deal.currencyType)}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>{payment.transactionReference || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.isVerified ? 'Verified' : 'Pending'}
                          color={payment.isVerified ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={0} sx={{ width: '100%', borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Activity History
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#00b8a9',
                '&:hover': {
                  bgcolor: '#00a99d',
                }
              }}
            >
              Add Activity
            </Button>
          </Box>
          
          <Divider />
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deal.activities && deal.activities.length > 0 ? (
                  deal.activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.activityDate)}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>{activity.userId || 'System'}</TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No activities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default DealDetails;

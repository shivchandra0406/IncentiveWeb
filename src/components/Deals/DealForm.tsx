import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid as MuiGrid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  Switch,
  IconButton,
  FormControlLabel,
  alpha,
} from '@mui/material';

// Create a Grid component that accepts 'item' prop
const Grid = MuiGrid as any;
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dealService from '../../infrastructure/deals/DealServiceImpl';
import teamService from '../../infrastructure/teams/TeamServiceImpl';
import incentiveRuleService from '../../infrastructure/incentiveRules/IncentiveRuleServiceImpl';
import userService from '../../infrastructure/users/UserServiceImpl';
// We don't need enhancedApiClient anymore as we're using the service
import { DealStatus, CurrencyType } from '../../core/models/deal';
// No need for enum mappers, we'll handle the mapping directly
import type { Team } from '../../core/models/incentivePlanTypes';
import type { CreateDealRequest, UpdateDealRequest } from '../../core/models/deal';

interface FormErrors {
  dealName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount?: string;
  currencyType?: string;
  taxPercentage?: string;
  discountAmount?: string;
  status?: string;
  dealDate?: string;
  paymentDueDate?: string;
  source?: string;
  referralName?: string;
  referralEmail?: string;
  referralPhone?: string;
  referralCommission?: string;
  recurringFrequencyMonths?: string;
}

const DealForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [dealName, setDealName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [paidAmount, setPaidAmount] = useState<number | ''>(0);
  const [remainingAmount, setRemainingAmount] = useState<number | ''>('');
  const [currencyType, setCurrencyType] = useState<CurrencyType>(CurrencyType.Rupees);
  const [taxPercentage, setTaxPercentage] = useState<number | ''>(0);
  const [discountAmount, setDiscountAmount] = useState<number | ''>(0);
  // Initialize status as a number to match the API response type
  const [status, setStatus] = useState<number>(DealStatus.New);
  const [dealDate, setDealDate] = useState<Date | null>(new Date());
  const [paymentDueDate, setPaymentDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [referralName, setReferralName] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [referralPhone, setReferralPhone] = useState('');
  const [referralCommission, setReferralCommission] = useState<number | ''>('');
  const [isReferralCommissionPaid, setIsReferralCommissionPaid] = useState(false);
  const [recurringFrequencyMonths, setRecurringFrequencyMonths] = useState<number | ''>('');
  const [teamId, setTeamId] = useState<string | ''>('');
  const [incentiveRuleId, setIncentiveRuleId] = useState<string | ''>('');
  const [source, setSource] = useState(''); // Adding source back as it's required by the API

  // Data state
  const [teams, setTeams] = useState<Team[]>([]);
  const [incentiveRules, setIncentiveRules] = useState<any[]>([]);
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingIncentiveRules, setLoadingIncentiveRules] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [closedByUserId, setClosedByUserId] = useState<string | ''>('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Calculate remaining amount based on total and paid amounts
  const calculateRemainingAmount = (total: number, paid: number) => {
    return Math.max(0, total - paid);
  };

  // Calculate the remaining amount based on total amount and paid amount
  useEffect(() => {
    if (typeof totalAmount === 'number') {
      const paid = typeof paidAmount === 'number' ? paidAmount : 0;
      setRemainingAmount(totalAmount - paid);
    }
  }, [totalAmount, paidAmount]);

  useEffect(() => {
    if (isEditMode && id) {
      fetchDealDetails(id);
    }

    // Fetch teams, incentive rules, and users regardless of mode
    fetchTeams();
    fetchIncentiveRules();
    fetchUsers();
  }, [id, isEditMode]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getUsersMinimal();
      if (response.succeeded && response.data) {
        setUsers(response.data);
      } else {
        console.error('API returned error:', response.message);
        setError('Failed to fetch users. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setLoadingTeams(true);
      const response = await teamService.getTeamsMinimal();
      if (response.succeeded && response.data) {
        setTeams(response.data);
      } else {
        console.error('API returned error:', response.message);
        setError('Failed to fetch teams. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams. Please try again.');
    } finally {
      setLoadingTeams(false);
    }
  };

  const fetchIncentiveRules = async () => {
    try {
      setLoadingIncentiveRules(true);
      const response = await incentiveRuleService.getIncentiveRulesMinimal();
      if (response.succeeded && response.data) {
        setIncentiveRules(response.data);
      } else {
        console.error('API returned error:', response.message);
        setError('Failed to fetch incentive plans. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching incentive plans:', error);
      setError('Failed to fetch incentive plans. Please try again.');
    } finally {
      setLoadingIncentiveRules(false);
    }
  };

  // Debug function to log status value
  const logStatus = (label: string, value: any) => {
    console.log(`STATUS DEBUG [${label}]:`, value, typeof value);
  };

  // Debug function to log currency value
  const logCurrency = (label: string, value: any) => {
    console.log(`CURRENCY DEBUG [${label}]:`, value, typeof value);
  };

  // Log initial state values
  useEffect(() => {
    logStatus('Initial state', status);
    logCurrency('Initial state', currencyType);
  }, []);

  const fetchDealDetails = async (dealId: string) => {
    try {
      setLoading(true);
      // Use the service as before, but we'll handle the status and currency manually
      const response = await dealService.getDealById(dealId);
      console.log('FULL API RESPONSE:', JSON.stringify(response, null, 2));

      if (response.succeeded && response.data) {
        // Get the deal data
        const deal = response.data;
        console.log('Deal data from API:', deal);

        // Populate form fields with deal data
        setDealName(deal.dealName);
        setCustomerName(deal.customerName);
        setCustomerEmail(deal.customerEmail || '');
        setCustomerPhone(deal.customerPhone || '');
        setCustomerAddress(deal.customerAddress || '');
        setTotalAmount(deal.totalAmount);
        setPaidAmount(deal.paidAmount || 0);
        setRemainingAmount(deal.remainingAmount || deal.totalAmount);

        // Handle currency type mapping
        // API returns 0 for Rupees, 1 for Dollar
        // CurrencyType enum is numeric-based (0, 1)
        logCurrency('Raw currency from API', deal.currencyType);

        // Get the raw currency value
        const rawCurrency = deal.currencyType;

        // Convert the currency to a number
        let numericCurrency: number;

        // Check if it's already a number
        if (typeof rawCurrency === 'number') {
          numericCurrency = rawCurrency;
        }
        // If it's a string that can be parsed as a number
        else if (typeof rawCurrency === 'string' && !isNaN(Number(rawCurrency))) {
          numericCurrency = Number(rawCurrency);
        }
        // If it's a CurrencyType enum value (the service might have converted it)
        else if (typeof rawCurrency === 'string') {
          // Find the numeric value that corresponds to this string
          numericCurrency = rawCurrency === 'Rupees' ? 0 : 1;
        }
        // Default to Rupees (0) if we can't determine the currency
        else {
          numericCurrency = 0;
        }

        logCurrency('Final numeric currency', numericCurrency);

        // Set the currency directly as a number
        setCurrencyType(numericCurrency);

        setTaxPercentage(deal.taxPercentage || 0);
        setDiscountAmount(deal.discountAmount || 0);

        // Handle status mapping
        // API returns numeric values (0, 1, 2, etc.)
        logStatus('Raw value from API', deal.status);

        // IMPORTANT FIX: The DealServiceImpl is converting the numeric status from the API to a string enum
        // We need to convert it back to a number for our form

        // Get the raw status value
        const rawStatus = deal.status;
        logStatus('Raw status from API', rawStatus);

        // Convert the status to a number based on the DealStatus enum
        let numericStatus: number;

        // Check if it's already a number
        if (typeof rawStatus === 'number') {
          numericStatus = rawStatus;
        }
        // If it's a string that can be parsed as a number
        else if (typeof rawStatus === 'string' && !isNaN(Number(rawStatus))) {
          numericStatus = Number(rawStatus);
        }
        // If it's a DealStatus enum value (the service might have converted it)
        else if (typeof rawStatus === 'string') {
          // Find the numeric value that corresponds to this string in the DealStatus enum
          const statusEntry = Object.entries(DealStatus).find(([key, value]) =>
            key === rawStatus || value === rawStatus
          );
          numericStatus = statusEntry ? Number(statusEntry[1]) : 0;
        }
        // Default to New (0) if we can't determine the status
        else {
          numericStatus = 0;
        }

        logStatus('Final numeric status', numericStatus);

        // Set the status directly as a number
        setStatus(numericStatus);

        // Verify what was set and log helpful debug information
        setTimeout(() => {
          logStatus('After setState', status);
          // Log what will be displayed in the dropdown
          const statusText = DealStatus[numericStatus];
          console.log(`Status ${numericStatus} should display as: ${statusText}`);
          console.log('Current dropdown value:', status);
          console.log('Expected dropdown display:', DealStatus[status]);
        }, 0);

        setDealDate(deal.dealDate ? new Date(deal.dealDate) : new Date());
        setPaymentDueDate(deal.paymentDueDate ? new Date(deal.paymentDueDate) : null);
        setNotes(deal.notes || '');
        setReferralName(deal.referralName || '');
        setReferralEmail(deal.referralEmail || '');
        setReferralPhone(deal.referralPhone || '');
        setReferralCommission(deal.referralCommission || '');
        setIsReferralCommissionPaid(deal.isReferralCommissionPaid || false);
        setRecurringFrequencyMonths(deal.recurringFrequencyMonths || '');
        setTeamId(deal.teamId || '');
        setIncentiveRuleId(deal.incentivePlanId || '');
        setSource(deal.source || '');
        setClosedByUserId(deal.closedByUserId || '');
      } else {
        console.error('Failed to fetch deal details:', response.message);
        // Show error message
      }
    } catch (error) {
      console.error('Error fetching deal details:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  // This function is called in handleSubmit to validate the form before submission
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Only validate the most essential fields
    if (!dealName.trim()) errors.dealName = 'Deal name is required';
    if (dealName.length > 200) errors.dealName = 'Deal name must be less than 200 characters';

    // Make other validations less strict
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.customerEmail = 'Invalid email format';
    }

    if (typeof totalAmount === 'number' && totalAmount < 0) {
      errors.totalAmount = 'Total amount must be positive';
    }

    if (typeof taxPercentage === 'number' && (taxPercentage < 0 || taxPercentage > 100)) {
      errors.taxPercentage = 'Tax percentage must be between 0 and 100';
    }

    if (typeof discountAmount === 'number' && discountAmount < 0) {
      errors.discountAmount = 'Discount amount must be positive';
    }

    // Optional validations for referral fields
    if (referralEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referralEmail)) {
      errors.referralEmail = 'Invalid referral email format';
    }

    if (referralCommission !== '' && typeof referralCommission === 'number' && referralCommission < 0) {
      errors.referralCommission = 'Referral commission must be positive';
    }

    if (recurringFrequencyMonths !== '' && typeof recurringFrequencyMonths === 'number' &&
        (recurringFrequencyMonths < 0 || recurringFrequencyMonths > 60)) {
      errors.recurringFrequencyMonths = 'Recurring frequency must be between 0 and 60 months';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked');
    // Re-enable validation
    const isValid = validateForm();
    console.log('Form validation result:', isValid, 'Form errors:', formErrors);

    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isEditMode && id) {
        // Update existing deal
        const updateData: UpdateDealRequest = {
          id, // Include the ID in the payload
          dealName,
          customerName,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          customerAddress: customerAddress || undefined,
          closedByUserId: closedByUserId || undefined,
          paidAmount: paidAmount || 0, // Include paidAmount
          remainingAmount: remainingAmount || 0, // Include remainingAmount
          totalAmount: typeof totalAmount === 'number' ? totalAmount : 0.01,
          currencyType: currencyType, // Using the enum value directly
          taxPercentage: typeof taxPercentage === 'number' ? taxPercentage : 0,
          discountAmount: typeof discountAmount === 'number' ? discountAmount : 0,
          status: status, // Using the enum value directly
          closedDate: status === DealStatus.Won || status === DealStatus.Lost ? new Date().toISOString() : undefined,
          paymentDueDate: paymentDueDate?.toISOString(),
          teamId: teamId || undefined,
          referralName: referralName || undefined,
          referralEmail: referralEmail || undefined,
          referralPhone: referralPhone || undefined,
          referralCommission: typeof referralCommission === 'number' ? referralCommission : 0,
          isReferralCommissionPaid,
          source,
          incentivePlanId: incentiveRuleId || undefined,
          notes: notes || undefined,
          recurringFrequencyMonths: typeof recurringFrequencyMonths === 'number' ? recurringFrequencyMonths : undefined
        };

        const response = await dealService.updateDeal(id, updateData);
        if (response.succeeded) {
          setSuccess('Deal updated successfully!');
        } else {
          setError(response.message || 'Failed to update deal');
        }
      } else {
        // Create new deal
        const createData: CreateDealRequest = {
          dealName,
          customerName,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          customerAddress: customerAddress || undefined,
          closedByUserId: closedByUserId || undefined,
          totalAmount: typeof totalAmount === 'number' ? totalAmount : 0.01,
          currencyType: currencyType, // Using the enum value directly
          taxPercentage: typeof taxPercentage === 'number' ? taxPercentage : 0,
          discountAmount: typeof discountAmount === 'number' ? discountAmount : 0,
          status: status, // Using the enum value directly
          dealDate: dealDate ? dealDate.toISOString() : new Date().toISOString(),
          paymentDueDate: paymentDueDate?.toISOString(),
          teamId: teamId || undefined,
          referralName: referralName || undefined,
          referralEmail: referralEmail || undefined,
          referralPhone: referralPhone || undefined,
          referralCommission: typeof referralCommission === 'number' ? referralCommission : 0,
          source,
          incentivePlanId: incentiveRuleId || undefined,
          notes: notes || undefined,
          recurringFrequencyMonths: typeof recurringFrequencyMonths === 'number' ? recurringFrequencyMonths : undefined
        };

        const response = await dealService.createDeal(createData);
        if (response.succeeded) {
          setSuccess('Deal created successfully!');
        } else {
          setError(response.message || 'Failed to create deal');
        }
      }

      // Navigate back to deals list after a short delay
      setTimeout(() => {
        navigate('/deals');
      }, 2000);
    } catch (error) {
      console.error('Error saving deal:', error);
      setError('An error occurred while saving the deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        {isEditMode ? 'Edit Deal' : 'Create New Deal'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Section 1: Deal Information */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', width: '100%', overflow: 'visible', maxWidth: 'none' }}>
        <CardContent sx={{ p: 3, width: '100%', overflow: 'visible', maxWidth: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Deal Information
            </Typography>
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Deal Name"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              error={!!formErrors.dealName}
              helperText={formErrors.dealName}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <FormControl
              fullWidth
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  width: '100%',
                },
                '& .MuiSelect-select': {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16.5px 14px'
                }
              }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={Number(status)}
                onChange={(e) => {
                  const newStatus = Number(e.target.value);
                  logStatus('Dropdown onChange', newStatus);
                  setStatus(newStatus);
                  // Log after state update
                  setTimeout(() => {
                    logStatus('After dropdown change', status);
                  }, 0);
                }}
                label="Status"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&:hover': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                {/* Hardcoded status values for clarity */}
                <MenuItem value={0}>New</MenuItem>
                <MenuItem value={1}>OnHold</MenuItem>
                <MenuItem value={2}>Cancelled</MenuItem>
                <MenuItem value={3}>Won</MenuItem>
                <MenuItem value={4}>Lost</MenuItem>
                <MenuItem value={5}>PartiallyPaid</MenuItem>
                <MenuItem value={6}>FullyPaid</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deal Date"
                value={dealDate}
                onChange={(newValue) => setDealDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!formErrors.dealDate,
                    helperText: formErrors.dealDate,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00b8a9',
                        },
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>

            <FormControl
              fullWidth
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  width: '100%',
                },
                '& .MuiSelect-select': {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16.5px 14px'
                }
              }}>
              <InputLabel>Team</InputLabel>
              <Select
                value={teamId || ''}
                onChange={(e) => setTeamId(e.target.value)}
                label="Team"
                disabled={loadingTeams}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&:hover': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                <MenuItem value="">None</MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  width: '100%',
                },
                '& .MuiSelect-select': {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16.5px 14px'
                }
              }}>
              <InputLabel>Incentive Rule</InputLabel>
              <Select
                value={incentiveRuleId || ''}
                onChange={(e) => setIncentiveRuleId(e.target.value)}
                label="Incentive Rule"
                disabled={loadingIncentiveRules}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&:hover': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                <MenuItem value="">None</MenuItem>
                {incentiveRules.map((rule) => (
                  <MenuItem key={rule.id} value={rule.id}>
                    {rule.planName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  width: '100%',
                },
                '& .MuiSelect-select': {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16.5px 14px'
                }
              }}>
              <InputLabel>Closed User</InputLabel>
              <Select
                value={closedByUserId || ''}
                onChange={(e) => setClosedByUserId(e.target.value)}
                label="Closed User"
                disabled={loadingUsers}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&:hover': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                <MenuItem value="">None</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Active status is controlled by the Deal Status dropdown */}
          </Box>
        </CardContent>
      </Card>

      {/* Section 2: Customer Information */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', width: '100%', overflow: 'visible', maxWidth: 'none' }}>
        <CardContent sx={{ p: 3, width: '100%', overflow: 'visible', maxWidth: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Customer Information
            </Typography>
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              error={!!formErrors.customerName}
              helperText={formErrors.customerName}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              error={!!formErrors.customerEmail}
              helperText={formErrors.customerEmail}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Customer Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              error={!!formErrors.customerPhone}
              helperText={formErrors.customerPhone}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Customer Address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Section 3: Financial Details */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', width: '100%', overflow: 'visible', maxWidth: 'none' }}>
        <CardContent sx={{ p: 3, width: '100%', overflow: 'visible', maxWidth: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Financial Details
            </Typography>
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl
              fullWidth
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  width: '100%',
                },
                '& .MuiSelect-select': {
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16.5px 14px'
                }
              }} required>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currencyType}
                onChange={(e) => setCurrencyType(e.target.value as CurrencyType)}
                label="Currency"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&:hover': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                {/* Filter out non-numeric keys since CurrencyType is now numeric */}
                {Object.entries(CurrencyType)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, _]) => (
                    <MenuItem key={key} value={Number(key)}>
                      {Number(key) === CurrencyType.Rupees ? 'Rupees (₹)' : 'Dollar ($)'}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Total Amount"
              type="number"
              value={totalAmount}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setTotalAmount(value);
                if (typeof value === 'number' && typeof paidAmount === 'number') {
                  setRemainingAmount(calculateRemainingAmount(value, paidAmount));
                }
              }}
              error={!!formErrors.totalAmount}
              helperText={formErrors.totalAmount}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencyType === CurrencyType.Rupees ? '₹' : '$'}
                  </InputAdornment>
                ),
                inputProps: { min: 0.01, step: 0.01 }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Paid Amount"
              type="number"
              value={paidAmount}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setPaidAmount(value);
                if (typeof totalAmount === 'number' && typeof value === 'number') {
                  setRemainingAmount(calculateRemainingAmount(totalAmount, value));
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencyType === CurrencyType.Rupees ? '₹' : '$'}
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Remaining Amount"
              type="number"
              value={remainingAmount}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencyType === CurrencyType.Rupees ? '₹' : '$'}
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Payment Due Date"
                value={paymentDueDate}
                onChange={(newValue) => setPaymentDueDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.paymentDueDate,
                    helperText: formErrors.paymentDueDate,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00b8a9',
                        },
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Recurring Frequency (Months)"
              type="number"
              value={recurringFrequencyMonths}
              onChange={(e) => setRecurringFrequencyMonths(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.recurringFrequencyMonths}
              helperText={formErrors.recurringFrequencyMonths || 'Leave empty if not recurring'}
              InputProps={{
                inputProps: { min: 1, max: 60, step: 1 }
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Section 4: Referral Information */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', width: '100%', overflow: 'visible', maxWidth: 'none' }}>
        <CardContent sx={{ p: 3, width: '100%', overflow: 'visible', maxWidth: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Referral Information
            </Typography>
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Referral Name"
              value={referralName}
              onChange={(e) => setReferralName(e.target.value)}
              error={!!formErrors.referralName}
              helperText={formErrors.referralName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Referral Email"
              type="email"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
              error={!!formErrors.referralEmail}
              helperText={formErrors.referralEmail}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Referral Phone"
              value={referralPhone}
              onChange={(e) => setReferralPhone(e.target.value)}
              error={!!formErrors.referralPhone}
              helperText={formErrors.referralPhone}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Referral Commission"
              type="number"
              value={referralCommission}
              onChange={(e) => setReferralCommission(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.referralCommission}
              helperText={formErrors.referralCommission}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencyType === CurrencyType.Rupees ? '₹' : currencyType === CurrencyType.Dollar ? '$' : '$'}
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isReferralCommissionPaid}
                  onChange={(e) => setIsReferralCommissionPaid(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00b8a9',
                      '&:hover': {
                        backgroundColor: alpha('#00b8a9', 0.1),
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00b8a9',
                    },
                  }}
                />
              }
              label="Referral Commission Paid"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Section 5: Notes */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', width: '100%', overflow: 'visible', maxWidth: 'none' }}>
        <CardContent sx={{ p: 3, width: '100%', overflow: 'visible', maxWidth: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notes
            </Typography>
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={5}
              placeholder="Add any additional information about the deal here"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  '&:hover fieldset': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8a9',
                  },
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4, width: '100%', p: 1.5 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/deals')}
          sx={{
            mr: 2,
            minWidth: '150px',
            borderColor: '#00b8a9',
            color: '#00b8a9',
            padding: '10px 24px',
            '&:hover': {
              borderColor: '#00a99d',
              backgroundColor: 'rgba(0, 184, 169, 0.08)',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: '#00b8a9',
            padding: '10px 24px',
            minWidth: '150px',
            '&:hover': {
              bgcolor: '#00a99d',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 184, 169, 0.5)',
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            isEditMode ? 'Update' : 'Create'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DealForm;

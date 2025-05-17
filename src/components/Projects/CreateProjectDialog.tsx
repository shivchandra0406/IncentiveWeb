import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
  CircularProgress,
  Typography,
  Grid,
  MenuItem,
  Divider,
  InputAdornment
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import projectService from '../../infrastructure/projects/ProjectServiceImpl';
import type { Project } from '../../core/models/incentivePlanTypes';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ open, onClose, onProjectCreated }) => {
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [area, setArea] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [bathrooms, setBathrooms] = useState<number | ''>('');
  const [dateListed, setDateListed] = useState<Date | null>(new Date());
  const [status, setStatus] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentContact, setAgentContact] = useState('');
  const [imagesMedia, setImagesMedia] = useState('');
  const [amenities, setAmenities] = useState('');
  const [yearBuilt, setYearBuilt] = useState<number | ''>('');
  const [ownershipDetails, setOwnershipDetails] = useState('');
  const [listingExpiryDate, setListingExpiryDate] = useState<Date | null>(new Date());
  const [mlsListingId, setMlsListingId] = useState('');
  const [totalValue, setTotalValue] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);

  // Property type options
  const propertyTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Land',
    'Multi-family',
    'Special Purpose'
  ];

  // Status options
  const statusOptions = [
    'Available',
    'Under Contract',
    'Sold',
    'Pending',
    'Off Market'
  ];

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Project name is required';
    }

    if (!location.trim()) {
      errors.location = 'Location is required';
    }

    if (!propertyType) {
      errors.propertyType = 'Property type is required';
    }

    if (price === '' || price < 0) {
      errors.price = 'Valid price is required';
    }

    if (area === '' || area <= 0) {
      errors.area = 'Valid area is required';
    }

    if (bedrooms === '' || bedrooms < 0) {
      errors.bedrooms = 'Valid number of bedrooms is required';
    }

    if (bathrooms === '' || bathrooms < 0) {
      errors.bathrooms = 'Valid number of bathrooms is required';
    }

    if (!status) {
      errors.status = 'Status is required';
    }

    if (!agentName.trim()) {
      errors.agentName = 'Agent name is required';
    }

    if (!agentContact.trim()) {
      errors.agentContact = 'Agent contact is required';
    }

    if (yearBuilt === '' || yearBuilt <= 0) {
      errors.yearBuilt = 'Valid year built is required';
    }

    if (!mlsListingId.trim()) {
      errors.mlsListingId = 'MLS listing ID is required';
    }

    if (totalValue === '' || totalValue < 0) {
      errors.totalValue = 'Valid total value is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await projectService.createProject({
        name,
        description,
        location,
        propertyType,
        price: price as number,
        area: area as number,
        bedrooms: bedrooms as number,
        bathrooms: bathrooms as number,
        dateListed: dateListed ? dateListed.toISOString() : new Date().toISOString(),
        status,
        agentName,
        agentContact,
        imagesMedia,
        amenities,
        yearBuilt: yearBuilt as number,
        ownershipDetails,
        listingExpiryDate: listingExpiryDate ? listingExpiryDate.toISOString() : new Date().toISOString(),
        mlsListingId,
        totalValue: totalValue as number,
        isActive
      });

      if (response.succeeded) {
        onProjectCreated(response.data);
        resetForm();
        onClose();
      } else {
        setError(response.message || 'Failed to create project');
      }
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLocation('');
    setPropertyType('');
    setPrice('');
    setArea('');
    setBedrooms('');
    setBathrooms('');
    setDateListed(new Date());
    setStatus('');
    setAgentName('');
    setAgentContact('');
    setImagesMedia('');
    setAmenities('');
    setYearBuilt('');
    setOwnershipDetails('');
    setListingExpiryDate(new Date());
    setMlsListingId('');
    setTotalValue('');
    setIsActive(true);
    setFormErrors({});
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ '& .MuiDialog-paper': { maxHeight: '90vh' } }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create New Property Project
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Basic Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={2}
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
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Property Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location *"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={!!formErrors.location}
                helperText={formErrors.location}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Property Type *"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                error={!!formErrors.propertyType}
                helperText={formErrors.propertyType}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        width: '250px', // Wider dropdown menu
                        maxHeight: '300px' // Taller dropdown for more options
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '& .MuiSelect-select': {
                    minWidth: '150px', // Ensure the selected value has enough space
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              >
                {propertyTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price *"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.price}
                helperText={formErrors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Area *"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.area}
                helperText={formErrors.area}
                InputProps={{
                  endAdornment: <InputAdornment position="end">sq ft</InputAdornment>,
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bedrooms *"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.bedrooms}
                helperText={formErrors.bedrooms}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bathrooms *"
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.bathrooms}
                helperText={formErrors.bathrooms}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Listed"
                  value={dateListed}
                  onChange={(newValue) => setDateListed(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status *"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                error={!!formErrors.status}
                helperText={formErrors.status}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        width: '250px', // Wider dropdown menu
                        maxHeight: '300px' // Taller dropdown for more options
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00b8a9',
                    },
                  },
                  '& .MuiSelect-select': {
                    minWidth: '150px', // Ensure the selected value has enough space
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Agent Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Agent Name *"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                error={!!formErrors.agentName}
                helperText={formErrors.agentName}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Agent Contact *"
                value={agentContact}
                onChange={(e) => setAgentContact(e.target.value)}
                error={!!formErrors.agentContact}
                helperText={formErrors.agentContact}
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
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Additional Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Images/Media URLs"
                value={imagesMedia}
                onChange={(e) => setImagesMedia(e.target.value)}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amenities"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year Built *"
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.yearBuilt}
                helperText={formErrors.yearBuilt}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ownership Details"
                value={ownershipDetails}
                onChange={(e) => setOwnershipDetails(e.target.value)}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Listing Expiry Date"
                  value={listingExpiryDate}
                  onChange={(newValue) => setListingExpiryDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="MLS Listing ID *"
                value={mlsListingId}
                onChange={(e) => setMlsListingId(e.target.value)}
                error={!!formErrors.mlsListingId}
                helperText={formErrors.mlsListingId}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Value *"
                type="number"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.totalValue}
                helperText={formErrors.totalValue}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00b8a9',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 184, 169, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#00b8a9',
                      },
                    }}
                  />
                }
                label="Active"
                sx={{ ml: 0 }}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#00b8a9',
            '&:hover': {
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
            '&:hover': {
              bgcolor: '#00a99d',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 184, 169, 0.5)',
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectDialog;

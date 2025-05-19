import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import projectService from '../../infrastructure/projects/ProjectServiceImpl';
import type { Project } from '../../core/models/incentivePlanTypes';

interface FormErrors {
  name?: string;
  description?: string;
  location?: string;
  propertyType?: string;
  price?: string;
  area?: string;
  bedrooms?: string;
  bathrooms?: string;
  dateListed?: string;
  status?: string;
  agentName?: string;
  agentContact?: string;
  yearBuilt?: string;
  listingExpiryDate?: string;
  mlsListingId?: string;
  totalValue?: string;
}

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

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

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  useEffect(() => {
    if (isEditMode && id) {
      fetchProjectDetails(id);
    }
  }, [id, isEditMode]);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const project = await projectService.getProjectById(projectId);

      if (project) {
        setName(project.name);
        setDescription(project.description);
        setLocation(project.location || '');
        setPropertyType(project.propertyType || '');
        setPrice(project.price || '');
        setArea(project.area || '');
        setBedrooms(project.bedrooms || '');
        setBathrooms(project.bathrooms || '');
        setDateListed(project.dateListed ? new Date(project.dateListed) : new Date());
        setStatus(project.status || '');
        setAgentName(project.agentName || '');
        setAgentContact(project.agentContact || '');
        setImagesMedia(project.imagesMedia || '');
        setAmenities(project.amenities || '');
        setYearBuilt(project.yearBuilt || '');
        setOwnershipDetails(project.ownershipDetails || '');
        setListingExpiryDate(project.listingExpiryDate ? new Date(project.listingExpiryDate) : new Date());
        setMlsListingId(project.mlsListingId || '');
        setTotalValue(project.totalValue || '');
        setIsActive(project.isActive);
      } else {
        setError('Failed to fetch project details');
      }
    } catch (err: any) {
      console.error('Error fetching project details:', err);
      setError(err.message || 'An error occurred while fetching project details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!name.trim()) errors.name = 'Project name is required';
    if (!location.trim()) errors.location = 'Location is required';
    if (!propertyType) errors.propertyType = 'Property type is required';
    if (price === '') errors.price = 'Price is required';
    if (typeof price === 'number' && price < 0) errors.price = 'Price must be positive';
    if (area === '') errors.area = 'Area is required';
    if (typeof area === 'number' && area < 0) errors.area = 'Area must be positive';
    if (bedrooms === '') errors.bedrooms = 'Number of bedrooms is required';
    if (typeof bedrooms === 'number' && bedrooms < 0) errors.bedrooms = 'Bedrooms must be positive';
    if (bathrooms === '') errors.bathrooms = 'Number of bathrooms is required';
    if (typeof bathrooms === 'number' && bathrooms < 0) errors.bathrooms = 'Bathrooms must be positive';
    if (!dateListed) errors.dateListed = 'Listing date is required';
    if (!status) errors.status = 'Status is required';
    if (!agentName.trim()) errors.agentName = 'Agent name is required';
    if (!agentContact.trim()) errors.agentContact = 'Agent contact is required';
    if (yearBuilt !== '' && typeof yearBuilt === 'number' && yearBuilt < 0) errors.yearBuilt = 'Year built must be positive';
    if (!listingExpiryDate) errors.listingExpiryDate = 'Listing expiry date is required';
    if (totalValue !== '' && typeof totalValue === 'number' && totalValue < 0) errors.totalValue = 'Total value must be positive';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const projectData = {
        name,
        description,
        location,
        propertyType,
        price: typeof price === 'number' ? price : 0,
        area: typeof area === 'number' ? area : 0,
        bedrooms: typeof bedrooms === 'number' ? bedrooms : 0,
        bathrooms: typeof bathrooms === 'number' ? bathrooms : 0,
        dateListed: dateListed ? dateListed.toISOString() : new Date().toISOString(),
        status,
        agentName,
        agentContact,
        imagesMedia,
        amenities,
        yearBuilt: typeof yearBuilt === 'number' ? yearBuilt : 0,
        ownershipDetails,
        listingExpiryDate: listingExpiryDate ? listingExpiryDate.toISOString() : new Date().toISOString(),
        mlsListingId,
        totalValue: typeof totalValue === 'number' ? totalValue : 0,
        isActive
      };

      let response;

      if (isEditMode && id) {
        response = await projectService.updateProject(id, projectData);
      } else {
        response = await projectService.createProject(projectData);
      }

      if (response.succeeded) {
        setSuccess(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        setTimeout(() => {
          navigate('/projects');
        }, 1500);
      } else {
        setError(response.message || `Failed to ${isEditMode ? 'update' : 'create'} project`);
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, err);
      setError(err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the project`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {isEditMode ? 'Edit' : 'Create'} Project
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

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Basic Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!formErrors.propertyType}>
              <InputLabel>Property Type *</InputLabel>
              <Select
                value={propertyType}
                label="Property Type *"
                onChange={(e) => setPropertyType(e.target.value)}
                sx={{
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {formErrors.propertyType && <FormHelperText>{formErrors.propertyType}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Location & Property Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="MLS Listing ID"
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.price}
              helperText={formErrors.price}
              InputProps={{
                inputProps: { min: 0 }
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Value"
              type="number"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.totalValue}
              helperText={formErrors.totalValue}
              InputProps={{
                inputProps: { min: 0 }
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Area (sq ft) *"
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.area}
              helperText={formErrors.area}
              InputProps={{
                inputProps: { min: 0 }
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year Built"
              type="number"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.yearBuilt}
              helperText={formErrors.yearBuilt}
              InputProps={{
                inputProps: { min: 0 }
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bedrooms *"
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.bedrooms}
              helperText={formErrors.bedrooms}
              InputProps={{
                inputProps: { min: 0 }
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bathrooms *"
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.bathrooms}
              helperText={formErrors.bathrooms}
              InputProps={{
                inputProps: { min: 0 }
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
            <TextField
              fullWidth
              label="Amenities"
              multiline
              rows={2}
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

          <Grid item xs={12}>
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Images/Media URLs"
              multiline
              rows={2}
              value={imagesMedia}
              onChange={(e) => setImagesMedia(e.target.value)}
              placeholder="Enter comma-separated URLs for images or media files"
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
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Listing Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!formErrors.status}>
              <InputLabel>Status *</InputLabel>
              <Select
                value={status}
                label="Status *"
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00b8a9',
                  },
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
              {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Active Listing"
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date Listed *"
                value={dateListed}
                onChange={(newValue) => setDateListed(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.dateListed,
                    helperText: formErrors.dateListed,
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

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Listing Expiry Date *"
                value={listingExpiryDate}
                onChange={(newValue) => setListingExpiryDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.listingExpiryDate,
                    helperText: formErrors.listingExpiryDate,
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/projects')}
          sx={{ mr: 2 }}
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
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            'Update Project'
          ) : (
            'Create Project'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;

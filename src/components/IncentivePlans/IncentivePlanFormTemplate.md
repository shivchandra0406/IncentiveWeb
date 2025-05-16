# Incentive Plan Form Template

This template provides guidelines for creating consistent incentive plan forms with a clean, user-friendly vertical layout.

## Layout & Structure

All forms should follow this structure:

1. **Page Title** - Clear heading showing the plan type and whether it's create or edit mode
2. **Alert Messages** - Error and success alerts
3. **Sections** - Clearly separated with headings:
   - Basic Information
   - Plan-specific Configuration (Target, Role, Project, etc.)
   - Advanced Options (collapsible)
4. **Action Buttons** - Sticky footer with Cancel and Create/Update buttons

## Vertical Layout Guidelines

- All input fields and dropdowns must be vertically stacked (1 per row)
- Use consistent spacing between form elements (24px)
- Use consistent padding within sections (24px)
- Use light background color for sections
- Use rounded corners (borderRadius: 1)

## Field Styling

- All fields should have hover and focus states with the theme color (#00b8a9)
- Use consistent field width (fullWidth)
- Include proper validation and error messages
- Use clear, descriptive labels with asterisk (*) for required fields

## Advanced Options

- Use Accordion component for advanced options
- Only include relevant options for each plan type
- Keep the advanced options section collapsed by default
- Expand if any advanced options are selected when editing

## Action Buttons

- Use sticky footer with right-aligned buttons
- Cancel button: outlined style with theme color
- Create/Update button: contained style with theme color
- Include loading indicator in the Create/Update button
- Use consistent button padding and styling

## Example Structure

```jsx
return (
  <Box sx={{ width: '100%', p: 2 }}>
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* Title */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {isEditMode ? 'Edit' : 'Create'} [Plan Type] Incentive Plan
      </Typography>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Basic Information Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Basic Information
        </Typography>
        
        <Stack spacing={3}>
          {/* Basic fields */}
        </Stack>
      </Paper>

      {/* Plan-specific Configuration Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          [Plan Type] Configuration
        </Typography>
        
        <Stack spacing={3}>
          {/* Plan-specific fields */}
        </Stack>
      </Paper>
      
      {/* Advanced Options Section */}
      <Accordion 
        expanded={advancedOptionsExpanded} 
        onChange={() => setAdvancedOptionsExpanded(!advancedOptionsExpanded)}
        sx={{ 
          mb: 3, 
          boxShadow: 'none', 
          '&:before': { display: 'none' }, 
          bgcolor: 'background.default',
          '& .MuiAccordionSummary-root:hover': {
            bgcolor: 'rgba(0, 184, 169, 0.04)',
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: 'background.default', borderRadius: 1 }}
        >
          <Typography variant="h6">Advanced Options</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2 }}>
          <Stack spacing={2}>
            {/* Advanced options */}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Action Buttons */}
      <Box 
        sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          position: 'sticky',
          bottom: 16,
          bgcolor: 'background.paper',
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: 1
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate('/incentive-plans')}
          disabled={loading}
          sx={{ 
            px: 3,
            borderColor: '#00b8a9',
            color: '#00b8a9',
            '&:hover': {
              borderColor: '#00a99a',
              backgroundColor: 'rgba(0, 184, 169, 0.04)',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ 
            px: 3, 
            bgcolor: '#00b8a9', 
            '&:hover': { 
              bgcolor: '#00a99a',
              boxShadow: '0 2px 4px rgba(0,184,169,0.3)',
              transform: 'translateY(-1px)'
            },
            '&:active': {
              bgcolor: '#00877c',
              transform: 'translateY(0)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {isEditMode ? 'Update' : 'Create'} Plan
        </Button>
      </Box>
    </Paper>
  </Box>
);
```

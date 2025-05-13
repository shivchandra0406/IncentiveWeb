import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Tooltip,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';

// Mock data for leads
interface Lead {
  id: number;
  name: string;
  assignedTo: string;
  status: string;
  source: string;
  sourceDetail: string;
}

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'Sana Khandwal',
    assignedTo: 'Mayank Baliyan',
    status: 'Dropped - Not Looking',
    source: 'Facebook',
    sourceDetail: 'Whatsapp'
  }
];

// Status chip colors
const getStatusColor = (status: string) => {
  if (status.includes('Dropped')) return 'error';
  if (status.includes('New')) return 'info';
  if (status.includes('Contacted')) return 'warning';
  if (status.includes('Qualified')) return 'success';
  return 'default';
};

// Source icon mapping
const getSourceIcon = (source: string) => {
  switch (source.toLowerCase()) {
    case 'facebook':
      return <FacebookIcon fontSize="small" color="primary" />;
    case 'whatsapp':
      return <WhatsAppIcon fontSize="small" style={{ color: '#25D366' }} />;
    case 'email':
      return <EmailIcon fontSize="small" color="action" />;
    case 'phone':
      return <PhoneIcon fontSize="small" color="action" />;
    case 'twitter':
      return <TwitterIcon fontSize="small" style={{ color: '#1DA1F2' }} />;
    case 'instagram':
      return <InstagramIcon fontSize="small" style={{ color: '#C13584' }} />;
    case 'linkedin':
      return <LinkedInIcon fontSize="small" style={{ color: '#0077B5' }} />;
    default:
      return null;
  }
};

const LeadsTable: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = mockLeads.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleSourceFilterChange = (event: SelectChangeEvent) => {
    setSourceFilter(event.target.value);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Manage Leads
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 2, width: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleFilterClick}
              sx={{ mr: 2 }}
            >
              Filters
            </Button>
            
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <Box sx={{ p: 2, width: 250 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                    size="small"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="qualified">Qualified</MenuItem>
                    <MenuItem value="dropped">Dropped</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="source-filter-label">Source</InputLabel>
                  <Select
                    labelId="source-filter-label"
                    value={sourceFilter}
                    label="Source"
                    onChange={handleSourceFilterChange}
                    size="small"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="facebook">Facebook</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleFilterClose} sx={{ mr: 1 }}>Cancel</Button>
                  <Button variant="contained" onClick={handleFilterClose}>Apply</Button>
                </Box>
              </Box>
            </Menu>
            
            <Button variant="contained" color="primary">
              Add Lead
            </Button>
          </Box>
        </Toolbar>
        
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < mockLeads.length}
                    checked={mockLeads.length > 0 && selected.length === mockLeads.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all leads' }}
                  />
                </TableCell>
                <TableCell>Lead Name</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLeads.map((lead) => {
                const isItemSelected = isSelected(lead.id);
                
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(lead.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={lead.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${lead.id}` }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {lead.name}
                    </TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell>
                      <Chip 
                        label={lead.status} 
                        color={getStatusColor(lead.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getSourceIcon(lead.source)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {lead.sourceDetail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email">
                          <IconButton size="small">
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call">
                          <IconButton size="small">
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="WhatsApp">
                          <IconButton size="small">
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More">
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to 1 of 1 entries
          </Typography>
          <Pagination 
            count={1} 
            page={page} 
            onChange={handleChangePage} 
            color="primary" 
            shape="rounded"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LeadsTable;

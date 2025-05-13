import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Tabs, Tab } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import LeadsTable from '../components/Leads/LeadsTable';

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
      id={`leads-tabpanel-${index}`}
      aria-labelledby={`leads-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `leads-tab-${index}`,
    'aria-controls': `leads-tabpanel-${index}`,
  };
}

const Leads: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">Leads</Typography>
      </Breadcrumbs>

      {/* Page Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Leads
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="leads tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All (1)" {...a11yProps(0)} />
          <Tab label="My Leads (0)" {...a11yProps(1)} />
          <Tab label="Team's (1)" {...a11yProps(2)} />
          <Tab label="Unassigned (0)" {...a11yProps(3)} />
          <Tab label="Deleted (0)" {...a11yProps(4)} />
          <Tab label="Duplicate (0)" {...a11yProps(5)} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={value} index={0}>
        <LeadsTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LeadsTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LeadsTable />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <LeadsTable />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <LeadsTable />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <LeadsTable />
      </TabPanel>
    </Box>
  );
};

export default Leads;

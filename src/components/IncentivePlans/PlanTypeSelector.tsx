import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Divider
} from '@mui/material';
import {
  BarChart as TargetIcon,
  People as RoleIcon,
  Assignment as ProjectIcon,
  EmojiEvents as KickerIcon,
  Layers as TieredIcon
} from '@mui/icons-material';
import { IncentivePlanType } from '../../core/models/incentivePlanTypes';
import { useNavigate } from 'react-router-dom';

const PlanTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  console.log('PlanTypeSelector component rendered');

  const planTypes = [
    {
      type: IncentivePlanType.TargetBased,
      title: 'Target Based',
      description: 'Create incentive plans based on specific targets like sales, revenue, or units sold.',
      icon: <TargetIcon sx={{ fontSize: 48, color: '#00b8a9' }} />,
      color: '#e6f7f6'
    },
    {
      type: IncentivePlanType.RoleBased,
      title: 'Role Based',
      description: 'Create incentive plans specific to certain roles or teams within your organization.',
      icon: <RoleIcon sx={{ fontSize: 48, color: '#00b8a9' }} />,
      color: '#e6f7f6'
    },
    {
      type: IncentivePlanType.ProjectBased,
      title: 'Project Based',
      description: 'Create incentive plans tied to specific projects or initiatives.',
      icon: <ProjectIcon sx={{ fontSize: 48, color: '#00b8a9' }} />,
      color: '#e6f7f6'
    },
    {
      type: IncentivePlanType.KickerBased,
      title: 'Kicker Based',
      description: 'Create bonus incentives for consistent performance over time.',
      icon: <KickerIcon sx={{ fontSize: 48, color: '#00b8a9' }} />,
      color: '#e6f7f6'
    },
    {
      type: IncentivePlanType.TieredBased,
      title: 'Tiered Based',
      description: 'Create multi-level incentive plans with different rewards at different achievement levels.',
      icon: <TieredIcon sx={{ fontSize: 48, color: '#00b8a9' }} />,
      color: '#e6f7f6'
    }
  ];

  const handleSelectPlanType = (planType: IncentivePlanType) => {
    // Convert the enum value to lowercase for the URL
    const planTypeLower = planType.toString().toLowerCase();
    const path = `/incentive-plans/create/${planTypeLower}`;
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Select Incentive Plan Type</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {planTypes.map((planType) => (
          <Box key={planType.type} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardActionArea
                sx={{ height: '100%' }}
                onClick={() => handleSelectPlanType(planType.type)}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      mb: 2,
                      backgroundColor: planType.color,
                      borderRadius: '8px'
                    }}
                  >
                    {planType.icon}
                  </Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    {planType.title}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {planType.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PlanTypeSelector;

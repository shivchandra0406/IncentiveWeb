import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';

import { PeriodType } from '../../core/models/incentivePlanTypes';
import { getPeriodTypeLabel } from '../../utils/enumLabels';


interface BasePlanFormProps {
  planName: string;
  setPlanName: (value: string) => void;
  periodType: PeriodType;
  setPeriodType: (value: PeriodType) => void;
  startDate: Date | null;
  setStartDate: (value: Date | null) => void;
  endDate: Date | null;
  setEndDate: (value: Date | null) => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  errors: {
    planName?: string;
    periodType?: string;
    startDate?: string;
    endDate?: string;
  };
}

const BasePlanForm: React.FC<BasePlanFormProps> = ({
  planName,
  setPlanName,
  periodType,
  setPeriodType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isActive,
  setIsActive,
  errors
}) => {
  const handlePeriodTypeChange = (event: SelectChangeEvent) => {
    setPeriodType(event.target.value as PeriodType);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setIsActive(event.target.value === 'active');
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Plan Name"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          error={!!errors.planName}
          helperText={errors.planName}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.periodType}>
          <InputLabel>Period Type *</InputLabel>
          <Select
            value={periodType}
            label="Period Type *"
            onChange={handlePeriodTypeChange}
          >
            <MenuItem value={PeriodType.Monthly}>{getPeriodTypeLabel(PeriodType.Monthly)}</MenuItem>
            <MenuItem value={PeriodType.Quarterly}>{getPeriodTypeLabel(PeriodType.Quarterly)}</MenuItem>
            <MenuItem value={PeriodType.HalfYearly}>{getPeriodTypeLabel(PeriodType.HalfYearly)}</MenuItem>
            <MenuItem value={PeriodType.Yearly}>{getPeriodTypeLabel(PeriodType.Yearly)}</MenuItem>
            <MenuItem value={PeriodType.Custom}>{getPeriodTypeLabel(PeriodType.Custom)}</MenuItem>
          </Select>
          {errors.periodType && <FormHelperText>{errors.periodType}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={isActive ? 'active' : 'inactive'}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {(periodType === PeriodType.Custom) && (
        <>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date *"
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setStartDate(date);
              }}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date *"
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setEndDate(date);
              }}
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default BasePlanForm;

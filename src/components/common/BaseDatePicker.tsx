import React from 'react';
import { TextField } from '@mui/material';

interface BaseDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  helperText?: string;
}

const BaseDatePicker: React.FC<BaseDatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  helperText
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      type="date"
      value={value ? value.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : null;
        onChange(date);
      }}
      error={error}
      helperText={helperText}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default BaseDatePicker;

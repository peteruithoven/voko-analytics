import React from 'react';
import { useFetch } from 'react-fetch-hook';
import { Box, Typography } from '@material-ui/core';
import { ResponsiveContainer } from 'recharts';
import colors from './colors.js';
import BooleanPieChart from './BooleanPieChart.js';

function countField(data, fieldName, trueLabel, falseLabel) {
  const numTrue = data.filter(item => item[fieldName]).length;
  return [
    {
      name: trueLabel,
      value: numTrue,
      color: colors[0],
    },
    {
      name: falseLabel,
      value: data.length - numTrue,
      color: '#ffffff',
    },
  ];
}

function Accounts() {
  const { isLoading, data } = useFetch('data/accounts.json');
  if (isLoading || !data) return 'Loading...';
  const isSleepingData = countField(
    data,
    'is_asleep',
    'Sleeping',
    'Not sleeping'
  );
  const isActiveData = countField(data, 'is_active', 'Active', 'Inactive');

  return (
    <Box m={1}>
      <Typography variant="h5" gutterBottom>
        Accounts
      </Typography>
      <Box display="flex">
        <Box flexGrow="1">
          <Typography variant="h5" gutterBottom align="center">
            Active
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BooleanPieChart data={isActiveData} />
          </ResponsiveContainer>
        </Box>
        <Box flexGrow="1">
          <Typography variant="h5" gutterBottom align="center">
            Sleeping
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BooleanPieChart data={isSleepingData} />
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default Accounts;

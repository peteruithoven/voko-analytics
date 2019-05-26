import React from 'react';
import { useFetch } from 'react-fetch-hook';
import { Box, Typography, GridList, GridListTile } from '@material-ui/core';
import { ResponsiveContainer } from 'recharts';
import colors from './colors.js';
import BooleanPieChart from './BooleanPieChart.js';
import CohortAnalysis from './CohortAnalysis.js';

import { accountStates } from './accountStates.js';

function getStatePieData(data, state, color) {
  const count = data.filter(item => state.predicate(item)).length;
  return [
    {
      name: state.label,
      value: count,
      color: color,
    },
    {
      name: '',
      value: data.length - count,
      color: '#ffffff',
    },
  ];
}

const visibleStates = [
  ...accountStates.filter(state => state.key !== 'created'),
  {
    label: 'Sleeping',
    key: 'sleeping',
    predicate: account => account.is_asleep,
  },
];

function Accounts() {
  const { isLoading, data } = useFetch('data/accounts.json');
  if (isLoading || !data) return 'Loading...';

  return (
    <Box m={1}>
      <Typography variant="h5" gutterBottom>
        Accounts
      </Typography>
      <GridList cellHeight={300}>
        {visibleStates.map((state, index) => (
          <GridListTile key={state.key}>
            <Typography variant="h5" gutterBottom align="center">
              {state.label}
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BooleanPieChart
                data={getStatePieData(data, state, colors[index])}
              />
            </ResponsiveContainer>
          </GridListTile>
        ))}
      </GridList>
      <CohortAnalysis data={data} />
    </Box>
  );
}

export default Accounts;

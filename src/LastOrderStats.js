import React from 'react';
import { Box, Typography } from '@material-ui/core';

const lastOrderFields = [
  {
    key: 'number_of_members',
    label: 'Leden',
  },
  {
    key: 'number_of_orders',
    label: 'Bestellingen',
  },
  {
    key: 'numbers_of_suppliers',
    label: 'Leveranciers',
  },
  {
    key: 'number_of_products',
    label: 'Producten',
  },
  {
    key: 'total_revenue',
    label: 'Omzet',
    unit: '€',
  },
];

function LastOrderStats({ lastOrder }) {
  return (
    <Box display="flex">
      {lastOrderFields.map(({ key, label, unit }) => (
        <Box key={key} mr={1}>
          {unit && <Typography display="inline">{unit} </Typography>}
          <Typography display="inline">{lastOrder[key]} </Typography>
          <Typography display="inline">{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default LastOrderStats;

import React from 'react';
import { Box, Typography } from '@material-ui/core';

const lastOrderFieldLabels = {
  number_of_members: 'Leden',
  number_of_orders: 'Bestellingen',
  numbers_of_suppliers: 'Leveranciers',
  number_of_products: 'Producten',
  total_revenue: 'Omzet',
};

function LastOrderStats({ lastOrder }) {
  return (
    <Box display="flex">
      {Object.entries(lastOrderFieldLabels).map(([key, label]) => (
        <Box key={key} mr={1}>
          <Typography display="inline">{lastOrder[key]} </Typography>
          <Typography display="inline">{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default LastOrderStats;

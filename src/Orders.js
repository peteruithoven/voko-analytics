import React, { useState } from 'react';
import { useFetch } from 'react-fetch-hook';
import { Box, Typography } from '@material-ui/core';
import Settings from './Legend.js';
import colors from './colors.js';
import OrdersHistoryGraph from './OrdersHistoryGraph.js';
import LastOrderStats from './LastOrderStats.js';

const fieldLabels = {
  number_of_orders: 'Aantal bestellingen',
  number_of_members: 'Aantal leden',
  total_revenue: 'Omzet',
  number_of_products: 'Aantal producten',
  numbers_of_suppliers: 'Aantal leveranciers',
  markup_percentage: 'Marge percentage',
};

const initialState = Object.entries(fieldLabels).reduce(
  (accumulator, [key, value], index) => {
    accumulator[key] = {
      label: value,
      visible: true,
      color: colors[index],
    };
    return accumulator;
  },
  {}
);

function Orders() {
  const [fields, setFields] = useState(initialState);

  const { isLoading, data } = useFetch('data/orders.json');
  if (isLoading || !data) return <p>Loading orders...</p>;
  const lastOrder = data[data.length - 1];
  const onLegendChange = (key, checked) =>
    setFields({
      ...fields,
      [key]: {
        ...fields[key],
        visible: checked,
      },
    });

  return (
    <Box m={1}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Laatste bestelronde
        </Typography>
        <LastOrderStats lastOrder={lastOrder} />
      </Box>
      <Box display="flex">
        <Box flexGrow="1">
          <Typography variant="h5" gutterBottom>
            Bestel rondes
          </Typography>
          <OrdersHistoryGraph data={data} fields={fields} />
        </Box>
        <Settings fields={fields} onChange={onLegendChange} />
      </Box>
    </Box>
  );
}

export default Orders;

import React, { useState } from 'react';
import { useFetch } from 'react-fetch-hook';
import { Box, Typography } from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import dayjs from 'dayjs';
import { blueGrey } from '@material-ui/core/colors';
import Settings from './Legend.js';
import colors from './colors.js';

const fieldLabels = {
  number_of_orders: 'Aantal bestellingen',
  number_of_ordering_members: 'Aantal bestelende leden',
  number_of_members: 'Aantal leden',
  total_revenue: 'Totale omzet',
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

const shortDateFormatter = item => dayjs(item).format('MMM YY');
const longDateFormatter = item => dayjs(item).format('D MMM YYYY');

function Orders() {
  const [fields, setFields] = useState(initialState);

  const { isLoading, data } = useFetch('data/orders.json');
  if (isLoading || !data) return 'Loading...';
  const onLegendChange = (key, checked) =>
    setFields({
      ...fields,
      [key]: {
        ...fields[key],
        visible: checked,
      },
    });

  return (
    <Box display="flex" m={1}>
      <Box flexGrow="1">
        <Typography variant="h5" gutterBottom>
          Bestel rondes
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="open_for_orders_date"
              tickFormatter={shortDateFormatter}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 5" />
            <Tooltip
              labelFormatter={longDateFormatter}
              animationEasing="ease-out"
              animationDuration={300}
            />
            <Legend />
            {Object.entries(fields).map(
              ([key, field]) =>
                field.visible && (
                  <Line
                    name={field.label}
                    type="monotone"
                    dataKey={key}
                    stroke={field.color}
                    key={key}
                    animationDuration={300}
                  />
                )
            )}
            <Brush
              dataKey="open_for_orders_date"
              height={30}
              stroke={blueGrey[500]}
              tickFormatter={shortDateFormatter}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Settings fields={fields} onChange={onLegendChange} />
    </Box>
  );
}

export default Orders;

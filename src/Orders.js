import React, { useState } from 'react';
import { useFetch } from 'react-fetch-hook';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryZoomContainer,
} from 'victory';
import Legend from './Legend.js';
import { Box, Typography } from '@material-ui/core';
import colorScale from './colorScale';

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
      color: colorScale[index],
    };
    return accumulator;
  },
  {}
);

function Orders() {
  const [fields, setFields] = useState(initialState);

  const { isLoading, data } = useFetch('data/orders.json');
  if (isLoading || !data) return 'Loading...';
  const processedData =
    data &&
    data.map(order => ({
      ...order,
      open_for_orders_date: new Date(order.open_for_orders_date),
    }));
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
        <VictoryChart
          scale={{ x: 'time' }}
          containerComponent={<VictoryZoomContainer zoomDimension="x" />}
        >
          <VictoryAxis dependentAxis standalone={false} />
          <VictoryAxis standalone={false} fixLabelOverlap={true} />
          {Object.entries(fields).map(([key, field]) =>
            field.visible ? (
              <VictoryLine
                key={key}
                data={processedData}
                interpolation="natural"
                x="open_for_orders_date"
                y={key}
                style={{
                  data: { stroke: field.color },
                }}
              />
            ) : null
          )}
        </VictoryChart>
      </Box>
      <Legend fields={fields} onChange={onLegendChange} />
    </Box>
  );
}

export default Orders;

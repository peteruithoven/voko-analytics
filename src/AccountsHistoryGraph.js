import React from 'react';
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
  ReferenceLine,
} from 'recharts';

import dayjs from 'dayjs';
import { blueGrey, teal } from '@material-ui/core/colors';

const shortDateFormatter = item => dayjs(item).format('MMM YY');
const longDateFormatter = item => dayjs(item).format('D MMM YYYY');

function OrdersHistoryGraph({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
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
                dot={false}
              />
            )
        )}
        {/* Annotations. Note: Pick a x value that already exists */}
        <ReferenceLine
          x="2018-12-09"
          stroke={teal[500]}
          strokeDasharray="3 3"
          label="Nieuwe website"
        />
        <Brush
          dataKey="open_for_orders_date"
          height={30}
          stroke={blueGrey[500]}
          tickFormatter={shortDateFormatter}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OrdersHistoryGraph;

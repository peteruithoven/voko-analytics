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
import { accountStates } from './accountStates.js';
import * as formatters from './formatters.js';

const toolTipFormatter = item => 'Tot: ' + formatters.longDate(item);

const countFieldBefore = (data, field, date) =>
  data.filter(item => item[field] && item[field].isBefore(date)).length;

const fields = accountStates.filter(({ key }) => key !== 'active');

function OrdersHistoryGraph({ data }) {
  // convert dates to dayjs instances
  const converted = data.map(account => ({
    ...account,
    created_date: account.created_date && dayjs(account.created_date),
    confirmed_date: account.confirmed_date && dayjs(account.confirmed_date),
    first_order_date:
      account.first_order_date && dayjs(account.first_order_date),
  }));
  // sort on created (old > new)
  const sorted = converted.sort(
    (a, b) => a.created_date.toDate() - b.created_date.toDate()
  );
  const firstCreatedDate = sorted[0].created_date;
  const lastDate = dayjs(); // now

  const ticks = [];
  let tickStart = firstCreatedDate;
  let tickEnd = tickStart.add(1, 'month');
  do {
    ticks.push({
      startDate: tickStart.toISOString(),
      endDate: tickEnd.toISOString(),
      created: countFieldBefore(converted, 'created_date', tickEnd),
      confirmed: countFieldBefore(converted, 'confirmed_date', tickEnd),
      ordered: countFieldBefore(converted, 'first_order_date', tickEnd),
    });
    tickStart = tickEnd;
    tickEnd = tickEnd.add(1, 'month');
  } while (tickEnd.isBefore(lastDate));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={ticks}>
        <XAxis dataKey="endDate" tickFormatter={formatters.shortDate} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 5" />
        <Tooltip
          labelFormatter={toolTipFormatter}
          animationEasing="ease-out"
          animationDuration={300}
        />
        <Legend />
        {fields.map(field => (
          <Line
            name={field.label}
            type="monotone"
            dataKey={field.key}
            stroke={field.color}
            key={field.key}
            animationDuration={300}
            dot={false}
          />
        ))}
        {/* Annotations. Note: Pick a x value that already exists */}
        <ReferenceLine
          x="2018-12-31T23:00:00.000Z"
          stroke={teal[500]}
          strokeDasharray="3 3"
          label="Nieuwe website"
        />
        <Brush
          dataKey="endDate"
          height={30}
          stroke={blueGrey[500]}
          tickFormatter={formatters.shortDate}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OrdersHistoryGraph;

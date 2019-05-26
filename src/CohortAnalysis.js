import React from 'react';
import { Box, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { blueGrey } from '@material-ui/core/colors';
import colors from './colors.js';
import { accountStates, getAccountState } from './accountStates.js';

const initialStatesCount = {};
for (const state of accountStates) {
  initialStatesCount[state.key] = 0;
}
console.log('initialStatesCount: ', initialStatesCount);

const getCohortAccounts = (accounts, dateStart, dateEnd) =>
  accounts
    .filter(
      ({ created_date }) =>
        !!created_date &&
        (created_date.isSame(dateStart) || created_date.isAfter(dateStart)) &&
        created_date.isBefore(dateEnd)
    )
    .map(account => ({
      ...account,
      state: getAccountState(account),
    }));

const getStatesCounts = cohort =>
  cohort.reduce(
    (accumulator, account) => {
      accumulator[account.state]++;
      return accumulator;
    },
    { ...initialStatesCount }
  );

const getStatesPercs = (states, total) => {
  const percs = {};
  for (const state in states) {
    percs[`${state}Perc`] = total ? states[state] / total : 0;
  }
  return percs;
};

const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;
const shortDateFormatter = item => dayjs(item).format('MMM YY');
const longDateFormatter = item => dayjs(item).format('D MMM YYYY');

const CohortAnalysis = ({ data }) => {
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
  const lastCreatedDate = sorted[sorted.length - 1].created_date;

  // Retrieve cohorts per month
  const cohorts = [];
  let tickStart = firstCreatedDate;
  let tickEnd = tickStart.add(1, 'month');
  while (tickEnd.isBefore(lastCreatedDate)) {
    const accounts = getCohortAccounts(sorted, tickStart, tickEnd);
    const statesCounts = getStatesCounts(accounts);
    const statesPercs = getStatesPercs(statesCounts, accounts.length);

    cohorts.push({
      startDate: tickStart.toISOString(),
      endDate: tickEnd.toISOString(),
      accounts,
      ...statesCounts,
      ...statesPercs,
    });
    tickStart = tickEnd;
    tickEnd = tickEnd.add(1, 'week');
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cohort analysis
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={cohorts} stackOffset="expand">
          <XAxis dataKey="startDate" tickFormatter={shortDateFormatter} />
          <YAxis tickFormatter={toPercent} />
          {accountStates.map((state, index) => (
            <Area
              name={state.label}
              dataKey={`${state.key}Perc`}
              // stroke="none"
              stroke={colors[index]}
              fill={colors[index]}
              type="monotone"
              stackId="cohort"
              key={state.key}
            />
          ))}
          <Tooltip
            labelFormatter={longDateFormatter}
            animationEasing="ease-out"
            animationDuration={300}
            formatter={(value, name, props) => {
              const state = props.dataKey.replace('Perc', '');
              const count = props.payload[state];
              return `${count} (${toPercent(value)})`;
            }}
          />
          <Legend iconType="circle" />
          <Brush
            dataKey="startDate"
            height={30}
            stroke={blueGrey[500]}
            tickFormatter={shortDateFormatter}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CohortAnalysis;

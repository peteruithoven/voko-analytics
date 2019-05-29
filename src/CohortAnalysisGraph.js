import React from 'react';
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
  ReferenceLine,
} from 'recharts';
import { blueGrey, teal } from '@material-ui/core/colors';
import colors from './colors.js';
import { accountStates, getAccountState } from './accountStates.js';
import * as formatters from './formatters.js';

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

const toolTipFormatter = item => 'Tot: ' + formatters.longDate(item);

const CohortAnalysisGraph = ({ data }) => {
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

  // Retrieve cohorts per month
  const cohorts = [];
  let tickStart = firstCreatedDate;
  let tickEnd = tickStart.add(1, 'month');
  do {
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
    tickEnd = tickEnd.add(1, 'month');
  } while (tickEnd.isBefore(lastDate));
  console.log('cohorts: ', cohorts);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={cohorts} stackOffset="expand">
        <XAxis dataKey="endDate" tickFormatter={formatters.shortDate} />
        <YAxis tickFormatter={formatters.toPercent} />
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
          labelFormatter={formatters.longDate}
          animationEasing="ease-out"
          animationDuration={300}
          formatter={(value, name, props) => {
            const state = props.dataKey.replace('Perc', '');
            const count = props.payload[state];
            return `${count} (${formatters.toPercent(value)})`;
          }}
        />
        <Legend iconType="circle" />
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
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CohortAnalysisGraph;

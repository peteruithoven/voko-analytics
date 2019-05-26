import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const renderCustomizedLabel = ({ name, value, x, y, fill, textAnchor }) => {
  return (
    <text
      x={textAnchor === 'start' ? x + 5 : x - 5}
      y={y}
      fill={fill}
      textAnchor={textAnchor}
      dominantBaseline="central"
    >
      {value}
    </text>
  );
};

const BooleanPieChart = ({ data, ...props }) => (
  <PieChart {...props}>
    <Pie
      nameKey="name"
      dataKey="value"
      animationDuration={300}
      // label
      label={renderCustomizedLabel}
      data={data}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${entry.name}`} fill={entry.color} />
      ))}
      <Tooltip />
    </Pie>
  </PieChart>
);

export default BooleanPieChart;

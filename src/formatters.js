import dayjs from 'dayjs';

export const toPercent = (decimal, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;
export const shortDate = date => dayjs(date).format('MMM YY');
export const longDate = date => dayjs(date).format('D MMM YYYY');
export const year = date => dayjs(date).format('YYYY');
export const month = date => dayjs(date).format('MMM');

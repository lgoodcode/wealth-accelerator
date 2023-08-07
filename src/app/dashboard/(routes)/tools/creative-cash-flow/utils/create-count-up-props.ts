import type { CountUpProps } from 'react-countup/build/CountUp';

export const createCountUpProps = (end: number, delay = 0): CountUpProps => ({
  end,
  delay,
  duration: 2,
  decimalPlaces: 2,
  prefix: '$',
});

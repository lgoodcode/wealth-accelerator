import type { CountUpProps } from 'react-countup/build/CountUp';

export type CreateCountUp = (end: number, delay?: number) => CountUpProps;

export const createCountUpPropsFactory =
  (animate = true) =>
  (end: number, delay = 0): CountUpProps => ({
    start: animate ? 0 : end,
    end,
    delay,
    duration: animate ? 2 : 0,
    decimals: 2,
    prefix: '$',
    preserveValue: true,
  });

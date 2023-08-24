import type { CountUpProps } from 'react-countup/build/CountUp';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';

export type CreateCountUp = (end: number, delay?: number) => CountUpProps;

export const createCountUpPropsFactory =
  (animate = true) =>
  (end: number, delay = 0): CountUpProps => ({
    start: animate ? 0 : end,
    end,
    delay,
    duration: animate ? 2 : 0,
    preserveValue: true,
    formattingFn: dollarFormatter,
  });

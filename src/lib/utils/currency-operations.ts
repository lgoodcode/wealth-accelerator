import { dollarsToCents } from './currency';
import { centsToDollars } from './currency';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

const add = (...args: number[]) => {
  return args.reduce((acc, val) => acc + val, 0);
};

const subtract = (...args: number[]) => {
  return args.reduce((acc, val) => acc - val);
};

const multiply = (...args: number[]) => {
  return args.reduce((acc, val) => acc * val);
};

const divide = (...args: number[]) => {
  return args.reduce((acc, val) => acc / val);
};

export const currencyOperation = (operation: Operation, ...args: number[]) => {
  const cents = args.map(dollarsToCents);

  switch (operation) {
    case 'add':
      return centsToDollars(add(...cents));
    case 'subtract':
      return centsToDollars(subtract(...cents));
    case 'multiply':
      return centsToDollars(multiply(...cents));
    case 'divide':
      return centsToDollars(divide(...cents));
    default:
      throw new Error('Invalid operation');
  }
};

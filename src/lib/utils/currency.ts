import { moneyRound } from './money-round';

export const dollarsToCents = (dollars: number) => dollars * 100;
export const centsToDollars = (cents: number) => moneyRound(cents / 100);

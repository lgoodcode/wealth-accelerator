export const formatMonths = (months: number) => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return `${years > 0 ? `${years} year${years > 1 ? 's' : ''}` : ''} ${
    remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''
  }`.trim();
};

/**
 * Takes in UTC time strings stored in the database like `2023-07-14 00:00:00+00`
 * and parses it to just get the date in the format of MM/DD/YYYY to be displayed
 * on the front end so it is consistent with the date format used in the form
 *
 * `2023-07-14 00:00:00+00` -> `7/14/2023`
 *
 * @param date
 * @returns Formatted date string in the format of M/DD/YYYY
 */
export const formattedDate = (date: Date): string => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
};

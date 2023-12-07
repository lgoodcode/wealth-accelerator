/**
 *
 * If strict, only capitalize the first letter of each word and the rest is lowercase.
 * Otherwise, capitalize the first letter of each word and the rest is unchanged.
 *
 * @param str
 * @param strict
 * @returns {string}
 */
export const initcap = (str: string, strict = true) => {
  str = str.trim();
  str = strict ? str.toLowerCase() : str;

  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
};

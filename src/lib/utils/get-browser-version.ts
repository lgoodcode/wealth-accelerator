export const getBrowserVersion = () => {
  const userAgent = navigator.userAgent;
  const browserVersion = userAgent.match(/(chrome|firefox|safari|opera|edge|msie)\b.*?([\d.]+)/i);

  if (browserVersion) {
    const split = browserVersion[2].split('.');
    return {
      browser: browserVersion[1].toLowerCase(),
      version: parseFloat(`${split[0]}.${split[1]}`),
    };
  }
  console.warn('Unable to detect browser version');
  return null;
};

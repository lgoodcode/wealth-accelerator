import { getBrowserVersion } from './get-browser-version';

const shim = (value: any) => JSON.parse(JSON.stringify(value));

export const structuredCloneShim = () => {
  const browserVersion = getBrowserVersion();

  if (browserVersion) {
    let shouldShim = false;

    switch (browserVersion?.browser) {
      case 'firefox':
        if (browserVersion.version < 94) {
          shouldShim = true;
        }
        break;

      case 'chrome':
      case 'edge':
        if (browserVersion.version < 98) {
          shouldShim = true;
        }
        break;

      case 'safari':
        if (browserVersion.version < 15.4) {
          shouldShim = true;
        }
        break;
    }

    if (shouldShim) {
      window.structuredClone = shim;
    }
  }
};

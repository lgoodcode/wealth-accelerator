export const formatPath = (path: string): `/${string}` => {
  if (path === '' || path[0] !== '/') {
    return `/${path}`;
  } else {
    return path as `/${string}`;
  }
};

export const formatPath = (path?: string | null): `/${string}` => {
  if (!path) {
    return '/';
  } else if (path === '' || path[0] !== '/') {
    return `/${path}`;
  } else {
    return path as `/${string}`;
  }
};

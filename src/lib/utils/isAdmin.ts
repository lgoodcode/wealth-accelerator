import { Role } from '../types';

export const isAdmin = (user: User | Role) => {
  if (typeof user === 'string') {
    return user === Role.ADMIN;
  }
  return user.role === Role.ADMIN;
};

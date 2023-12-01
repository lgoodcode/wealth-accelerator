import { Role } from '@/lib/types/role';

type RoleOption = {
  label: string;
  value: Role;
};

export const roleOptions: RoleOption[] = [
  {
    label: 'User',
    value: Role.USER,
  },
  {
    label: 'Admin',
    value: Role.ADMIN,
  },
];

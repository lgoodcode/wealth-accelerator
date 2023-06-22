export declare global {
  export type Role = 'admin' | 'user';
  /** Supabase user */
  export type User = {
    id: string;
    email: string;
    name: string;
    role: Role;
    created_at: string;
    updated_at: string;
  };

  export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

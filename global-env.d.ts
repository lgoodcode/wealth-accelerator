export declare global {
  /** Supabase user */
  export type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: string;
    updated_at: string;
  };

  export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

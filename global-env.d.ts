export declare global {
  // Type utility that will yield a type error if A and B are not the same
  export type AssertEqual<T, Expected> = T extends Expected
    ? Expected extends T
      ? true
      : never
    : never;

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

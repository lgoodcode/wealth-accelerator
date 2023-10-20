# Wealth Accelerator

## Description

## Things to do

- Get the SEO description for the website

## Development

Notes on development.

### Error Logging

Only use Sentry `captureException()` on errors in the backend or from Supabase; anything that is
not a response from our server, because it is already being done in the backend.

### Theming

When adding a new theme or customizing, do the following:

1. Create the colors in the `globals.css` file
2. Update the `tailwind.config.js` file with the new colors
3. Update variants in the `toast.tsx` and `button.tsx` files

### Supabase Schema

When creating tables or functions you need to set the owner to `postgres` so that when using the
Supabase CLI it will work because it will default to `supabase_admin` but `postgres` is used in
the CLI.

```sql
ALTER TABLE users OWNER TO postgres;

ALTER FUNCTION do_something(string text, value integer) OWNER TO postgres;
```

### Supabase Backups

With using the Supabase migrations through the Supbase CLI, the database schema is fully backed up with changes over time. The data itself can be retrieved from the supabase dashboard and then used to restore the data.

### Supabase Database Config

By default, a Supabase project will limit queries to `1000` records. This can be changed in the
`Settings` tab of the project.

### Supabase RLS

Here is a typical RLS that is created:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own user data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Can update own user data" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = users.role);
```

The `TO` clause specifies that only authenticated users can access the table.

```sql
TO authenticated
```

The `USING` clause specifies that only the user who owns the row can access it.

```sql
USING (auth.uid() = id);
```

The `WITH CHECK` clause specifies that the user can only update their own data and that
the role is not modified by checking it is the same as the current value.

```sql
WITH CHECK (auth.uid() = id AND role = users.role);
```

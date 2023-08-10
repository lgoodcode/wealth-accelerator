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

### Supabase Database

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

## Notes

### Insurance Policy Feature

- The `next.config.js` has the `webpack` config disabled. This is only needed for when the feature is used
  and the PDF's need to be parsed.

### Invite Users Feature

- Is fully functional and working, just need to un-comment the button in the manage-users page.

### Profile

- Is fully functional and working, just need to un-comment the menu item in the user-nav component

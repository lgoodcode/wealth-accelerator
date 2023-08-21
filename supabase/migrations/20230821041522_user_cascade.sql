-- Drop the existing foreign key constraint
ALTER TABLE users
DROP CONSTRAINT users_id_fkey;

-- Add a new foreign key constraint with ON DELETE CASCADE
ALTER TABLE users
ADD CONSTRAINT users_id_fkey FOREIGN KEY (id)
REFERENCES auth.users(id) ON DELETE CASCADE;

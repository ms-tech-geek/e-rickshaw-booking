/*
  # Allow public booking read access

  1. Security Changes
    - Add policy to allow public users to read bookings
    - This enables viewing bookings in the admin dashboard without authentication
*/

-- Policy for public booking read access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
    ON bookings
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;
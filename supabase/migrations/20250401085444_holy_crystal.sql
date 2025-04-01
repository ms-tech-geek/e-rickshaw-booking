/*
  # Allow public booking creation

  1. Security Changes
    - Add policy to allow public users to create bookings
    - Maintains existing policies for authenticated users
*/

-- Policy for public booking creation
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND policyname = 'Enable public booking creation'
  ) THEN
    CREATE POLICY "Enable public booking creation"
    ON bookings
    FOR INSERT
    TO public
    WITH CHECK (true);
  END IF;
END $$;
/*
  # Fix RLS policies for bookings table

  1. Security Changes
    - Enable RLS on bookings table if not already enabled
    - Add policies for:
      - Insert access for authenticated users
      - Read access for authenticated users
      - Update access for authenticated users
    - Uses DO blocks to check for existing policies before creating
*/

-- Enable RLS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policy for inserting bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND policyname = 'Enable insert access for authenticated users'
  ) THEN
    CREATE POLICY "Enable insert access for authenticated users"
    ON bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- Policy for reading bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
    ON bookings
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- Policy for updating bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'bookings' 
    AND policyname = 'Enable update access for authenticated users'
  ) THEN
    CREATE POLICY "Enable update access for authenticated users"
    ON bookings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
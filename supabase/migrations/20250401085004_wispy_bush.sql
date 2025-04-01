/*
  # Add RLS policies for bookings table

  1. Security Changes
    - Enable RLS on bookings table
    - Add policies for:
      - Insert access for authenticated users
      - Read access for authenticated users
      - Update access for authenticated users
*/

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for inserting bookings
CREATE POLICY "Enable insert access for authenticated users"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for reading bookings
CREATE POLICY "Enable read access for authenticated users"
ON bookings
FOR SELECT
TO authenticated
USING (true);

-- Policy for updating bookings
CREATE POLICY "Enable update access for authenticated users"
ON bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
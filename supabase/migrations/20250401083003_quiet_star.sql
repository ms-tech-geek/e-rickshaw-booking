/*
  # Create bookings table for E-Rickshaw Booking System

  1. New Tables
    - `bookings`
      - `id` (bigserial, primary key)
      - `name` (varchar, 50 chars max)
      - `mobile_number` (varchar, 15 chars max)
      - `pickup_location` (text)
      - `booking_date` (date)
      - `booking_time` (time)
      - `status` (varchar, 20 chars max)
      - `assigned_driver` (varchar, 50 chars max, nullable)
      - `driver_contact` (varchar, 15 chars max, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes
    - Index on booking_date for date range queries
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  pickup_location TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  assigned_driver VARCHAR(50),
  driver_contact VARCHAR(15),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_status ON bookings(status);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users" ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON bookings
  FOR UPDATE
  TO authenticated
  USING (true);
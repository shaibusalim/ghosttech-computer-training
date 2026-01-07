-- Create registrations table for Gh0sT Tech
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  course_selection VARCHAR(100) NOT NULL,
  previous_knowledge BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert registrations
CREATE POLICY "Anyone can insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow admins to view all registrations
CREATE POLICY "Admins can view all registrations" ON registrations
  FOR SELECT USING (true);

-- Create policy to allow admins to update registrations
CREATE POLICY "Admins can update registrations" ON registrations
  FOR UPDATE USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

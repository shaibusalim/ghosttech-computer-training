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
  education_level VARCHAR(255),
  experience_level VARCHAR(255),
  motivation TEXT,
  payment_status VARCHAR(50) DEFAULT 'none',
  payment_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Enable Row Level Security.
-- IMPORTANT: no policies are created on purpose. All access to this table goes through
-- server routes using the service-role key (which bypasses RLS). Never add USING (true)
-- policies here: the anon key is public and would expose every student's data.
-- See scripts/03-lock-down-rls.sql.
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

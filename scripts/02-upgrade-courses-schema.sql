-- Migration: Upgrade Registrations for Granular Multi-Course Support
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS course_id VARCHAR(100) DEFAULT 'hardware-engineering',
ADD COLUMN IF NOT EXISTS backend_preference VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS total_fee DECIMAL(10, 2) DEFAULT 700.00,
ADD COLUMN IF NOT EXISTS required_deposit DECIMAL(10, 2) DEFAULT 300.00;

-- Create Courses lookup table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  duration_weeks INT NOT NULL,
  total_fee DECIMAL(10, 2) NOT NULL,
  required_deposit DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Expanded Course Catalog Records with Granular Web Dev Sub-Courses
INSERT INTO courses (id, title, category, duration_weeks, total_fee, required_deposit) VALUES
  ('hardware-engineering', 'Practical Computer Systems & Engineering', 'Hardware', 4, 700.00, 300.00),
  ('office-productivity', 'Office Productivity & Digital Literacy', 'Productivity', 3, 500.00, 200.00),
  ('web-dev-frontend-beginner', 'Frontend Foundations & AI Web Design', 'Software', 4, 600.00, 250.00),
  ('web-dev-frontend-advanced', 'Advanced Modern Frontend (React & Next.js + AI)', 'Software', 4, 750.00, 300.00),
  ('web-dev-backend-php', 'PHP & MySQL Database Engineering + AI', 'Software', 4, 650.00, 250.00),
  ('web-dev-backend-node', 'Advanced Node.js, Express & MySQL + AI', 'Software', 4, 750.00, 300.00),
  ('web-dev-fullstack-master', 'Full-Stack Web Dev & AI Masterclass Bundle', 'Software', 8, 1200.00, 500.00)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  total_fee = EXCLUDED.total_fee,
  required_deposit = EXCLUDED.required_deposit;

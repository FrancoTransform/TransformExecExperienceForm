-- Executive Experiences Registration Table
-- Run this SQL in your Neon SQL Editor to create the table

CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  
  -- Qualification Questions
  is_chro BOOLEAN NOT NULL,
  company_size TEXT NOT NULL CHECK (company_size IN ('under_5000', '5000_plus')),
  is_exec_member BOOLEAN NOT NULL,
  
  -- Activity Selections (all nullable, true if selected)
  ai_at_work_mon BOOLEAN DEFAULT false,
  exec_chambers_mon BOOLEAN DEFAULT false,
  sponsored_dinner_mon BOOLEAN DEFAULT false,
  exec_member_lunch_tue BOOLEAN DEFAULT false,
  chro_experience_lunch_tue BOOLEAN DEFAULT false,
  chro_track_session_tue BOOLEAN DEFAULT false,
  exec_chambers_tue BOOLEAN DEFAULT false,
  vip_dinner_tue BOOLEAN DEFAULT false,
  chro_experience_breakfast_wed BOOLEAN DEFAULT false,
  executive_breakfast_wed BOOLEAN DEFAULT false,
  exec_chambers_wed BOOLEAN DEFAULT false,
  
  -- Logistics
  staying_at_wynn BOOLEAN NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  dietary_restrictions TEXT[] DEFAULT '{}',
  dietary_other TEXT
);

-- Create an index on email for faster lookups
CREATE INDEX idx_registrations_email ON registrations(email);

-- Create an index on created_at for sorting
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);


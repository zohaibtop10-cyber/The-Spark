-- Project Atlas: The Spark School & College Database Schema

-- 1. ADMISSIONS TABLE
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  guardian_name TEXT,
  guardian_contact TEXT,
  previous_school TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Under Review', 'Accepted', 'Rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOUSE POINTS TABLE
CREATE TABLE IF NOT EXISTS house_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campus_id TEXT NOT NULL, -- e.g., 'north', 'city'
  house_id TEXT NOT NULL, -- e.g., 'zest', 'sharp'
  house_name TEXT NOT NULL, -- e.g., 'Zest', 'Sharp'
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campus_id, house_id)
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL, -- 'Exam', 'Sports', 'Academic', 'Holiday'
  description TEXT,
  campus_ids TEXT[], -- Array of campus IDs this event applies to. Empty or null means all.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA (Optional)

-- Events
INSERT INTO events (title, date, category, campus_ids) VALUES
('Mid-Term Assessment', '2024-10-08', 'Exam', NULL),
('Annual Athletics Day', '2024-10-22', 'Sports', NULL),
('Science & Tech Expo', '2024-10-28', 'Academic', ARRAY['science']),
('Staff Workshop', '2024-10-02', 'Academic', NULL);

-- House Points (Seed for North Campus as example)
INSERT INTO house_points (campus_id, house_id, house_name, points) VALUES
('north', 'zest', 'Zest', 450),
('north', 'sharp', 'Sharp', 420),
('north', 'brave', 'Brave', 390),
('north', 'decent', 'Decent', 360),
('north', 'smart', 'Smart', 330)
ON CONFLICT (campus_id, house_id) DO NOTHING;

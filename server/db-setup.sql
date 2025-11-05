-- Gym Buddy Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_name)
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  reps TEXT NOT NULL,
  sets TEXT NOT NULL,
  rest TEXT NOT NULL,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise logs table for tracking weight and completion
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight TEXT,
  completed_sets INTEGER DEFAULT 0,
  date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_user_id ON exercise_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_exercise_id ON exercise_logs(exercise_id);

-- Insert default admin user with bcrypt hashed password (admin123)
-- Hash generated with: bcrypt.hash('admin123', 10)
INSERT INTO users (username, password, name, is_admin)
VALUES ('admin', '$2b$10$aXoynqI5ZTOqQpORf1Ojmupcv.9Wtohlp2EImGTsa2zd16DcW6Yf.', 'Admin User', true)
ON CONFLICT (username) DO NOTHING;

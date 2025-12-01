-- InfinityTrain Database Schema for Supabase

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
  avatar TEXT NOT NULL
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Subtopics table
CREATE TABLE IF NOT EXISTS subtopics (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resources TEXT NOT NULL
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  subtopic_id TEXT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  text TEXT,
  image_url TEXT,
  drawing_url TEXT,
  timestamp TIMESTAMPTZ NOT NULL
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL REFERENCES users(id),
  subtopic_id TEXT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('not_addressed', 'basic', 'good', 'fully_understood')),
  PRIMARY KEY (user_id, subtopic_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_comments_subtopic_id ON comments(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_is_deleted ON topics(is_deleted);

-- Enable Row Level Security (RLS) - optional for added security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
-- For now, allow all operations for simplicity
CREATE POLICY "Allow all users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all topics" ON topics FOR ALL USING (true);
CREATE POLICY "Allow all subtopics" ON subtopics FOR ALL USING (true);
CREATE POLICY "Allow all comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all progress" ON progress FOR ALL USING (true);

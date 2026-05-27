-- OPC Platform - Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor

-- ===== PROFILES =====
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  account_type TEXT DEFAULT 'personal', -- 'personal' | 'enterprise'
  credit_score INTEGER DEFAULT 100,
  avatar_color TEXT DEFAULT '#6366F1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== TASKS =====
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT '其他',
  task_type TEXT DEFAULT 'short', -- 'short' | 'long'
  budget INTEGER DEFAULT 0,
  deposit INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published', -- 'published' | 'in_progress' | 'completed' | 'cancelled'
  client_id UUID REFERENCES profiles(id),
  escrow_step INTEGER DEFAULT 0,
  delivery_url TEXT,
  standards TEXT DEFAULT '',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== BIDS =====
CREATE TABLE IF NOT EXISTS bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  opc_id UUID REFERENCES profiles(id),
  price INTEGER NOT NULL,
  proposal TEXT DEFAULT '',
  status TEXT DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== MESSAGES =====
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== REVIEWS =====
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  reviewee_id UUID REFERENCES profiles(id),
  score INTEGER CHECK (score >= 1 AND score <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== ESCROW =====
CREATE TABLE IF NOT EXISTS escrow (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id),
  opc_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  step INTEGER DEFAULT 0, -- 0-4
  status TEXT DEFAULT 'active', -- 'active' | 'released' | 'disputed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== RLS POLICIES =====

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;

-- profiles: anyone can read, owner can update
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_all" ON profiles FOR ALL USING (auth.uid() = id);

-- tasks: public read, authenticated write, owner update/delete
CREATE POLICY "tasks_public_read" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_auth_insert" ON tasks FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "tasks_auth_update" ON tasks FOR UPDATE USING (auth.uid() = client_id);

-- bids: public read, OPC can insert, task owner can update
CREATE POLICY "bids_public_read" ON bids FOR SELECT USING (true);
CREATE POLICY "bids_opc_insert" ON bids FOR INSERT WITH CHECK (auth.uid() = opc_id);
CREATE POLICY "bids_owner_update" ON bids FOR UPDATE USING (auth.uid() = opc_id OR auth.uid() = (SELECT client_id FROM tasks WHERE id = task_id));

-- messages: participants can read/write
CREATE POLICY "messages_participant_read" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR
  EXISTS (SELECT 1 FROM tasks WHERE tasks.id = messages.task_id AND tasks.client_id = auth.uid())
);
CREATE POLICY "messages_participant_insert" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- reviews: public read, reviewer can insert, reviewee can read
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_reviewer_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- escrow: participants only
CREATE POLICY "escrow_participant_read" ON escrow FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = opc_id
);
CREATE POLICY "escrow_participant_update" ON escrow FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() = opc_id
);

-- Enable realtime for messages and bids
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
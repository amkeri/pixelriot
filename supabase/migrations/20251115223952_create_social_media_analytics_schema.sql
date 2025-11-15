/*
  # Social Media Analytics Platform Schema

  ## Overview
  This migration creates the complete database schema for a multi-platform social media analytics dashboard.

  ## New Tables

  ### 1. profiles
  User profiles for content creators
  - id (uuid, primary key)
  - email (text)
  - full_name (text)
  - avatar_url (text)
  - created_at, updated_at (timestamptz)

  ### 2. connected_platforms
  Social media platform connections
  - id (uuid, primary key)
  - user_id (uuid, foreign key to profiles)
  - platform (text) - youtube, tiktok, instagram, etc
  - platform_username (text)
  - is_active (boolean)
  - connected_at, last_synced_at (timestamptz)

  ### 3. analytics_snapshots
  Daily analytics snapshots from each platform
  - id (uuid, primary key)
  - connection_id (uuid, foreign key)
  - snapshot_date (date)
  - viewers, likes, comments, shares (integer)
  - average_watch_time (integer)
  - followers (integer)
  - engagement_rate (decimal)

  ### 4. hourly_analytics
  Hourly viewer activity breakdown
  - id (uuid, primary key)
  - connection_id (uuid, foreign key)
  - date (date)
  - hour (integer 0-23)
  - viewers, engagement_count (integer)

  ### 5. content_posts
  Individual posts/videos across platforms
  - id (uuid, primary key)
  - connection_id (uuid, foreign key)
  - title, description (text)
  - views, likes, comments, shares (integer)
  - published_at, updated_at (timestamptz)

  ## Security
  RLS enabled on all tables with authenticated user policies
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS connected_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('youtube', 'tiktok', 'instagram', 'twitter', 'facebook')),
  platform_user_id text,
  platform_username text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  is_active boolean DEFAULT true,
  connected_at timestamptz DEFAULT now(),
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, platform_user_id)
);

ALTER TABLE connected_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own platforms"
  ON connected_platforms FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own platforms"
  ON connected_platforms FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own platforms"
  ON connected_platforms FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own platforms"
  ON connected_platforms FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES connected_platforms(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  viewers integer DEFAULT 0,
  average_watch_time integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  followers integer DEFAULT 0,
  engagement_rate decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(connection_id, snapshot_date)
);

ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = analytics_snapshots.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analytics"
  ON analytics_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = analytics_snapshots.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS hourly_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES connected_platforms(id) ON DELETE CASCADE,
  date date NOT NULL,
  hour integer NOT NULL CHECK (hour >= 0 AND hour <= 23),
  viewers integer DEFAULT 0,
  engagement_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(connection_id, date, hour)
);

ALTER TABLE hourly_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hourly analytics"
  ON hourly_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = hourly_analytics.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own hourly analytics"
  ON hourly_analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = hourly_analytics.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS content_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES connected_platforms(id) ON DELETE CASCADE,
  platform_post_id text NOT NULL,
  title text,
  description text,
  thumbnail_url text,
  post_url text,
  published_at timestamptz,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(connection_id, platform_post_id)
);

ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON content_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = content_posts.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own posts"
  ON content_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = content_posts.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own posts"
  ON content_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = content_posts.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM connected_platforms
      WHERE connected_platforms.id = content_posts.connection_id
      AND connected_platforms.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_connected_platforms_user_id ON connected_platforms(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_connection_id ON analytics_snapshots(connection_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_hourly_analytics_connection_id ON hourly_analytics(connection_id);
CREATE INDEX IF NOT EXISTS idx_hourly_analytics_date ON hourly_analytics(date);
CREATE INDEX IF NOT EXISTS idx_content_posts_connection_id ON content_posts(connection_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_published_at ON content_posts(published_at);

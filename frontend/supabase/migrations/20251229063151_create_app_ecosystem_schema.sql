/*
  # Mobile App Ecosystem Database Schema

  ## Overview
  This migration creates the complete database structure for analyzing monopolistic competition
  in mobile app ecosystems, supporting an interactive comparison tool with regional availability.

  ## New Tables

  ### 1. `categories`
  Stores app categories (Social Media, Messaging, Streaming, etc.)
  - `id` (uuid, primary key)
  - `name` (text, unique) - Category name
  - `description` (text) - Category description
  - `icon` (text) - Icon identifier
  - `created_at` (timestamptz)

  ### 2. `countries`
  Stores countries/regions for regional app availability
  - `id` (uuid, primary key)
  - `code` (text, unique) - ISO country code (US, UK, IN, etc.)
  - `name` (text) - Full country name
  - `region` (text) - Geographic region
  - `created_at` (timestamptz)

  ### 3. `apps`
  Main app information table
  - `id` (uuid, primary key)
  - `name` (text) - App name
  - `developer` (text) - Developer name
  - `category_id` (uuid) - Foreign key to categories
  - `description` (text) - App description
  - `icon_url` (text) - App icon URL
  - `price` (decimal) - Base price (0 for free)
  - `pricing_model` (text) - Free, Freemium, Paid, Subscription
  - `platform` (text) - iOS, Android, Both
  - `play_store_url` (text) - Google Play Store URL
  - `app_store_url` (text) - Apple App Store URL
  - `rating` (decimal) - Average rating (0-5)
  - `downloads` (text) - Download range or count
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `app_features`
  Detailed feature scores for each app
  - `id` (uuid, primary key)
  - `app_id` (uuid) - Foreign key to apps
  - `privacy_score` (integer) - Privacy rating (1-10)
  - `performance_score` (integer) - Performance rating (1-10)
  - `ease_of_use_score` (integer) - Usability rating (1-10)
  - `feature_richness_score` (integer) - Feature completeness (1-10)
  - `customization_score` (integer) - Customization options (1-10)
  - `support_quality_score` (integer) - Customer support (1-10)
  - `ad_free` (boolean) - Ad-free experience
  - `offline_mode` (boolean) - Offline functionality
  - `cross_platform` (boolean) - Multi-platform support
  - `security_features` (text[]) - Security features list
  - `unique_features` (text[]) - Unique selling points
  - `limitations` (text[]) - Known limitations
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `app_availability`
  Regional availability mapping
  - `id` (uuid, primary key)
  - `app_id` (uuid) - Foreign key to apps
  - `country_id` (uuid) - Foreign key to countries
  - `available` (boolean) - Is app available in this country
  - `created_at` (timestamptz)

  ### 6. `user_comparisons`
  Stores user comparison sessions (optional tracking)
  - `id` (uuid, primary key)
  - `app_ids` (uuid[]) - Array of app IDs being compared
  - `user_preferences` (jsonb) - User's preference weights
  - `selected_country_id` (uuid) - Foreign key to countries
  - `selected_category_id` (uuid) - Foreign key to categories
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access (educational website)
  - Restrict write access to authenticated users only
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'folder',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  region text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view countries"
  ON countries FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage countries"
  ON countries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  developer text NOT NULL DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text NOT NULL DEFAULT '',
  icon_url text NOT NULL DEFAULT '',
  price decimal(10,2) DEFAULT 0,
  pricing_model text DEFAULT 'Free',
  platform text DEFAULT 'Both',
  play_store_url text DEFAULT '',
  app_store_url text DEFAULT '',
  rating decimal(2,1) DEFAULT 0,
  downloads text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view apps"
  ON apps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage apps"
  ON apps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create app_features table
CREATE TABLE IF NOT EXISTS app_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  privacy_score integer DEFAULT 5 CHECK (privacy_score >= 1 AND privacy_score <= 10),
  performance_score integer DEFAULT 5 CHECK (performance_score >= 1 AND performance_score <= 10),
  ease_of_use_score integer DEFAULT 5 CHECK (ease_of_use_score >= 1 AND ease_of_use_score <= 10),
  feature_richness_score integer DEFAULT 5 CHECK (feature_richness_score >= 1 AND feature_richness_score <= 10),
  customization_score integer DEFAULT 5 CHECK (customization_score >= 1 AND customization_score <= 10),
  support_quality_score integer DEFAULT 5 CHECK (support_quality_score >= 1 AND support_quality_score <= 10),
  ad_free boolean DEFAULT false,
  offline_mode boolean DEFAULT false,
  cross_platform boolean DEFAULT false,
  security_features text[] DEFAULT '{}',
  unique_features text[] DEFAULT '{}',
  limitations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view app features"
  ON app_features FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage app features"
  ON app_features FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create app_availability table
CREATE TABLE IF NOT EXISTS app_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(app_id, country_id)
);

ALTER TABLE app_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view app availability"
  ON app_availability FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage app availability"
  ON app_availability FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create user_comparisons table
CREATE TABLE IF NOT EXISTS user_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_ids uuid[] NOT NULL DEFAULT '{}',
  user_preferences jsonb DEFAULT '{}',
  selected_country_id uuid REFERENCES countries(id) ON DELETE SET NULL,
  selected_category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create comparisons"
  ON user_comparisons FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view comparisons"
  ON user_comparisons FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category_id);
CREATE INDEX IF NOT EXISTS idx_app_features_app ON app_features(app_id);
CREATE INDEX IF NOT EXISTS idx_app_availability_app ON app_availability(app_id);
CREATE INDEX IF NOT EXISTS idx_app_availability_country ON app_availability(country_id);
/*
  # Add Service Integration Tracking and Food Delivery Category

  1. New Tables
    - `service_categories` - Tracks service types (food delivery, grocery, dine-out, parcel, etc.)
    - `app_services` - Maps which services each app provides

  2. Modified Tables
    - `app_features` - Add `service_breadth_score` column to track integration advantage

  3. New Apps
    - Food delivery category with single and multi-service apps
    - Examples: Swiggy (multi-service), Zomato (single + some expansion)

  4. Security
    - Enable RLS on new tables
    - Allow public read access for educational purposes
*/

CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'package',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service categories"
  ON service_categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage service categories"
  ON service_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS app_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  service_category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(app_id, service_category_id)
);

ALTER TABLE app_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view app services"
  ON app_services FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage app services"
  ON app_services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add service_breadth_score to app_features if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_features' AND column_name = 'service_breadth_score'
  ) THEN
    ALTER TABLE app_features ADD COLUMN service_breadth_score integer DEFAULT 1 CHECK (service_breadth_score >= 1 AND service_breadth_score <= 10);
  END IF;
END $$;

-- Insert Food Delivery category
INSERT INTO categories (name, description, icon) VALUES
('Food Delivery', 'Food ordering and delivery services', 'utensils')
ON CONFLICT (name) DO NOTHING;

-- Insert service categories
INSERT INTO service_categories (name, description, icon) VALUES
('Food Delivery', 'Order food from restaurants', 'shopping-bag'),
('Grocery Delivery', 'Grocery and essentials delivery', 'shopping-cart'),
('Dine-Out Booking', 'Restaurant reservations and bookings', 'utensils'),
('Parcel Delivery', 'Package and parcel delivery', 'package'),
('Subscription Boxes', 'Meal prep and subscription services', 'boxes')
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_app_services_app ON app_services(app_id);
CREATE INDEX IF NOT EXISTS idx_app_services_service ON app_services(service_category_id);
CREATE INDEX IF NOT EXISTS idx_app_features_service_breadth ON app_features(service_breadth_score);
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE reunion_type AS ENUM ('family', 'class', 'military', 'corporate', 'other');
CREATE TYPE user_role AS ENUM ('lead_planner', 'co_planner', 'view_only', 'attendee');
CREATE TYPE vendor_status AS ENUM ('contacted', 'quoted', 'booked', 'pending');
CREATE TYPE venue_status AS ENUM ('considering', 'visited', 'booked');

--=====================================================
-- USERS AND AUTHENTICATION
--=====================================================
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'attendee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- REUNIONS
--=====================================================
-- Main reunions table
CREATE TABLE reunions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type reunion_type NOT NULL,
  planned_date DATE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_settings JSONB,
  budget_settings JSONB
);

-- Reunion members/participants
CREATE TABLE reunion_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT, -- For non-registered users
  email TEXT,
  role user_role DEFAULT 'attendee',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(reunion_id, user_id),
  UNIQUE(reunion_id, email)
);

--=====================================================
-- CHAPTER DATA STORAGE
--=====================================================
-- Vision and intention data
CREATE TABLE vision_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  purpose TEXT,
  goals TEXT,
  target_audience TEXT,
  priorities JSONB,
  relationships JSONB,
  legacy JSONB,
  reflection JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reunion_id)
);

-- Committee members
CREATE TABLE committee_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  responsibilities TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget tracking
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  total_planned DECIMAL(10,2) DEFAULT 0,
  total_actual DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reunion_id)
);

-- Budget items
CREATE TABLE budget_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  estimated DECIMAL(10,2) DEFAULT 0,
  actual DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  source TEXT DEFAULT 'manual', -- 'manual', 'program', 'vendor'
  source_id UUID, -- Reference to program event or vendor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- VENUES
--=====================================================
-- Venue options
CREATE TABLE venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  capacity INTEGER,
  cost DECIMAL(10,2),
  contact TEXT,
  phone TEXT,
  pros TEXT[],
  cons TEXT[],
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status venue_status DEFAULT 'considering',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- PROGRAM AND EVENTS
--=====================================================
-- Program events
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration INTEGER, -- minutes
  location TEXT,
  owner TEXT,
  tags TEXT[],
  category TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- COMMUNICATION
--=====================================================
-- Communication templates and messages
CREATE TABLE communications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'save-the-date', 'reminder', 'thank-you', etc.
  subject TEXT,
  content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- TRAVEL AND LODGING
--=====================================================
-- Travel information
CREATE TABLE travel_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES reunion_members(id),
  name TEXT NOT NULL,
  travel_method TEXT, -- 'Flying', 'Driving', etc.
  arrival_date DATE,
  departure_date DATE,
  accommodation TEXT,
  needs_pickup BOOLEAN DEFAULT false,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lodging options
CREATE TABLE lodging_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  rate TEXT,
  discount TEXT,
  availability TEXT DEFAULT 'Available',
  pros TEXT[],
  cons TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- FOOD AND BEVERAGE
--=====================================================
-- Meal planning
CREATE TABLE food_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  meal_date DATE NOT NULL,
  meal_time TIME,
  type TEXT, -- 'Catered', 'Buffet', 'Plated', etc.
  vendor TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  attendees INTEGER,
  status TEXT DEFAULT 'pending',
  budget_synced BOOLEAN DEFAULT false,
  program_linked BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- VENDOR MANAGEMENT
--=====================================================
-- Vendors
CREATE TABLE vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  status vendor_status DEFAULT 'contacted',
  cost DECIMAL(10,2) DEFAULT 0,
  budget_synced BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- CONTINGENCY PLANNING
--=====================================================
-- Risk management
CREATE TABLE contingency_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  scenario TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('Low', 'Medium', 'High')),
  probability TEXT CHECK (probability IN ('Low', 'Medium', 'High')),
  plan TEXT NOT NULL,
  owner TEXT,
  status TEXT DEFAULT 'identified', -- 'identified', 'planned', 'prepared'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL, -- 'primary', 'secondary', 'vendor', 'emergency'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- REFLECTIONS AND FEEDBACK
--=====================================================
-- Post-event reflections
CREATE TABLE reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  successes TEXT,
  challenges TEXT,
  improvements TEXT,
  highlights TEXT,
  future_events TEXT,
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reunion_id)
);

-- Attendee feedback
CREATE TABLE feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE NOT NULL,
  attendee_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  category TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--=====================================================
-- TRIGGERS AND FUNCTIONS
--=====================================================
-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reunions_updated_at BEFORE UPDATE ON reunions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vision_data_updated_at BEFORE UPDATE ON vision_data FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_travel_info_updated_at BEFORE UPDATE ON travel_info FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_food_plans_updated_at BEFORE UPDATE ON food_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reflections_updated_at BEFORE UPDATE ON reflections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
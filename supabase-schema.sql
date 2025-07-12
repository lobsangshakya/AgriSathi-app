-- Supabase Database Schema for AgriSathi App

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE consultation_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  land_size TEXT,
  experience TEXT,
  agri_creds INTEGER DEFAULT 0,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  language TEXT DEFAULT 'hindi',
  crops TEXT[] DEFAULT '{}',
  stats JSONB DEFAULT '{"postsShared": 0, "helpfulAnswers": 0, "questionsAsked": 0, "creditsEarned": 0}',
  achievements JSONB DEFAULT '[]',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop recommendations table
CREATE TABLE crop_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  location TEXT NOT NULL,
  season TEXT,
  description TEXT,
  benefits TEXT[],
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disease detections table
CREATE TABLE disease_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post comments table
CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experts table
CREATE TABLE experts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER,
  avatar_url TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  consultation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultations table
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency urgency_level DEFAULT 'medium',
  status consultation_status DEFAULT 'pending',
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data table
CREATE TABLE weather_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity INTEGER,
  wind_speed DECIMAL(5,2),
  precipitation DECIMAL(5,2),
  forecast JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_crop_recommendations_location ON crop_recommendations(location);
CREATE INDEX idx_disease_detections_user_id ON disease_detections(user_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_expert_id ON consultations(expert_id);
CREATE INDEX idx_weather_data_location ON weather_data(location);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Crop recommendations: Public read access
CREATE POLICY "Anyone can view crop recommendations" ON crop_recommendations
  FOR SELECT USING (true);

-- Disease detections: Users can only access their own detections
CREATE POLICY "Users can view own disease detections" ON disease_detections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease detections" ON disease_detections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community posts: Public read, authenticated users can create
CREATE POLICY "Anyone can view community posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Post comments: Public read, authenticated users can create
CREATE POLICY "Anyone can view comments" ON post_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Experts: Public read access
CREATE POLICY "Anyone can view experts" ON experts
  FOR SELECT USING (true);

-- Consultations: Users can only access their own consultations
CREATE POLICY "Users can view own consultations" ON consultations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create consultations" ON consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations" ON consultations
  FOR UPDATE USING (auth.uid() = user_id);

-- Weather data: Public read access
CREATE POLICY "Anyone can view weather data" ON weather_data
  FOR SELECT USING (true);

-- Notifications: Users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'language', 'hindi')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample crop recommendations
INSERT INTO crop_recommendations (crop_name, location, season, description, benefits, requirements) VALUES
('Wheat', 'Uttar Pradesh', 'Rabi', 'High-yielding wheat variety suitable for UP climate', ARRAY['High yield', 'Disease resistant'], '{"soil_type": "loamy", "water_requirement": "moderate"}'),
('Rice', 'Uttar Pradesh', 'Kharif', 'Basmati rice variety for premium quality', ARRAY['Premium quality', 'High market value'], '{"soil_type": "clayey", "water_requirement": "high"}'),
('Sugarcane', 'Uttar Pradesh', 'Year-round', 'High-sugar content variety', ARRAY['High sugar content', 'Good for processing'], '{"soil_type": "loamy", "water_requirement": "high"}'),
('Mustard', 'Uttar Pradesh', 'Rabi', 'Oil-rich mustard variety', ARRAY['High oil content', 'Drought resistant'], '{"soil_type": "sandy loam", "water_requirement": "low"}');

-- Sample experts
INSERT INTO experts (name, specialization, experience_years, bio, rating) VALUES
('Dr. Rajesh Kumar', 'Crop Diseases', 15, 'Expert in identifying and treating crop diseases with 15 years of experience', 4.8),
('Dr. Priya Singh', 'Soil Management', 12, 'Specialist in soil health and nutrient management', 4.9),
('Dr. Amit Patel', 'Organic Farming', 10, 'Expert in organic farming techniques and sustainable agriculture', 4.7),
('Dr. Meera Sharma', 'Water Management', 18, 'Specialist in irrigation systems and water conservation', 4.6);

-- Sample weather data
INSERT INTO weather_data (location, temperature, humidity, wind_speed, precipitation, forecast) VALUES
('Meerut, UP', 28.5, 65, 12.5, 0.0, '{"today": {"temp": 28.5, "condition": "sunny"}, "tomorrow": {"temp": 30.2, "condition": "partly_cloudy"}}'); 
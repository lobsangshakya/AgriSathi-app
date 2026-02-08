-- AgriSathi Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    land_size TEXT,
    experience TEXT,
    language TEXT DEFAULT 'hindi',
    crops TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    agri_creds INTEGER DEFAULT 0,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'voice')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disease analysis history table
CREATE TABLE IF NOT EXISTS public.disease_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    disease_name TEXT,
    confidence DECIMAL(5,2),
    severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
    recommendations TEXT[] DEFAULT '{}',
    preventive_measures TEXT[] DEFAULT '{}',
    treatment TEXT[] DEFAULT '{}',
    scientific_name TEXT,
    symptoms TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data table (cached)
CREATE TABLE IF NOT EXISTS public.weather_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location TEXT NOT NULL,
    temperature DECIMAL(5,2),
    humidity INTEGER,
    wind_speed DECIMAL(5,2),
    description TEXT,
    icon TEXT,
    forecast JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- User achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    points INTEGER NOT NULL,
    icon TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User statistics table
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    posts_shared INTEGER DEFAULT 0,
    helpful_answers INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    credits_earned INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disease_analysis_user_id ON public.disease_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_location ON public.weather_data(location);
CREATE INDEX IF NOT EXISTS idx_weather_data_expires_at ON public.weather_data(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Community posts policies
CREATE POLICY "Anyone can view community posts" ON public.community_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Disease analysis policies
CREATE POLICY "Users can view own disease analysis" ON public.disease_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own disease analysis" ON public.disease_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Weather data policies (public read access)
CREATE POLICY "Anyone can view weather data" ON public.weather_data
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage weather data" ON public.weather_data
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.uid() = user_id);

-- User statistics policies
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default user stats when new user is created
CREATE OR REPLACE FUNCTION public.create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_stats (user_id, posts_shared, helpful_answers, questions_asked, credits_earned)
    VALUES (NEW.id, 0, 0, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_stats_trigger
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.create_user_stats();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.community_posts TO authenticated;
GRANT ALL ON public.chat_messages TO authenticated;
GRANT ALL ON public.disease_analysis TO authenticated;
GRANT ALL ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_stats TO authenticated;
GRANT SELECT ON public.weather_data TO anon, authenticated;

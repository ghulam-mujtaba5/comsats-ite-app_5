-- COMSATS ITE App - Complete Database Schema (Clean Version)
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lost and Found Items
CREATE TABLE IF NOT EXISTS lost_found_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('lost', 'found')),
    item_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'closed')),
    image_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News and Announcements
CREATE TABLE IF NOT EXISTS news_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'event', 'announcement', 'deadline')),
    is_important BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'cultural', 'sports', 'workshop', 'seminar')),
    organizer VARCHAR(255) NOT NULL,
    capacity INTEGER,
    registration_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Support Resources
CREATE TABLE IF NOT EXISTS support_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('mental_health', 'academic', 'financial', 'career', 'health')),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('article', 'contact', 'service', 'link')),
    content TEXT,
    contact_info VARCHAR(255),
    external_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Requests
CREATE TABLE IF NOT EXISTS support_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    support_type VARCHAR(50) NOT NULL CHECK (support_type IN ('mental_health', 'academic', 'financial', 'career', 'health', 'other')),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guidance Content
CREATE TABLE IF NOT EXISTS guidance_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'career', 'policies', 'procedures', 'resources')),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('guide', 'policy', 'procedure', 'resource')),
    is_published BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ Items
CREATE TABLE IF NOT EXISTS faq_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'admission', 'fees', 'facilities', 'general')),
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty Members
CREATE TABLE IF NOT EXISTS faculty (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    office VARCHAR(100),
    phone VARCHAR(20),
    specialization TEXT[],
    courses TEXT[],
    education TEXT[],
    experience TEXT,
    profile_image TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources (Files and Links)
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(100),
    term VARCHAR(50),
    external_url TEXT,
    file_url TEXT,
    size_bytes BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community and Moderation Tables
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'hidden', 'deleted')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'hidden', 'deleted')),
    reports_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('post', 'comment')),
    content_id UUID NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    reporter_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moderation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('post', 'comment')),
    content_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    reason TEXT,
    moderator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'COMSATS ITE App',
    site_description TEXT DEFAULT 'Student portal for COMSATS University',
    site_logo_url TEXT,
    contact_email VARCHAR(255) DEFAULT 'admin@comsats.edu.pk',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    registration_enabled BOOLEAN DEFAULT TRUE,
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx', 'jpg', 'png'],
    theme_color VARCHAR(7) DEFAULT '#3b82f6',
    announcement_text TEXT,
    announcement_enabled BOOLEAN DEFAULT FALSE,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_found_category ON lost_found_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_found_status ON lost_found_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_found_created_at ON lost_found_items(created_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_items(published_at);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_support_resources_category ON support_resources(category);
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_guidance_content_category ON guidance_content(category);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_status ON community_comments(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_content_type ON content_reports(content_type);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_content_type ON moderation_logs(content_type);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to all tables
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lost_found_items_updated_at BEFORE UPDATE ON lost_found_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_items_updated_at BEFORE UPDATE ON news_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_resources_updated_at BEFORE UPDATE ON support_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_requests_updated_at BEFORE UPDATE ON support_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guidance_content_updated_at BEFORE UPDATE ON guidance_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_reports_updated_at BEFORE UPDATE ON content_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admin Users - Only admins can manage
CREATE POLICY "Only admins can view admin users" ON admin_users FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Only admins can manage admin users" ON admin_users FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Lost and Found Items - Users can read all, create their own, update/delete their own
CREATE POLICY "Anyone can view lost and found items" ON lost_found_items FOR SELECT USING (true);
CREATE POLICY "Users can create lost and found items" ON lost_found_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own items" ON lost_found_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own items" ON lost_found_items FOR DELETE USING (auth.uid() = user_id);

-- News Items - Everyone can read published items
CREATE POLICY "Anyone can view published news" ON news_items FOR SELECT USING (true);
CREATE POLICY "Only admins can manage news" ON news_items FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Events - Everyone can read published events
CREATE POLICY "Anyone can view published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can manage events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Event Registrations - Users can register and view their own registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create registrations" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all registrations" ON event_registrations FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Support Resources - Everyone can read published resources
CREATE POLICY "Anyone can view published support resources" ON support_resources FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can manage support resources" ON support_resources FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Support Requests - Users can create and view their own requests
CREATE POLICY "Users can view their own support requests" ON support_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create support requests" ON support_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all support requests" ON support_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage support requests" ON support_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Guidance Content - Everyone can read published content
CREATE POLICY "Anyone can view published guidance content" ON guidance_content FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can manage guidance content" ON guidance_content FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- FAQ Items - Everyone can read published FAQs
CREATE POLICY "Anyone can view published FAQs" ON faq_items FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can manage FAQs" ON faq_items FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Faculty - Everyone can read published faculty
CREATE POLICY "Anyone can view published faculty" ON faculty FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can manage faculty" ON faculty FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Resources - Everyone can read resources
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Only admins can manage resources" ON resources FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Community Posts - Users can read all, create their own, admins can moderate
CREATE POLICY "Anyone can view active community posts" ON community_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create community posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can moderate all posts" ON community_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Community Comments - Users can read all, create their own, admins can moderate
CREATE POLICY "Anyone can view active community comments" ON community_comments FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create community comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can moderate all comments" ON community_comments FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Content Reports - Users can create reports, admins can manage
CREATE POLICY "Users can create content reports" ON content_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all reports" ON content_reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage reports" ON content_reports FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Moderation Logs - Only admins can view
CREATE POLICY "Only admins can view moderation logs" ON moderation_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Only admins can create moderation logs" ON moderation_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Site Settings - Only admins can manage
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can manage site settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Note: To create the admin user, you need to:
-- 1. Go to your Supabase Auth dashboard
-- 2. Create a user with email: admin@cuilahore.edu.pk and password: admin123
-- 3. Then run this SQL to grant admin privileges:

-- INSERT INTO admin_users (user_id, role, permissions)
-- SELECT 
--     id,
--     'super_admin',
--     ARRAY['all']
-- FROM auth.users 
-- WHERE email = 'admin@cuilahore.edu.pk'
-- ON CONFLICT (user_id) DO UPDATE SET
--     role = 'super_admin',
--     permissions = ARRAY['all'];

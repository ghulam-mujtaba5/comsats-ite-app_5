-- Create blog_articles table for blog posts and articles
-- This table will be used for the integrated blog/article section in guidance and information pages

CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'campus-life', 'career', 'technology', 'research', 'events', 'general')),
  tags TEXT[] DEFAULT '{}',
  author_name VARCHAR(255) NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  featured_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  campus_id UUID REFERENCES campuses(id),
  department_id UUID REFERENCES departments(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_articles_featured ON blog_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_articles_campus ON blog_articles(campus_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_department ON blog_articles(department_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON blog_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view published articles
CREATE POLICY "Anyone can view published articles" ON blog_articles
  FOR SELECT USING (is_published = true);

-- Admins can view all articles
CREATE POLICY "Admins can view all articles" ON blog_articles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Admins can insert articles
CREATE POLICY "Admins can insert articles" ON blog_articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update their own articles
CREATE POLICY "Admins can update their articles" ON blog_articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    ) AND (author_id = auth.uid() OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role = 'super_admin'
    ))
  );

-- Admins can delete their own articles
CREATE POLICY "Admins can delete their articles" ON blog_articles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role IN ('admin', 'super_admin')
    ) AND (author_id = auth.uid() OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.role = 'super_admin'
    ))
  );

-- Add comments for documentation
COMMENT ON TABLE blog_articles IS 'Blog articles and posts for the guidance and information section';
COMMENT ON COLUMN blog_articles.slug IS 'URL-friendly version of the title';
COMMENT ON COLUMN blog_articles.excerpt IS 'Short summary of the article content';
COMMENT ON COLUMN blog_articles.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN blog_articles.featured_image_url IS 'URL to the featured image for the article';
COMMENT ON COLUMN blog_articles.is_featured IS 'Whether the article should be prominently displayed';
COMMENT ON COLUMN blog_articles.view_count IS 'Number of times the article has been viewed';
COMMENT ON COLUMN blog_articles.campus_id IS 'Optional campus filter for the article';
COMMENT ON COLUMN blog_articles.department_id IS 'Optional department filter for the article';
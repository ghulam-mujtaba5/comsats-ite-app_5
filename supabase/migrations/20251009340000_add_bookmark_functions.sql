-- Add functions to increment and decrement bookmarks count
-- These functions will be used by the bookmarks API

-- Function to increment bookmarks count
CREATE OR REPLACE FUNCTION increment_bookmarks_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts 
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement bookmarks count
CREATE OR REPLACE FUNCTION decrement_bookmarks_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts 
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment shares count
CREATE OR REPLACE FUNCTION increment_shares_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts 
  SET shares_count = shares_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION increment_bookmarks_count IS 'Increment the bookmarks count for a post';
COMMENT ON FUNCTION decrement_bookmarks_count IS 'Decrement the bookmarks count for a post';
COMMENT ON FUNCTION increment_shares_count IS 'Increment the shares count for a post';
-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample reunion types and initial data
-- This helps with testing and demonstrates the schema

-- Note: This is optional sample data
-- Remove or modify for production use

-- Sample reunion (will be created by actual users in production)
-- INSERT INTO reunions (title, description, type, planned_date, created_by) VALUES
-- ('Smith Family Reunion 2024', 'Annual gathering of the Smith family', 'family', '2024-07-15', auth.uid());

-- Sample budget categories for reference
-- These can be used as defaults in the application
INSERT INTO budget_items (reunion_id, category, item, estimated, actual, notes, source) 
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid as reunion_id,
  'Reference' as category,
  'Sample Categories' as item,
  0 as estimated,
  0 as actual,
  'Available categories: Venue, Food & Beverage, Entertainment, Decorations, Photography/Video, Transportation, Invitations, Gifts/Favors, Miscellaneous' as notes,
  'system' as source
WHERE FALSE; -- This prevents actual insertion, just documents the categories
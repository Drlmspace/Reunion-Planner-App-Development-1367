-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunion_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE lodging_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contingency_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- REUNION POLICIES
-- =====================================================

-- Users can view reunions they created or are members of
CREATE POLICY "Users can view their reunions" ON reunions FOR SELECT USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM reunion_members 
    WHERE reunion_members.reunion_id = reunions.id 
    AND reunion_members.user_id = auth.uid()
  )
);

-- Users can create reunions
CREATE POLICY "Users can create reunions" ON reunions FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update reunions they created or are co-planners of
CREATE POLICY "Users can update their reunions" ON reunions FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM reunion_members 
    WHERE reunion_members.reunion_id = reunions.id 
    AND reunion_members.user_id = auth.uid()
    AND reunion_members.role IN ('lead_planner', 'co_planner')
  )
);

-- Users can delete reunions they created
CREATE POLICY "Users can delete their reunions" ON reunions FOR DELETE USING (auth.uid() = created_by);

-- =====================================================
-- REUNION MEMBERS POLICIES
-- =====================================================

-- Users can view members of reunions they're part of
CREATE POLICY "Users can view reunion members" ON reunion_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM reunions 
    WHERE reunions.id = reunion_members.reunion_id 
    AND (
      reunions.created_by = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM reunion_members rm2 
        WHERE rm2.reunion_id = reunions.id 
        AND rm2.user_id = auth.uid()
      )
    )
  )
);

-- Reunion creators and co-planners can manage members
CREATE POLICY "Planners can manage reunion members" ON reunion_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM reunions 
    WHERE reunions.id = reunion_members.reunion_id 
    AND (
      reunions.created_by = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM reunion_members rm2 
        WHERE rm2.reunion_id = reunions.id 
        AND rm2.user_id = auth.uid()
        AND rm2.role IN ('lead_planner', 'co_planner')
      )
    )
  )
);

-- =====================================================
-- CHAPTER DATA POLICIES
-- =====================================================

-- Generic policy for chapter data access
CREATE OR REPLACE FUNCTION user_has_reunion_access(reunion_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM reunions 
    WHERE reunions.id = reunion_id_param 
    AND (
      reunions.created_by = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM reunion_members 
        WHERE reunion_members.reunion_id = reunion_id_param 
        AND reunion_members.user_id = auth.uid()
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply access policies to all chapter data tables
CREATE POLICY "Reunion access for vision_data" ON vision_data FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for committee_members" ON committee_members FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for budgets" ON budgets FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for budget_items" ON budget_items FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for venues" ON venues FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for events" ON events FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for communications" ON communications FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for rsvps" ON rsvps FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for travel_info" ON travel_info FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for lodging_options" ON lodging_options FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for food_plans" ON food_plans FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for vendors" ON vendors FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for contingency_plans" ON contingency_plans FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for emergency_contacts" ON emergency_contacts FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for reflections" ON reflections FOR ALL USING (user_has_reunion_access(reunion_id));
CREATE POLICY "Reunion access for feedback" ON feedback FOR ALL USING (user_has_reunion_access(reunion_id));

-- =====================================================
-- PUBLIC RSVP ACCESS
-- =====================================================

-- Allow public RSVP submissions (for invitation links)
CREATE POLICY "Allow public RSVP view for invited guests" ON rsvps FOR SELECT USING (true);
CREATE POLICY "Allow public RSVP insert for invited guests" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public RSVP update for invited guests" ON rsvps FOR UPDATE USING (true);
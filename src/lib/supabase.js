import { createClient } from '@supabase/supabase-js'

// Project credentials - these will be replaced during deployment
const SUPABASE_URL = 'https://ifpirxmbzfcyyihucyhj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcGlyeG1iemZjeXlpaHVjeWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMDMyNTYsImV4cCI6MjA2NzU3OTI1Nn0.jt5xx7InveCwrJWVyiHUbgtJB3cNC129ZaXTFxTTIA0'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export { supabase };
export default supabase;
export const isSupabaseAvailable = true;

// Database table names
export const TABLES = {
  REUNIONS: 'reunions',
  USERS: 'users',
  REUNION_MEMBERS: 'reunion_members',
  VISION_DATA: 'vision_data',
  COMMITTEE_MEMBERS: 'committee_members',
  BUDGETS: 'budgets',
  BUDGET_ITEMS: 'budget_items',
  VENUES: 'venues',
  EVENTS: 'events',
  COMMUNICATIONS: 'communications',
  TRAVEL_INFO: 'travel_info',
  LODGING_OPTIONS: 'lodging_options',
  FOOD_PLANS: 'food_plans',
  VENDORS: 'vendors',
  CONTINGENCY_PLANS: 'contingency_plans',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  REFLECTIONS: 'reflections',
  FEEDBACK: 'feedback'
};

// User roles
export const USER_ROLES = {
  LEAD_PLANNER: 'lead_planner',
  CO_PLANNER: 'co_planner',
  VIEW_ONLY: 'view_only',
  ATTENDEE: 'attendee'
};

// Reunion types
export const REUNION_TYPES = {
  FAMILY: 'family',
  CLASS: 'class',
  MILITARY: 'military',
  CORPORATE: 'corporate',
  OTHER: 'other'
};
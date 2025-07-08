import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

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
  RSVPS: 'rsvps',
  ATTENDEES: 'attendees',
  TRAVEL_INFO: 'travel_info',
  FOOD_PLANS: 'food_plans',
  VENDORS: 'vendors',
  CONTINGENCY_PLANS: 'contingency_plans',
  REFLECTIONS: 'reflections'
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
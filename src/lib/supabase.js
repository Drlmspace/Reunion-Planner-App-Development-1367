import { createClient } from '@supabase/supabase-js';

// Get environment variables (these should be set in your deployment environment)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we have valid Supabase credentials
const hasValidCredentials = 
  supabaseUrl !== 'https://placeholder-project.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 50;

// Create Supabase client with fallback values for preview build
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null; // Set to null if no valid credentials

// Export a flag to check if Supabase is available
export const isSupabaseAvailable = hasValidCredentials;

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
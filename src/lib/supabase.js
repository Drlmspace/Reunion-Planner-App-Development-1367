import { createClient } from '@supabase/supabase-js'

// Get environment variables (these should be set in your deployment environment)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('.supabase.co') && 
  supabaseAnonKey.length > 50

// Create Supabase client - always create it for proper initialization
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) : createClient(
  'https://placeholder.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

// Export a flag to check if Supabase is available
export const isSupabaseAvailable = hasValidCredentials

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
  TRAVEL_INFO: 'travel_info',
  LODGING_OPTIONS: 'lodging_options',
  FOOD_PLANS: 'food_plans',
  VENDORS: 'vendors',
  CONTINGENCY_PLANS: 'contingency_plans',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  REFLECTIONS: 'reflections',
  FEEDBACK: 'feedback'
}

// User roles
export const USER_ROLES = {
  LEAD_PLANNER: 'lead_planner',
  CO_PLANNER: 'co_planner',
  VIEW_ONLY: 'view_only',
  ATTENDEE: 'attendee'
}

// Reunion types
export const REUNION_TYPES = {
  FAMILY: 'family',
  CLASS: 'class',
  MILITARY: 'military',
  CORPORATE: 'corporate',
  OTHER: 'other'
}

// API helper functions (only work if Supabase is available)
export const api = {
  // Reunion operations
  reunions: {
    getAll: async () => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.REUNIONS).select('*').order('created_at', { ascending: false })
    },
    create: async (reunion) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.REUNIONS).insert(reunion).select().single()
    },
    update: async (id, updates) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.REUNIONS).update(updates).eq('id', id).select().single()
    },
    delete: async (id) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.REUNIONS).delete().eq('id', id)
    }
  },

  // Vision data operations
  vision: {
    get: async (reunionId) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.VISION_DATA).select('*').eq('reunion_id', reunionId).single()
    },
    upsert: async (data) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.VISION_DATA).upsert(data).select().single()
    }
  },

  // Budget operations
  budget: {
    getItems: async (reunionId) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.BUDGET_ITEMS).select('*').eq('reunion_id', reunionId)
    },
    addItem: async (item) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.BUDGET_ITEMS).insert(item).select().single()
    },
    updateItem: async (id, updates) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.BUDGET_ITEMS).update(updates).eq('id', id).select().single()
    },
    deleteItem: async (id) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.BUDGET_ITEMS).delete().eq('id', id)
    }
  },

  // Event operations
  events: {
    getAll: async (reunionId) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.EVENTS).select('*').eq('reunion_id', reunionId).order('event_date', { ascending: true })
    },
    create: async (event) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.EVENTS).insert(event).select().single()
    },
    update: async (id, updates) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.EVENTS).update(updates).eq('id', id).select().single()
    },
    delete: async (id) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.EVENTS).delete().eq('id', id)
    }
  },

  // RSVP operations
  rsvps: {
    getAll: async (reunionId) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.RSVPS).select('*').eq('reunion_id', reunionId)
    },
    create: async (rsvp) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.RSVPS).insert(rsvp).select().single()
    },
    update: async (id, updates) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.RSVPS).update(updates).eq('id', id).select().single()
    }
  },

  // Vendor operations
  vendors: {
    getAll: async (reunionId) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.VENDORS).select('*').eq('reunion_id', reunionId)
    },
    create: async (vendor) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.VENDORS).insert(vendor).select().single()
    },
    update: async (id, updates) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.VENDORS).update(updates).eq('id', id).select().single()
    },
    delete: async (id) => {
      if (!isSupabaseAvailable) throw new Error('Supabase not available')
      return supabase.from(TABLES.VENDORS).delete().eq('id', id)
    }
  }
}
# Supabase Backend Setup Guide

## 🚀 Quick Setup (5 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and project name
   - Select region (closest to your users)
   - Set database password (save this!)
   - Wait for project to initialize (~2 minutes)

2. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key
   - Save these for step 4

3. **Set Up Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to create all tables
   - Copy and paste the contents of `supabase/migrations/002_row_level_security.sql`
   - Click "Run" to set up security policies

4. **Configure Your App**
   - Create a `.env.local` file in your project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   - Replace with your actual credentials from step 2

5. **Test Connection**
   - Run `npm run dev`
   - Try creating an account and logging in
   - Create a test reunion to verify everything works

## ✅ That's it! Your app now has a real backend.

## 🔧 Advanced Configuration

### Authentication Settings
- **Email Confirmations**: Disabled by default for easier testing
- **Sign-up**: Enabled by default
- **Password Requirements**: Set in Auth > Settings

### Database Features Included
- ✅ **12 Planning Chapters**: All data structures
- ✅ **User Authentication**: Email/password signup
- ✅ **Real-time Updates**: Changes sync across devices
- ✅ **Row Level Security**: Users only see their data
- ✅ **Data Relationships**: Proper foreign keys and constraints
- ✅ **Automatic Timestamps**: Created/updated tracking
- ✅ **UUID Primary Keys**: Secure, non-guessable IDs

### Production Deployment
For production, set environment variables in your hosting platform:

**Netlify/Vercel:**
- Add environment variables in dashboard
- Use the same names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Other Platforms:**
- Create `.env.production` file with your credentials
- Ensure the file is deployed with your app

## 📊 Database Schema Overview

### Core Tables
- `users` - User profiles and roles
- `reunions` - Main reunion records
- `reunion_members` - Who's invited/participating

### Chapter Data Tables
- `vision_data` - Chapter 1: Vision & Intention
- `committee_members` - Chapter 2: Planning Committee
- `budgets` & `budget_items` - Chapter 3: Date & Budget
- `venues` - Chapter 4: Venue Planning
- `events` - Chapter 5: Program Builder
- `communications` - Chapter 6: Communication
- `rsvps` - Chapter 7: RSVP Management
- `travel_info` & `lodging_options` - Chapter 8: Travel & Lodging
- `food_plans` - Chapter 9: Food & Beverage
- `vendors` - Chapter 10: Vendor Management
- `contingency_plans` & `emergency_contacts` - Chapter 11: Contingency
- `reflections` & `feedback` - Chapter 12: Debrief & Reflection

### Security Features
- **Row Level Security (RLS)**: Users can only access their own reunion data
- **Authenticated Access**: All operations require valid user login
- **Role-based Permissions**: Different access levels for planners vs attendees
- **Secure by Default**: All tables protected against unauthorized access

## 🔍 Testing Your Setup

1. **Create Account**: Sign up with a new email
2. **Create Reunion**: Add your first reunion
3. **Test Chapters**: Try adding data in different chapters
4. **Invite Members**: Add committee members or attendees
5. **Check Permissions**: Create a second account and verify they can't see the first user's data

## 🆘 Troubleshooting

**Connection Issues:**
- Verify your environment variables are correct
- Check that your Supabase project is running (green status)
- Ensure you're using the anon/public key, not the service role key

**Permission Errors:**
- Run the RLS migration again
- Check that Row Level Security is enabled on all tables
- Verify user authentication is working

**Data Not Saving:**
- Check browser console for detailed error messages
- Verify table schemas match the migration files
- Ensure your user has proper permissions

## 🎯 Next Steps

- **Customize**: Modify the schema for your specific needs
- **Enhance**: Add more fields or tables as needed
- **Scale**: Supabase handles scaling automatically
- **Monitor**: Use Supabase dashboard to monitor usage
- **Backup**: Supabase includes automatic daily backups

Your Reunion Planner now has enterprise-grade backend infrastructure! 🎉
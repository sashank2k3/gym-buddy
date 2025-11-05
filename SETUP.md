# Gym Buddy Setup Instructions

## Database Setup

**IMPORTANT:** You need to run the following SQL in your Supabase SQL Editor to create the database tables.

1. Go to your Supabase project at https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `server/db-setup.sql` into the SQL editor
5. Click "Run" to execute the SQL

The SQL file is located at: `server/db-setup.sql`

This will create:
- **users** table - Store user accounts with admin privileges
- **workouts** table - Store weekly workout plans per user
- **exercises** table - Store individual exercises for each workout day
- **exercise_logs** table - Track weight and set completion history

## Default Admin Account

After running the SQL setup, you can login with:
- **Username:** admin
- **Password:** admin123

⚠️ **IMPORTANT:** Change the admin password in production!

## Features

### User Authentication
- Login/logout with session management
- Admin and regular user roles

### Workout Management
- Pre-loaded weekly workout plan (Monday-Sunday)
- Add custom exercises to any day
- Delete exercises
- Full CRUD operations on workouts

### Progress Tracking
- Log weight for each exercise
- Mark sets as complete
- View previous workout history
- Track progress over time

### User Management (Admin Only)
- Create new users
- Delete users
- View all users
- Export/Import user data (coming soon)

## Application Structure

```
client/
  src/
    components/      # Reusable UI components
    pages/          # Main application pages
    lib/            # Utilities and configurations
server/
  routes.ts        # API endpoints
  supabase.ts      # Supabase client configuration
  db-setup.sql     # Database schema
shared/
  schema.ts        # TypeScript types
  defaultWorkout.ts # Default workout data
```

## Environment Variables

The following environment variables are already configured:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side admin key

## Next Steps

1. Run the database setup SQL (see above)
2. Login with admin credentials
3. Create additional users if needed
4. Start tracking your workouts!

## Troubleshooting

If you see "Failed to fetch workouts" or similar errors:
1. Make sure you ran the SQL setup in Supabase
2. Check that all environment variables are set correctly
3. Verify your Supabase project is active
4. Check the browser console for specific error messages

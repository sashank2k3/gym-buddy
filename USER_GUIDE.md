# Gym Buddy User Guide

## Getting Started

### First Time Setup

1. **Run Database Setup**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `server/db-setup.sql`
   - Paste and run the SQL to create all tables
   - The default admin user will be created automatically

2. **Login**
   - Open the application
   - Use the default credentials:
     - Username: `admin`
     - Password: `admin123`
   - ⚠️ **Important:** Change this password in production!

## Features

### Tracking Your Workouts

1. **View Weekly Plan**
   - After logging in, you'll see your weekly workout schedule (Monday-Sunday)
   - Each day shows a summary of exercises
   - Click on any day to expand and see exercises

2. **Complete a Workout**
   - Click on a day card to expand it
   - Click on an exercise to expand its details
   - Enter the weight you're using (in kg)
   - Tap each set number (1, 2, 3, 4) to mark it complete
     - Tapped sets turn green ✓
     - Track your progress in real-time
   - Click "Save Progress" to log your workout

3. **View Previous Weights**
   - When you expand an exercise, you'll see:
     - "Previous: 65kg on Jan 10"
   - This helps you track progressive overload

4. **Add Custom Exercises**
   - Expand any day
   - Click "Add Exercise" at the bottom
   - Fill in:
     - Exercise name (e.g., "Bench Press")
     - Reps (e.g., "12")
     - Sets (e.g., "3")
     - Rest time in seconds (e.g., "60")
     - Notes (optional, e.g., "Keep elbows at 45°")
   - Click "Add Exercise"

5. **Delete Exercises**
   - Expand an exercise
   - Click the trash icon
   - The exercise will be removed

### Admin Features (Admin Users Only)

1. **Managing Users**
   - Click your avatar in the top right
   - Select "Manage Users"
   - Or click the "Manage Users" tab

2. **Create New Users**
   - Click "Add User"
   - Enter:
     - Name (e.g., "John Doe")
     - Username (e.g., "johndoe")
     - Password (users should change this after first login)
   - Click "Create User"

3. **Delete Users**
   - Find the user in the list
   - Click the trash icon next to their name
   - ⚠️ Note: You cannot delete the admin user

4. **Export/Import Users** (Coming Soon)
   - Export user credentials to share with friends
   - Import users from JSON files

## Tips for Best Results

### During Workouts
- **Large Buttons:** All interactive elements are sized for easy tapping with sweaty hands
- **Quick Updates:** Mark sets complete between rests
- **Weight Logging:** Enter weight before starting your first set
- **Save Often:** Click "Save Progress" after completing each exercise

### Progressive Overload
- Always check your previous weight before starting
- Aim to increase weight or reps each week
- The app tracks this automatically for you

### Customization
- Modify the default workout plan to match your routine
- Add exercises specific to your goals
- Remove exercises you don't perform

## Logging Out
- Click your avatar in the top right
- Select "Logout"
- Your data is saved automatically

## Troubleshooting

### "Failed to fetch workouts"
- Make sure you ran the database setup SQL in Supabase
- Check that all environment variables are configured
- Try logging out and back in

### "Invalid credentials"
- Double-check your username and password
- Remember: usernames are case-sensitive
- Admin password is `admin123` by default

### Exercises not saving
- Make sure you clicked "Save Progress"
- Check your internet connection
- Try refreshing the page

### Can't add exercises
- Expand the day first
- Make sure you're logged in
- Fill in all required fields (name, reps, sets, rest)

## Mobile Use
- The app is optimized for mobile devices
- Add to your home screen for quick access
- Works great on tablets and phones
- Portrait mode recommended for best experience

## Support
For issues or questions, check the `SETUP.md` file or contact your system administrator.

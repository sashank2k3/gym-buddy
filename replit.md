# Gym Buddy - Workout Tracking Application

## Project Overview
Gym Buddy is a mobile-first workout tracking application built with React, Express, and Supabase. It allows users to manage weekly workout routines, track exercise progress, log weights, and monitor workout history.

## Recent Changes (Nov 5, 2025)
- ✅ Integrated Supabase for data persistence
- ✅ Implemented secure authentication with bcrypt password hashing
- ✅ Built complete CRUD operations for exercises and workouts
- ✅ Added weight logging with history tracking
- ✅ Implemented set completion tracking
- ✅ Created admin user management functionality
- ✅ Added session management with Express sessions
- ✅ Initialized default workout plans for all 7 days

## User Preferences
- Mobile-first design approach for easy gym use
- Large touch targets for workout tracking
- High contrast for visibility during workouts
- Quick access to workout history and progress

## Project Architecture

### Frontend (React + TypeScript)
- **Components:**
  - `LoginForm` - User authentication
  - `Header` - Navigation and user menu
  - `WorkoutDayCard` - Collapsible day sections with exercises
  - `ExerciseCard` - Individual exercise tracking with set completion
  - `UserManagement` - Admin panel for creating/managing users

- **Pages:**
  - `WorkoutsPage` - Main workout tracking interface
  - `ManageUsersPage` - Admin user management

- **State Management:**
  - TanStack Query for server state
  - React hooks for local state
  - Session-based authentication

### Backend (Express + TypeScript)
- **Authentication:** Session-based auth with bcrypt password hashing
- **Database:** Supabase (PostgreSQL)
- **API Routes:**
  - `/api/auth/*` - Login, logout, session management
  - `/api/users` - User CRUD operations (admin only)
  - `/api/workouts` - Workout data with auto-initialization
  - `/api/exercises` - Exercise CRUD operations
  - `/api/exercise-logs` - Weight and completion tracking

### Database Schema
- **users** - User accounts with admin privileges
- **workouts** - Weekly workout plans per user
- **exercises** - Individual exercises for each workout day
- **exercise_logs** - History of weights and completed sets

## Key Features
1. **User Authentication** - Secure login with hashed passwords
2. **Workout Management** - Pre-loaded weekly plans + custom exercises
3. **Progress Tracking** - Weight logging and set completion
4. **History** - View previous workouts and weights
5. **Admin Panel** - User management for gym owners/trainers

## Setup Requirements
1. **Database Setup** - Must run `server/db-setup.sql` in Supabase SQL Editor
2. **Environment Variables** - Configured via Replit Secrets
3. **Default Admin** - username: `admin`, password: `admin123`

## Tech Stack
- **Frontend:** React 18, TypeScript, TailwindCSS, Shadcn UI
- **Backend:** Express, TypeScript, Express-Session
- **Database:** Supabase (PostgreSQL)
- **State:** TanStack Query
- **Security:** bcryptjs for password hashing
- **Validation:** Zod schemas

## Development Guidelines
- Mobile-first responsive design
- Large touch targets (44px minimum)
- High contrast for gym visibility
- Session-based auth (no JWT)
- All passwords hashed with bcrypt
- Supabase service role key for admin operations only

## Next Steps
- [ ] Add exercise history charts
- [ ] Implement export/import workout data
- [ ] Add workout templates
- [ ] Progressive overload recommendations
- [ ] Social features for sharing workouts

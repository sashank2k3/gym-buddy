import { supabaseAdmin } from './supabase';

export async function initializeDatabase() {
  try {
    // Create users table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    // Create workouts table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workouts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          day_name TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, day_name)
        );
      `
    });

    // Create exercises table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS exercises (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
          exercise_name TEXT NOT NULL,
          reps TEXT NOT NULL,
          sets TEXT NOT NULL,
          rest TEXT NOT NULL,
          notes TEXT,
          order_index INTEGER NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    // Create exercise_logs table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS exercise_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
          weight TEXT,
          completed_sets INTEGER DEFAULT 0,
          date TIMESTAMPTZ DEFAULT NOW(),
          notes TEXT
        );
      `
    });

    // Create default admin user if not exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', 'admin')
      .single();

    if (!existingAdmin) {
      await supabaseAdmin.from('users').insert({
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        name: 'Admin User',
        is_admin: true
      });
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't throw - let the app continue even if tables already exist
  }
}

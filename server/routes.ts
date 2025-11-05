import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase";
import { DEFAULT_WORKOUT } from "@shared/defaultWorkout";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password hash
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.isAdmin = user.is_admin;

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        isAdmin: user.is_admin
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Fetch user data to get the name
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, username, name, is_admin')
        .eq('id', req.session.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Session invalid' });
      }

      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        isAdmin: user.is_admin
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  // User management routes (admin only)
  app.get("/api/users", async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id, username, name, is_admin')
        .order('created_at', { ascending: true });

      if (error) throw error;
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { username, password, name } = req.body;

      if (!username || !password || !name) {
        return res.status(400).json({ error: 'Username, password, and name required' });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .insert({ username, password: hashedPassword, name, is_admin: false })
        .select('id, username, name, is_admin')
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Username already exists' });
        }
        throw error;
      }

      res.json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.delete("/api/users/:username", async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { username } = req.params;

      if (username === 'admin') {
        return res.status(400).json({ error: 'Cannot delete admin user' });
      }

      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('username', username);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { data: workouts, error } = await supabaseAdmin
        .from('workouts')
        .select(`
          *,
          exercises (*)
        `)
        .eq('user_id', req.session.userId)
        .order('day_name');

      if (error) throw error;

      // If no workouts, initialize with defaults
      if (!workouts || workouts.length === 0) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const initializedWorkouts = [];

        for (const day of days) {
          const { data: workout, error: workoutError } = await supabaseAdmin
            .from('workouts')
            .insert({
              user_id: req.session.userId,
              day_name: day
            })
            .select()
            .single();

          if (workoutError) throw workoutError;

          const exercises = DEFAULT_WORKOUT[day as keyof typeof DEFAULT_WORKOUT] || [];
          const exerciseData = exercises.map((ex, index) => ({
            workout_id: workout.id,
            exercise_name: ex.exercise,
            reps: ex.reps,
            sets: ex.sets,
            rest: ex.rest,
            notes: ex.notes || '',
            order_index: index
          }));

          const { data: insertedExercises, error: exerciseError } = await supabaseAdmin
            .from('exercises')
            .insert(exerciseData)
            .select();

          if (exerciseError) throw exerciseError;

          initializedWorkouts.push({
            ...workout,
            exercises: insertedExercises
          });
        }

        return res.json(initializedWorkouts);
      }

      res.json(workouts);
    } catch (error) {
      console.error('Workout fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch workouts' });
    }
  });

  // Exercise routes
  app.post("/api/exercises", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { workoutId, exerciseName, reps, sets, rest, notes, orderIndex } = req.body;

      const { data: exercise, error } = await supabaseAdmin
        .from('exercises')
        .insert({
          workout_id: workoutId,
          exercise_name: exerciseName,
          reps,
          sets,
          rest,
          notes: notes || '',
          order_index: orderIndex
        })
        .select()
        .single();

      if (error) throw error;
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create exercise' });
    }
  });

  app.delete("/api/exercises/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const { error } = await supabaseAdmin
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete exercise' });
    }
  });

  // Exercise log routes
  app.post("/api/exercise-logs", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { exerciseId, weight, completedSets, notes } = req.body;

      const { data: log, error } = await supabaseAdmin
        .from('exercise_logs')
        .insert({
          user_id: req.session.userId,
          exercise_id: exerciseId,
          weight,
          completed_sets: completedSets,
          notes: notes || ''
        })
        .select()
        .single();

      if (error) throw error;
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create exercise log' });
    }
  });

  app.get("/api/exercise-logs/:exerciseId", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { exerciseId } = req.params;

      const { data: logs, error } = await supabaseAdmin
        .from('exercise_logs')
        .select('*')
        .eq('user_id', req.session.userId)
        .eq('exercise_id', exerciseId)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      res.json(logs || []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercise logs' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

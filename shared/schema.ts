import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  dayName: text("day_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id").notNull().references(() => workouts.id),
  exerciseName: text("exercise_name").notNull(),
  reps: text("reps").notNull(),
  sets: text("sets").notNull(),
  rest: text("rest").notNull(),
  notes: text("notes"),
  orderIndex: integer("order_index").notNull(),
});

export const exerciseLogs = pgTable("exercise_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseId: varchar("exercise_id").notNull().references(() => exercises.id),
  weight: text("weight"),
  completedSets: integer("completed_sets").notNull().default(0),
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertExerciseLogSchema = createInsertSchema(exerciseLogs).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type ExerciseLog = typeof exerciseLogs.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertExerciseLog = z.infer<typeof insertExerciseLogSchema>;

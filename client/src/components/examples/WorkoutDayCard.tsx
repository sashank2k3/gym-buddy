import WorkoutDayCard from '../WorkoutDayCard';

export default function WorkoutDayCardExample() {
  const exercises = [
    { id: '1', exercise_name: 'Warmup (stretches)', reps: '15', sets: '1', rest: '30', notes: 'Neck/shoulder rotations', order_index: 0 },
    { id: '2', exercise_name: 'Bench Press', reps: '12', sets: '3', rest: '60', notes: 'Keep elbows at 45 degrees', order_index: 1 },
    { id: '3', exercise_name: 'Incline Dumbbell Press', reps: '12', sets: '3', rest: '60', notes: '', order_index: 2 },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <WorkoutDayCard
        workoutId="example-workout-id"
        day="Monday"
        exercises={exercises}
      />
    </div>
  );
}

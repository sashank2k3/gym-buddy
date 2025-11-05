import ExerciseCard from '../ExerciseCard';

export default function ExerciseCardExample() {
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <ExerciseCard
        exerciseId="example-1"
        workoutId="example-workout"
        exercise="Bench Press"
        reps="12"
        sets="3"
        rest="60"
        notes="Keep elbows at 45 degrees"
        onDelete={() => console.log('Delete clicked')}
      />
      <ExerciseCard
        exerciseId="example-2"
        workoutId="example-workout"
        exercise="Squats"
        reps="15"
        sets="4"
        rest="90"
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import WorkoutDayCard from "@/components/WorkoutDayCard";
import { Dumbbell } from "lucide-react";

interface WorkoutsPageProps {
  userId: string;
}

export default function WorkoutsPage({ userId }: WorkoutsPageProps) {
  const { data: workouts, isLoading } = useQuery({
    queryKey: ['/api/workouts'],
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-center py-12">
          <Dumbbell className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  const sortedWorkouts = Array.isArray(workouts) ? [...workouts].sort((a: any, b: any) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(a.day_name) - days.indexOf(b.day_name);
  }) : [];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Weekly Workout Plan</h2>
        <p className="text-muted-foreground">
          Track your progress and complete your exercises
        </p>
      </div>
      {sortedWorkouts?.map((workout: any) => (
        <WorkoutDayCard
          key={workout.id}
          workoutId={workout.id}
          day={workout.day_name}
          exercises={workout.exercises || []}
        />
      ))}
    </div>
  );
}

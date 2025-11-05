import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExerciseCard from "./ExerciseCard";

interface Exercise {
  id: string;
  exercise_name: string;
  reps: string;
  sets: string;
  rest: string;
  notes?: string;
  order_index: number;
}

interface WorkoutDayCardProps {
  workoutId: string;
  day: string;
  exercises: Exercise[];
}

export default function WorkoutDayCard({ workoutId, day, exercises }: WorkoutDayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    reps: '12',
    sets: '3',
    rest: '60',
    notes: ''
  });
  const { toast } = useToast();

  const completedCount = 0;
  const totalExercises = exercises.length;
  const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  const addExerciseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId,
          exerciseName: newExercise.name,
          reps: newExercise.reps,
          sets: newExercise.sets,
          rest: newExercise.rest,
          notes: newExercise.notes,
          orderIndex: exercises.length
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      setAddDialogOpen(false);
      setNewExercise({ name: '', reps: '12', sets: '3', rest: '60', notes: '' });
      toast({
        title: "Exercise Added",
        description: "New exercise has been added to your workout"
      });
    }
  });

  const handleAddExercise = () => {
    if (newExercise.name) {
      addExerciseMutation.mutate();
    }
  };

  return (
    <Card className="overflow-hidden">
      <div
        className="p-4 hover-elevate active-elevate-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        data-testid={`card-day-${day.toLowerCase()}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-xl font-bold uppercase tracking-wide">{day}</h2>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalExercises} exercises
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            data-testid={`button-toggle-${day.toLowerCase()}`}
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 pt-2 space-y-3 border-t">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exerciseId={ex.id}
              workoutId={workoutId}
              exercise={ex.exercise_name}
              reps={ex.reps}
              sets={ex.sets}
              rest={ex.rest}
              notes={ex.notes}
            />
          ))}
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12"
                data-testid="button-add-exercise"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Exercise</DialogTitle>
                <DialogDescription>
                  Add a new exercise to {day}'s workout
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    placeholder="e.g., Bench Press"
                    data-testid="input-exercise-name"
                    className="h-12"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                      data-testid="input-reps"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                      data-testid="input-sets"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rest">Rest (s)</Label>
                    <Input
                      id="rest"
                      type="number"
                      value={newExercise.rest}
                      onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                      data-testid="input-rest"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                    placeholder="e.g., Keep elbows at 45 degrees"
                    data-testid="input-notes"
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={handleAddExercise}
                  disabled={!newExercise.name || addExerciseMutation.isPending}
                  className="w-full"
                  data-testid="button-confirm-add"
                >
                  {addExerciseMutation.isPending ? 'Adding...' : 'Add Exercise'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Card>
  );
}

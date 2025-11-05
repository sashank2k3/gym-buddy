import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Trash2, Edit3, Info, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ExerciseCardProps {
  exerciseId: string;
  workoutId: string;
  exercise: string;
  reps: string;
  sets: string;
  rest: string;
  notes?: string;
  onDelete?: () => void;
}

export default function ExerciseCard({
  exerciseId,
  workoutId,
  exercise,
  reps,
  sets,
  rest,
  notes,
  onDelete,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [weight, setWeight] = useState("");
  const [completedSets, setCompletedSets] = useState<boolean[]>(
    Array(parseInt(sets) || 0).fill(false)
  );
  const { toast } = useToast();

  const { data: logs } = useQuery({
    queryKey: ['/api/exercise-logs', exerciseId],
    enabled: expanded && !!exerciseId
  });

  const saveLogMutation = useMutation({
    mutationFn: async () => {
      const completedCount = completedSets.filter(Boolean).length;
      const response = await apiRequest('/api/exercise-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          weight,
          completedSets: completedCount,
          notes: ''
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/exercise-logs', exerciseId] });
      toast({
        title: "Progress Saved",
        description: "Your workout has been logged"
      });
    }
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/exercises/${exerciseId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      toast({
        title: "Exercise Deleted",
        description: "Exercise has been removed"
      });
    }
  });

  useEffect(() => {
    if (logs && Array.isArray(logs) && logs.length > 0) {
      const latest = logs[0];
      if (latest.weight) setWeight(latest.weight);
    }
  }, [logs]);

  const toggleSet = (index: number) => {
    const newSets = [...completedSets];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);
  };

  const handleSaveProgress = () => {
    if (weight || completedSets.some(Boolean)) {
      saveLogMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      deleteExerciseMutation.mutate();
    }
  };

  const completedCount = completedSets.filter(Boolean).length;
  const totalSets = completedSets.length;
  const isComplete = completedCount === totalSets && totalSets > 0;

  const latestLog = Array.isArray(logs) && logs.length > 0 ? logs[0] : null;

  return (
    <Card className="overflow-hidden">
      <div
        className="p-4 hover-elevate active-elevate-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        data-testid={`card-exercise-${exercise.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base leading-tight ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
              {exercise}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {reps} reps
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {sets} sets
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {rest}s rest
              </Badge>
              {totalSets > 0 && (
                <Badge variant={isComplete ? "default" : "outline"} className="text-xs">
                  {completedCount}/{totalSets}
                </Badge>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            data-testid={`button-toggle-${exercise.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 space-y-4 border-t">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 h-12 text-lg font-semibold"
                data-testid="input-weight"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">kg</span>
            </div>
            {latestLog && latestLog.weight && (
              <p className="text-xs text-muted-foreground">
                Previous: <span className="font-medium">{latestLog.weight}kg</span> on{' '}
                {format(new Date(latestLog.date), 'MMM d')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Complete Sets</p>
            <div className="grid grid-cols-4 gap-2">
              {completedSets.map((checked, index) => (
                <button
                  key={index}
                  onClick={() => toggleSet(index)}
                  className={`h-12 flex items-center justify-center rounded-md border-2 transition-colors ${
                    checked
                      ? 'bg-success border-success text-success-foreground'
                      : 'bg-background border-border hover-elevate'
                  }`}
                  data-testid={`checkbox-set-${index + 1}`}
                >
                  <span className="font-semibold">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {notes && (
            <div className="flex gap-2 p-3 bg-muted rounded-md">
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveProgress}
              disabled={saveLogMutation.isPending}
              className="flex-1"
              data-testid="button-save-progress"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveLogMutation.isPending ? 'Saving...' : 'Save Progress'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteExerciseMutation.isPending}
              data-testid="button-delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

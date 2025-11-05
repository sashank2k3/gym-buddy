import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import UserManagement from "@/components/UserManagement";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ManageUsersPage() {
  const { toast } = useToast();
  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/users']
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ username, password, name }: { username: string; password: string; name: string }) => {
      return apiRequest('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Created",
        description: "New user has been added successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create User",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (username: string) => {
      return apiRequest(`/api/users/${username}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Deleted",
        description: "User has been removed"
      });
    },
    onError: () => {
      toast({
        title: "Failed to Delete User",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">User Management</h2>
        <p className="text-muted-foreground">
          Create and manage gym buddy users
        </p>
      </div>
      <UserManagement
        users={Array.isArray(users) ? users : []}
        onCreateUser={(username, password, name) => {
          createUserMutation.mutate({ username, password, name });
        }}
        onDeleteUser={(username) => {
          deleteUserMutation.mutate(username);
        }}
      />
    </div>
  );
}

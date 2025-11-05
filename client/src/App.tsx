import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
import WorkoutsPage from "@/pages/WorkoutsPage";
import ManageUsersPage from "@/pages/ManageUsersPage";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users } from "lucide-react";

interface User {
  id: string;
  username: string;
  name: string;
  isAdmin: boolean;
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'workouts' | 'users'>('workouts');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({
          id: data.id,
          username: data.username,
          name: data.name,
          isAdmin: data.isAdmin
        });
      }
    } catch (error) {
      console.log('No active session');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }

      const data = await response.json();
      setCurrentUser({
        id: data.id,
        username: data.username,
        name: data.name,
        isAdmin: data.isAdmin
      });
      toast({
        title: "Welcome!",
        description: `Logged in as ${data.name}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setCurrentView('workouts');
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "See you next time!"
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={currentUser.name}
        isAdmin={currentUser.isAdmin}
        onLogout={handleLogout}
        onManageUsers={() => setCurrentView('users')}
      />
      
      <div className="border-b">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-2 py-3">
            <Button
              variant={currentView === 'workouts' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('workouts')}
              data-testid="button-workouts-tab"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Workouts
            </Button>
            {currentUser.isAdmin && (
              <Button
                variant={currentView === 'users' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('users')}
                data-testid="button-users-tab"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
          </div>
        </div>
      </div>

      <main>
        {currentView === 'workouts' ? (
          <WorkoutsPage userId={currentUser.id} />
        ) : (
          <ManageUsersPage />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

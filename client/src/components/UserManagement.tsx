import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Trash2, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface User {
  username: string;
  name: string;
}

interface UserManagementProps {
  users: User[];
  onCreateUser?: (username: string, password: string, name: string) => void;
  onDeleteUser?: (username: string) => void;
}

export default function UserManagement({ users, onCreateUser, onDeleteUser }: UserManagementProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && name && onCreateUser) {
      onCreateUser(username, password, name);
      setUsername("");
      setPassword("");
      setName("");
      setOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1" data-testid="button-add-user">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the gym buddy system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  data-testid="input-new-name"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  data-testid="input-new-username"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-testid="input-new-password"
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-create-user">
                Create User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant="outline" data-testid="button-export">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" data-testid="button-import">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-base font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
                {onDeleteUser && user.username !== 'admin' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteUser(user.username)}
                    data-testid={`button-delete-${user.username}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

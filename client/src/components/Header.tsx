import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dumbbell, LogOut, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  onManageUsers?: () => void;
  isAdmin?: boolean;
}

export default function Header({ userName, onLogout, onManageUsers, isAdmin }: HeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Gym Buddy</h1>
        </div>

        {userName && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                data-testid="button-user-menu"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm font-semibold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && onManageUsers && (
                <DropdownMenuItem onClick={onManageUsers} data-testid="menu-manage-users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </DropdownMenuItem>
              )}
              {onLogout && (
                <DropdownMenuItem onClick={onLogout} data-testid="menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}


import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Monitor } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface ProfileMenuProps {
  collapsed: boolean;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ collapsed }) => {
  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleViewProfile = () => {
    console.log('Viewing profile...');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleViewProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="flex items-center">
            <Monitor className="mr-2 h-4 w-4" />
            <span>Theme</span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

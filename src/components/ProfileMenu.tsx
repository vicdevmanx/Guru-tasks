
import React from 'react';
import { User, Settings, LogOut, Palette, Shield, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';

interface ProfileMenuProps {
  collapsed: boolean;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ collapsed }) => {
  const userName = "John Doe";
  const userEmail = "john.doe@example.com";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full justify-start gap-3 h-12 px-3 hover:bg-accent transition-smooth ${
            collapsed ? 'px-2' : ''
          }`}
        >
          <Avatar className="w-8 h-8 ring-2 ring-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs text-muted-foreground mt-1">{userEmail}</p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 animate-in fade-in-0 zoom-in-95 duration-200" 
        align={collapsed ? "start" : "end"} 
        side={collapsed ? "right" : "top"}
      >
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-border">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <div className="p-2">
              <ThemeToggle />
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuItem className="cursor-pointer">
          <Shield className="mr-2 h-4 w-4" />
          Privacy & Security
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

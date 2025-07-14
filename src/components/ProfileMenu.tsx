import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  Palette,
  Shield,
  HelpCircle,
  ChevronsUpDown,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/authstore";
import { useTheme } from "@/hooks/useTheme";

interface ProfileMenuProps {
  collapsed: boolean;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ collapsed }) => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const { theme, setTheme } = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate("/login");
    // Add logout logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 h-12 px-3 hover:bg-accent transition-smooth ${
            collapsed ? "px-2" : ""
          }`}
        >
          <Avatar className="w-8 h-8 ring-2 ring-border">
            {user && user?.profile_pic ? (
              <img
                src={user.profile_pic}
                alt={userName}
                className="object-cover w-full"
              />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            )}
          </Avatar>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          )}

          {!collapsed && <ChevronsUpDown />}
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
              {user && user?.profile_pic ? (
                <img
                  src={user.profile_pic}
                  alt={userName}
                  className="object-cover w-full"
                />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            if(!user) return
            handleNavigation(`/profile/${user.id}`)
          }}
        >
          <User className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleNavigation("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className=" p-2 flex flex-col gap-1 cursor-pointer">
                  <div onClick={() => setTheme('light')} className='flex gap-1 items-center p-1 rounded-lg text-sm hover:bg-primary px-2' style={{background: theme == 'light' ? "rgb(59 130 246 / 0.8)" : "transparent", color: theme == 'light' ? "white" : ""}}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </div>
                  <div onClick={() => setTheme('dark')} className='flex gap-1 items-center p-1 rounded-lg text-sm hover:bg-primary px-2' style={{background: theme == 'dark' ? "rgb(59 130 246 / 0.8)" : "transparent", color: theme == 'dark' ? "white" : ""}}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </div>
                  <div onClick={() => setTheme('system')} className='flex gap-1 items-center p-1 rounded-lg text-sm hover:bg-primary px-2' style={{background: theme == 'system' ? "rgb(59 130 246 / 0.8)" : "transparent", color: theme == 'system' ? "white" : ""}}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
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

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

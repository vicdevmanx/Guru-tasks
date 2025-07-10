
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Plus,
  Search
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useProjects } from '@/hooks/useProjects';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { GlobalSearch } from '@/components/GlobalSearch';
import { useState } from 'react';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'Team', url: '/team', icon: Users },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { projects } = useProjects();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  
  const collapsed = state === "collapsed";
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) =>
    isActive(path) 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-accent hover:text-accent-foreground";

  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Sidebar 
        className={`transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'} border-r`}
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-border p-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xs">PM</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground text-sm truncate">Project Manager</h2>
                <p className="text-xs text-muted-foreground truncate">Team Workspace</p>
              </div>
            )}
          </div>
          
          {/* Global Search */}
          {!collapsed && (
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground mt-3 h-8 text-xs"
              onClick={() => setShowGlobalSearch(true)}
            >
              <Search className="h-3 w-3 mr-2" />
              Search...
              <kbd className="ml-auto text-xs bg-muted px-1 rounded">⌘K</kbd>
            </Button>
          )}
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-8">
                      <Link 
                        to={item.url} 
                        className={`${getNavClass(item.url)} transition-colors text-sm`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <div className="flex items-center justify-between px-2 py-1">
              {!collapsed && (
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Projects
                </SidebarGroupLabel>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-accent"
                onClick={() => setShowCreateProject(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {projects.slice(0, 5).map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild className="h-8">
                      <Link 
                        to={`/project/${project.id}`}
                        className={`${getNavClass(`/project/${project.id}`)} transition-colors text-sm`}
                      >
                        <div className="w-3 h-3 rounded bg-primary/20 flex-shrink-0" />
                        {!collapsed && (
                          <span className="truncate text-xs">{project.name}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-2">
          <ProfileMenu collapsed={collapsed} />
        </SidebarFooter>
      </Sidebar>

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
      
      <GlobalSearch
        open={showGlobalSearch}
        onOpenChange={setShowGlobalSearch}
      />
    </>
  );
}

export { AppSidebar as Sidebar };


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, FolderKanban, Plus } from 'lucide-react';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';

export const Sidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { projects, addProject } = useProjects();

  const mainItems = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Profile', url: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleAddProject = () => {
    const name = prompt('Enter project name:');
    if (name?.trim()) {
      addProject(name.trim());
    }
  };

  return (
    <SidebarUI className={collapsed ? 'w-14' : 'w-64'} collapsible>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="bg-card border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="text-muted-foreground">Projects</SidebarGroupLabel>
            {!collapsed && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddProject}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/project/${project.id}`}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }
                    >
                      <FolderKanban className="h-4 w-4" />
                      {!collapsed && <span>{project.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  );
};

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Search,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useState } from "react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Team", url: "/team", icon: Users },
  // { title: 'Calendar', url: '/calendar', icon: Calendar },

  { title: "Settings", url: "/settings", icon: Settings },
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
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "hover:bg-accent hover:text-accent-foreground";

  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Sidebar
        className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">GT</span>
            </div> */}
              🎯{" "}
              {!collapsed && (
                <div>
                  <h2 className="font-bold text-foreground">Guru Tasks</h2>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Team Workspace
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Global Search */}
          {!collapsed && (
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground mt-3"
              onClick={() => setShowGlobalSearch(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search...
              <kbd className="ml-auto text-xs bg-muted px-1 rounded">⌘K</kbd>
            </Button>
          )}
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`${getNavClass(item.url)} transition-colors`}
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

          <SidebarGroup className={`${collapsed && 'flex flex-col items-center'}`}>
            <div className="flex items-center justify-between">
              {!collapsed && (
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Projects
                </SidebarGroupLabel>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent"
                onClick={() => setShowCreateProject(true)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects &&
                  projects.slice(0, 5).map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/project/${project.id}`}
                          className={`${getNavClass(
                            `/project/${project.id}`
                          )} transition-colors`}
                        >
                          {project && project?.image ? (
                            <img
                              src={
                                typeof project.image === "string"
                                  ? project.image
                                  : undefined
                              }
                              alt={project.name}
                              className="object-cover w-5 h-5 flex-grow-1 rounded"
                            />
                          ) : (
                            <div className="text-xs w-5 h-5 rounded bg-primary/20 flex-grow-1 flex items-center justify-center">
                              {project.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                          {/* <div className="w-4 h-4 rounded bg-primary/20 flex-shrink-0" /> */}
                          {!collapsed && (
                            <span className="truncate">{project.name}</span>
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

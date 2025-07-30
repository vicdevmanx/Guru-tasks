import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { ProjectMenu } from "@/components/ProjectMenu";
import type { Project } from "@/hooks/useProjects";
import { EditProjectDialog } from "@/components/EditProjectDialog";

export const Projects = () => {
  const { projects, deleteProject } = useProjects();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects =
    projects &&
    projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );


  const handleEditProject = (project: Project) => {
    setShowEditProject(true)
    setSelectedProject(project)
  }

  const handleDeleteProject = (projectId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your projects
          </p>
        </div>
        <Button onClick={() => setShowCreateProject(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects &&
            filteredProjects.map((project) => {
              const completionRate =
                project.tasks.length > 0
                  ? (project.tasks.filter((task) => task.status === "done")
                      .length /
                      project.tasks.length) *
                    100
                  : 0;

              return (
                <div key={project.id} className="group relative">
                  <Link to={`/project/${project.id}`}>
                    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-1">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1 h-10 p-0">
                              {project.description || "No description provided"}
                            </CardDescription>
                          </div>
                          <div onClick={(e) => e.preventDefault()}>
                            <ProjectMenu
                              project={project}
                              onEdit={() => {handleEditProject(project)}}
                              onDelete={() => handleDeleteProject(project.id)}
                              onDuplicate={() => {}}
                              onArchive={() => {}}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pb-5 pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {project.tasks.length} tasks
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {
                                  project.tasks.filter(
                                    (task) => task.status === "done"
                                  ).length
                                }{" "}
                                completed
                              </span>
                            </div>
                          </div>

                          {/* Team Avatars */}
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {project.project_members
                                .slice(0, 3)
                                .map((user, index) => (
                                  <Avatar
                                    key={user.user.id}
                                    className="border-2 border-background w-6 h-6"
                                  >
                                    {user && user?.user.profile_pic ? (
                                      <img
                                        src={user.user.profile_pic}
                                        alt={user.user.name}
                                        className="object-cover w-full"
                                      />
                                    ) : (
                                      <AvatarFallback className="text-xs">
                                        {user.user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                ))}
                              {project.project_members.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                  +{project.project_members.length - 3}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary">
                              {Math.round(completionRate)}% complete
                            </Badge>
                          </div>

                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProjects &&
            filteredProjects.map((project) => {
              const completionRate =
                project.tasks.length > 0
                  ? (project.tasks.filter((task) => task.status === "done")
                      .length /
                      project.tasks.length) *
                    100
                  : 0;

              return (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Link
                          to={`/project/${project.id}`}
                          className="hover:underline"
                        >
                          <h3 className="font-semibold">{project.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description || "No description provided"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{project.tasks.length}</span>
                        </div>

                        <div className="flex -space-x-1">
                          {project.project_members.slice(0, 3).map((user) => (
                            <Avatar
                              key={user.user.id}
                              className="border-2 border-background w-6 h-6"
                            >
                              <AvatarFallback className="text-xs">
                                {user.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>

                        <Badge variant="secondary">
                          {Math.round(completionRate)}%
                        </Badge>

                        <ProjectMenu
                          project={project}
                          onEdit={() => {}}
                          onDelete={() => handleDeleteProject(project.id)}
                          onDuplicate={() => {}}
                          onArchive={() => {}}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />

      <EditProjectDialog
        open={showEditProject}
        onOpenChange={setShowEditProject}
        project={selectedProject}
      />
    </div>
  );
};

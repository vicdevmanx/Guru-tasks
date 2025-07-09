
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, CheckCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { EditProjectDialog } from '@/components/EditProjectDialog';
import { ProjectMenu } from '@/components/ProjectMenu';
import type { Project } from '@/hooks/useProjects';

export const Home = () => {
  const { projects, deleteProject } = useProjects();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.status === 'done').length,
    0
  );

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditProject(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
    }
  };

  const handleDuplicateProject = (project: Project) => {
    // TODO: Implement project duplication
    console.log('Duplicate project:', project.name);
  };

  const handleArchiveProject = (project: Project) => {
    // TODO: Implement project archiving
    console.log('Archive project:', project.name);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and tasks</p>
        </div>
        <Button 
          onClick={() => setShowCreateProject(true)} 
          className="gap-2 transition-smooth hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transition-smooth hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="group relative">
              <Link to={`/project/${project.id}`}>
                <Card className="hover:shadow-lg transition-smooth cursor-pointer hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <div onClick={(e) => e.preventDefault()}>
                        <ProjectMenu
                          project={project}
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDeleteProject(project.id)}
                          onDuplicate={() => handleDuplicateProject(project)}
                          onArchive={() => handleArchiveProject(project)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{project.tasks.length} tasks</span>
                      <span>
                        {project.tasks.filter(task => task.status === 'done').length} completed
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: project.tasks.length > 0
                            ? `${(project.tasks.filter(task => task.status === 'done').length / project.tasks.length) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>

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

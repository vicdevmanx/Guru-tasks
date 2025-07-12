
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building, 
  Edit3,
  Settings,
  Shield,
  Bell,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

export const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { users, projects } = useProjects();
  
  // If userId is provided, show that user's profile, otherwise show current user
  const user = userId 
    ? users.find(u => u.id === userId) || users[0] // Fallback to first user if not found
    : {
        id: 'current',
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Project Manager",
        department: "Engineering",
        avatar: ''
      };

  const isOwnProfile = !userId || userId === 'current';
  
  // Get user's project involvement
  const userProjects = projects.filter(project => 
    project.assignees.some(assignee => assignee.id === user.id) ||
    project.tasks.some(task => task.assignees.some(assignee => assignee.id === user.id))
  );

  const userTasks = projects.flatMap(project =>
    project.tasks.filter(task => 
      task.assignees.some(assignee => assignee.id === user.id)
    )
  );

  const completedTasks = userTasks.filter(task => task.status === 'done');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {isOwnProfile ? 'My Profile' : `${user.name}'s Profile`}
        </h1>
        <div className="flex items-center gap-2">
          {!isOwnProfile && (
            <>
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Follow
              </Button>
            </>
          )}
          {isOwnProfile && (
            <Button className="gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24 ring-4 ring-border">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.department}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Joined January 2023</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information - Only show for own profile */}
          {isOwnProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue="Experienced project manager with a passion for delivering high-quality software solutions."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isOwnProfile ? 'My Projects' : `${user.name}'s Projects`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userProjects.slice(0, 5).map(project => {
                  const userTasksInProject = project.tasks.filter(task =>
                    task.assignees.some(assignee => assignee.id === user.id)
                  );
                  const completedInProject = userTasksInProject.filter(task => task.status === 'done');
                  const completion = userTasksInProject.length > 0 
                    ? Math.round((completedInProject.length / userTasksInProject.length) * 100)
                    : 0;

                  return (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{completion}%</p>
                          <p className="text-xs text-muted-foreground">
                            {completedInProject.length}/{userTasksInProject.length} tasks
                          </p>
                        </div>
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings - Only show for own profile */}
          {isOwnProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about your projects</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Manage your privacy preferences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

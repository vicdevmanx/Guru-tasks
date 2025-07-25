import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BriefcaseBusiness,
  Edit3,
  Settings,
  Shield,
  Bell,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useAuthStore } from "@/store/authstore";
import { access } from "fs";

export const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { projects } = useProjects();
  const users = useAuthStore((s) => s.users);
  const eachUser = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  // If userId is provided, show that user's profile, otherwise show current user
  const user =
    userId && users
      ? users.find((u) => u.id === userId) || users[0] // Fallback to first user if not found
      : {
          id: "current",
          name: "John Doe",
          email: "john.doe@example.com",
          access_role: "member",
          user_roles: { name: "Engineering" },
          profile_pic: "",
          suspended: false,
        };

  const isOwnProfile = !userId || userId === "current";
  const OwnProfile = eachUser && eachUser.id == user.id;
  const fetchAllUsers = useAuthStore((s) => s.fetchAllUsers);
  useEffect(() => {
    // if (users) return;
    fetchAllUsers();
  }, []);

  // Get user's project involvement
  const userProjects =
    projects &&
    projects.filter(
      (project) =>
        project?.project_members?.some(
          (assignee) => assignee.user.id === user.id
        ) ||
        project.tasks.some((task) =>
          task.assignees.some((assignee) => assignee.id === user.id)
        )
    );

  const userTasks =
    projects &&
    projects.flatMap((project) =>
      project.tasks.filter((task) =>
        task.assignees.some((assignee) => assignee.id === user.id)
      )
    );

  const completedTasks =
    userTasks && userTasks.filter((task) => task.status === "done");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {isOwnProfile ? "My Profile" : `${user.name}'s Profile`}
        </h1>
        <div className="flex items-center gap-2">
          {/* {!isOwnProfile && (
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
          )} */}
          {OwnProfile && (
            <Button className="gap-2" onClick={() => navigate("/settings")}>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1 h-[24rem]">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-start space-y-4">
              <Avatar className="w-24 h-24 rounded-xl ring-4 ring-border">
                {user && user?.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="object-cover w-full"
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-xl text-left">{user.name}</CardTitle>
                <p className="text-muted-foreground text-left">
                  {user.access_role}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.user_roles?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Joined January 2023</span>
            </div>
            <Badge
              variant={"secondary"}
              className={`px-4 py-1 text-white, ${
                user.suspended ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {user.suspended ? "Suspended" : "Active"}
            </Badge>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {userProjects && userProjects.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {userTasks && userTasks.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {completedTasks && completedTasks.length}
                  </p>
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
                {isOwnProfile ? "My Projects" : `${user.name}'s Projects`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userProjects &&
                  userProjects.slice(0, 5).map((project) => {
                    const userTasksInProject = project.tasks.filter((task) =>
                      task.assignees.some((assignee) => assignee.id === user.id)
                    );
                    const completedInProject = userTasksInProject.filter(
                      (task) => task.status === "done"
                    );
                    const completion =
                      userTasksInProject.length > 0
                        ? Math.round(
                            (completedInProject.length /
                              userTasksInProject.length) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description || "No description"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{completion}%</p>
                            <p className="text-xs text-muted-foreground">
                              {completedInProject.length}/
                              {userTasksInProject.length} tasks
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
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your projects
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Manage your privacy preferences
                    </p>
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

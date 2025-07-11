
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  BarChart3,
  Calendar,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

export const Home = () => {
  const { projects, users } = useProjects();

  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'done').length, 0
  );
  const inProgressTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'in-progress').length, 0
  );
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold">Good morning, John! 👋</h1>
           <p className="text-muted-foreground mt-1">
             You have 3 tasks due today and 6 in progress. Let's get things done!
           </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/projects">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.length > 0 ? '+12% from last month' : 'Create your first project'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Active tasks
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Active members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map(project => {
                  const projectCompletionRate = project.tasks.length > 0 
                    ? Math.round((project.tasks.filter(t => t.status === 'done').length / project.tasks.length) * 100)
                    : 0;

                  return (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <Link to={`/project/${project.id}`} className="block group">
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {project.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <Progress value={projectCompletionRate} className="w-20" />
                              <span className="text-xs text-muted-foreground">
                                {projectCompletionRate}%
                              </span>
                            </div>
                            <div className="flex -space-x-1">
                              {project.assignees.slice(0, 3).map(user => (
                                <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.assignees.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                  <span className="text-xs">+{project.assignees.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects yet</p>
                  <Button asChild className="mt-2">
                    <Link to="/projects">Create Your First Project</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/projects">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/team">
                  <Users className="h-4 w-4 mr-2" />
                  View Team
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.slice(0, 3).map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};





// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/hooks/use-toast"
// import { 
//   BarChart3, 
//   Calendar, 
//   CheckCircle2, 
//   Clock, 
//   Plus, 
//   TrendingUp,
//   Users,
//   AlertCircle
// } from "lucide-react"

// const recentTasks = [
//   {
//     id: 1,
//     title: "Update user authentication system",
//     project: "Backend Overhaul",
//     priority: "High",
//     status: "In Progress",
//     dueDate: "Tomorrow"
//   },
//   {
//     id: 2,
//     title: "Design new dashboard layout",
//     project: "UI/UX Refresh",
//     priority: "Medium",
//     status: "To Do",
//     dueDate: "Next week"
//   },
//   {
//     id: 3,
//     title: "Fix mobile responsive issues",
//     project: "Frontend Polish",
//     priority: "High",
//     status: "Review",
//     dueDate: "Today"
//   }
// ]

// const stats = [
//   {
//     title: "Total Tasks",
//     value: "24",
//     change: "+12%",
//     icon: BarChart3,
//     color: "text-primary"
//   },
//   {
//     title: "Completed",
//     value: "18",
//     change: "+8%",
//     icon: CheckCircle2,
//     color: "text-success"
//   },
//   {
//     title: "In Progress",
//     value: "6",
//     change: "+4",
//     icon: Clock,
//     color: "text-warning"
//   },
//   {
//     title: "Team Members",
//     value: "12",
//     change: "+2",
//     icon: Users,
//     color: "text-brand-blue"
//   }
// ]

// // Sample team members for assignment
// const teamMembers = [
//   { id: 1, name: "John Doe", email: "john@example.com" },
//   { id: 2, name: "Jane Smith", email: "jane@example.com" },
//   { id: 3, name: "Mike Johnson", email: "mike@example.com" },
//   { id: 4, name: "Sarah Wilson", email: "sarah@example.com" },
//   { id: 5, name: "David Brown", email: "david@example.com" }
// ]

// const getPriorityColor = (priority: string) => {
//   switch (priority) {
//     case "High": return "bg-brand-red/10 text-brand-red border-brand-red/20"
//     case "Medium": return "bg-warning/10 text-warning border-warning/20"
//     case "Low": return "bg-success/10 text-success border-success/20"
//     default: return "bg-muted"
//   }
// }

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "To Do": return "bg-muted"
//     case "In Progress": return "bg-primary/10 text-primary border-primary/20"
//     case "Review": return "bg-warning/10 text-warning border-warning/20"
//     case "Done": return "bg-success/10 text-success border-success/20"
//     default: return "bg-muted"
//   }
// }

// export const Home = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [projectTitle, setProjectTitle] = useState("")
//   const [projectDescription, setProjectDescription] = useState("")
//   const [selectedMembers, setSelectedMembers] = useState<number[]>([])
//   const { toast } = useToast()

//   const handleMemberToggle = (memberId: number) => {
//     setSelectedMembers(prev => 
//       prev.includes(memberId) 
//         ? prev.filter(id => id !== memberId)
//         : [...prev, memberId]
//     )
//   }

//   const handleCreateProject = () => {
//     if (!projectTitle.trim()) {
//       toast({
//         title: "Error",
//         description: "Project title is required",
//         variant: "destructive"
//       })
//       return
//     }

//     // Create project logic here
//     toast({
//       title: "Success",
//       description: `Project "${projectTitle}" created successfully!`
//     })

//     // Reset form
//     setProjectTitle("")
//     setProjectDescription("")
//     setSelectedMembers([])
//     setIsDialogOpen(false)
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Welcome Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Good morning, John! 👋</h1>
//           <p className="text-muted-foreground mt-1">
//             You have 3 tasks due today and 6 in progress. Let's get things done!
//           </p>
//         </div>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
//               <Plus className="h-4 w-4 mr-2" />
//               New Project
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Create New Project</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Project Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="Enter project title"
//                   value={projectTitle}
//                   onChange={(e) => setProjectTitle(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Enter project description"
//                   value={projectDescription}
//                   onChange={(e) => setProjectDescription(e.target.value)}
//                   rows={3}
//                 />
//               </div>
//               <div className="space-y-3">
//                 <Label>Assign Team Members</Label>
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {teamMembers.map((member) => (
//                     <div key={member.id} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`member-${member.id}`}
//                         checked={selectedMembers.includes(member.id)}
//                         onCheckedChange={() => handleMemberToggle(member.id)}
//                       />
//                       <Label
//                         htmlFor={`member-${member.id}`}
//                         className="text-sm font-normal cursor-pointer flex-1"
//                       >
//                         {member.name} ({member.email})
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-2 pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={handleCreateProject}>
//                   Create Project
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <Card key={stat.title} className="relative overflow-hidden">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//               <stat.icon className={`h-4 w-4 ${stat.color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p className="text-xs text-muted-foreground">
//                 <span className="text-success">
//                   <TrendingUp className="inline h-3 w-3 mr-1" />
//                   {stat.change}
//                 </span> from last month
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Tasks */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Recent Tasks
//               </CardTitle>
//               <Button variant="outline" size="sm">View All</Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {recentTasks.map((task) => (
//               <div
//                 key={task.id}
//                 className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
//               >
//                 <div className="flex-1 space-y-2">
//                   <div className="flex items-center gap-3">
//                     <h4 className="font-medium">{task.title}</h4>
//                     <Badge variant="outline" className={getPriorityColor(task.priority)}>
//                       {task.priority}
//                     </Badge>
//                   </div>
//                   <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                     <span>{task.project}</span>
//                     <span>•</span>
//                     <span className="flex items-center gap-1">
//                       <Calendar className="h-3 w-3" />
//                       {task.dueDate}
//                     </span>
//                   </div>
//                 </div>
//                 <Badge variant="outline" className={getStatusColor(task.status)}>
//                   {task.status}
//                 </Badge>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Quick Actions & Upcoming */}
//         <div className="space-y-6">
//           {/* Quick Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <Button variant="outline" className="w-full justify-start">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create New Project
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <Users className="h-4 w-4 mr-2" />
//                 Invite Team Member
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <Calendar className="h-4 w-4 mr-2" />
//                 Schedule Meeting
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Upcoming Deadlines */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <AlertCircle className="h-5 w-5 text-brand-red" />
//                 Urgent
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-brand-red/5 border border-brand-red/20 rounded-lg">
//                 <div>
//                   <p className="font-medium text-sm">Mobile fixes</p>
//                   <p className="text-xs text-muted-foreground">Due today</p>
//                 </div>
//                 <Badge variant="outline" className="bg-brand-red/10 text-brand-red border-brand-red/20">
//                   High
//                 </Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
//                 <div>
//                   <p className="font-medium text-sm">Auth system</p>
//                   <p className="text-xs text-muted-foreground">Due tomorrow</p>
//                 </div>
//                 <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
//                   Medium
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
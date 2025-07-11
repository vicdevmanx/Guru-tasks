
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, CheckCircle, TrendingUp, Clock } from 'lucide-react';
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
  const pendingTasks = totalTasks - completedTasks;

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
    console.log('Duplicate project:', project.name);
  };

  const handleArchiveProject = (project: Project) => {
    console.log('Archive project:', project.name);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Button 
          onClick={() => setShowCreateProject(true)} 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks in progress</p>
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
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const completionRate = project.tasks.length > 0
              ? (project.tasks.filter(task => task.status === 'done').length / project.tasks.length) * 100
              : 0;

            return (
              <div key={project.id} className="group relative">
                <Link to={`/project/${project.id}`}>
                  <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {project.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <div onClick={(e) => e.preventDefault()} className="opacity-100">
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
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{project.tasks.length} tasks</span>
                          <span className="text-muted-foreground">
                            {project.tasks.filter(task => task.status === 'done').length} completed
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Math.round(completionRate)}% complete</span>
                          <span>Due: {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })}
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
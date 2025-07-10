
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export const Analytics = () => {
  const { projects } = useProjects();

  // Calculate analytics data
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.status === 'done').length,
    0
  );
  const inProgressTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.status === 'in-progress').length,
    0
  );
  const todoTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.status === 'todo').length,
    0
  );

  // Sample data for charts
  const weeklyData = [
    { name: 'Mon', completed: 12, created: 8 },
    { name: 'Tue', completed: 19, created: 15 },
    { name: 'Wed', completed: 15, created: 12 },
    { name: 'Thu', completed: 22, created: 18 },
    { name: 'Fri', completed: 18, created: 20 },
    { name: 'Sat', completed: 8, created: 5 },
    { name: 'Sun', completed: 6, created: 3 },
  ];

  const projectData = projects.map(project => ({
    name: project.name,
    tasks: project.tasks.length,
    completed: project.tasks.filter(t => t.status === 'done').length,
  }));

  const statusData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Todo', value: todoTasks, color: '#f59e0b' },
  ];

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your team's productivity and project progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last week
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% from last week
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" />
                  -2% from last week
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time/Task</p>
                <p className="text-2xl font-bold">2.3h</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  -8% from last week
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

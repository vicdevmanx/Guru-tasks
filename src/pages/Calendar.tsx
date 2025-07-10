
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

export const Calendar = () => {
  const { projects } = useProjects();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month info
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Sample events (in a real app, these would come from your data)
  const events = [
    { id: 1, title: 'Project Review', date: 15, type: 'meeting' },
    { id: 2, title: 'Sprint Planning', date: 18, type: 'planning' },
    { id: 3, title: 'Design Deadline', date: 22, type: 'deadline' },
    { id: 4, title: 'Team Standup', date: 25, type: 'meeting' },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === 'next' ? 1 : -1), 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event => event.date === day);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'planning': return 'bg-green-500';
      case 'deadline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Schedule and track your project milestones</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const isToday = day === new Date().getDate() && 
                               currentMonth === new Date().getMonth() && 
                               currentYear === new Date().getFullYear();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-2 border rounded-lg ${
                      day 
                        ? isToday 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-accent cursor-pointer'
                        : 'border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-primary' : 'text-foreground'
                        }`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                  <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {monthNames[currentMonth]} {event.date}, {currentYear}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Events</span>
                </div>
                <Badge variant="secondary">{events.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Meetings</span>
                </div>
                <Badge variant="secondary">
                  {events.filter(e => e.type === 'meeting').length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Deadlines</span>
                </div>
                <Badge variant="destructive">
                  {events.filter(e => e.type === 'deadline').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

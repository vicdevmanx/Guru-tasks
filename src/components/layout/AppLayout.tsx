
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '../ui/input';

export const AppLayout = () => {
  return (
   <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="py-3 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between h-full px-2">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
          <Outlet/>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

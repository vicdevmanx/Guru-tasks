import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from '@/pages/Home';
import { ProjectView } from '@/pages/ProjectView';
import { Profile } from '@/pages/Profile';
import { Projects } from '@/pages/Projects';
import { Team } from '@/pages/Team';
import { Analytics } from '@/pages/Analytics';
import { Calendar } from '@/pages/Calendar';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import './App.css';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:projectId" element={<ProjectView />} />
          <Route path="team" element={<Team />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

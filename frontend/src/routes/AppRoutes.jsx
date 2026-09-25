import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import MyRoutePage from '../pages/student/MyRoutePage';
import SchedulePage from '../pages/student/SchedulePage';
import ProfilePage from '../pages/student/ProfilePage';
import DriverDashboard from '../pages/driver/DriverDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student Portal Routes */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/route" element={<MyRoutePage />} />
      <Route path="/student/schedule" element={<SchedulePage />} />
      <Route path="/student/profile" element={<ProfilePage />} />

      {/* Driver Cockpit */}
      <Route path="/driver" element={<DriverDashboard />} />

      {/* Admin Fleet Dashboard */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

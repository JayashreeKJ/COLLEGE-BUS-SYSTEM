import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import StudentDashboardPlaceholder from '../pages/student/StudentDashboardPlaceholder';
import DriverDashboardPlaceholder from '../pages/driver/DriverDashboardPlaceholder';
import AdminDashboardPlaceholder from '../pages/admin/AdminDashboardPlaceholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student" element={<StudentDashboardPlaceholder />} />
      <Route path="/driver" element={<DriverDashboardPlaceholder />} />
      <Route path="/admin" element={<AdminDashboardPlaceholder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

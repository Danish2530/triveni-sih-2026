import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

import CitizenDashboard from './pages/CitizenDashboard';
import SubmitProblem from './pages/SubmitProblem';
import ProblemDetails from './pages/ProblemDetails';
import MyProblems from './pages/MyProblems';

import UniversityDashboard from './pages/UniversityDashboard';
import UniversityChallenges from './pages/UniversityChallenges';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';

import IndustryDashboard from './pages/IndustryDashboard';
import IndustryProjects from './pages/IndustryProjects';

import GovernmentDashboard from './pages/GovernmentDashboard';
import NotFound from './pages/NotFound';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main Dashboard Layout with Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <DashboardLayout><CitizenDashboard /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/submit-problem"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <DashboardLayout><SubmitProblem /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/my-problems"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin', 'government']}>
                <DashboardLayout><MyProblems /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* University Routes */}
          <Route
            path="/university/dashboard"
            element={
              <ProtectedRoute allowedRoles={['university', 'faculty', 'student', 'admin']}>
                <DashboardLayout><UniversityDashboard /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/university/challenges"
            element={
              <ProtectedRoute allowedRoles={['university', 'faculty', 'student', 'admin']}>
                <DashboardLayout><UniversityChallenges /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/university/create-project"
            element={
              <ProtectedRoute allowedRoles={['university', 'admin']}>
                <DashboardLayout><CreateProject /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Project Workspace Details Route */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout><ProjectDetails /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Industry Routes */}
          <Route
            path="/industry/dashboard"
            element={
              <ProtectedRoute allowedRoles={['industry', 'admin']}>
                <DashboardLayout><IndustryDashboard /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/projects"
            element={
              <ProtectedRoute allowedRoles={['industry', 'admin', 'government']}>
                <DashboardLayout><IndustryProjects /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Government Routes */}
          <Route
            path="/government/dashboard"
            element={
              <ProtectedRoute allowedRoles={['government', 'admin']}>
                <DashboardLayout><GovernmentDashboard /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;

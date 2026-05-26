import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { NewRequestPage } from './pages/NewRequestPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminRequests } from './pages/AdminRequests';
import { AdminUsers } from './pages/AdminUsers';
import { AdminTestimonials } from './pages/AdminTestimonials';

import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <PrivateRoute requiredRole="client">
                <ClientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/new-request"
            element={
              <PrivateRoute requiredRole="client">
                <NewRequestPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/request/:id"
            element={
              <PrivateRoute requiredRole="client">
                <RequestDetailPage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminTestimonials />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

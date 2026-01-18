import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import AuthPage from './Auth';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import PartnerLogin from './PartnerLogin';
import PartnerDashboard from './partner/PartnerDashboard';

import { AuthProvider } from './AuthContext';
import { SiteProvider } from './SiteContext';
import { AdminRoute, PartnerRoute, UserRoute } from './RouteProtection';

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />

            {/* User Routes */}
            <Route path="/profile" element={
              <UserRoute>
                <UserProfile />
              </UserRoute>
            } />

            {/* Partner Routes */}
            <Route path="/partner/login" element={<PartnerLogin />} />
            <Route path="/partner/dashboard" element={
              <PartnerRoute>
                <PartnerDashboard />
              </PartnerRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />

            {/* Legacy/Redirect Routes */}
            <Route path="/partner" element={<Navigate to="/partner/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </AuthProvider>
  );
}
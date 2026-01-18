import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Route protection for Partner
export function PartnerRoute({ children }) {
    const { currentUser, isPartner, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!currentUser || !isPartner) {
        return <Navigate to="/partner/login" replace />;
    }

    return children;
}

// Route protection for Admin
export function AdminRoute({ children }) {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentUser || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

// Route protection for User
export function UserRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

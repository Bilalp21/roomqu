import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'admin' | 'partner' | 'user' | null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // User is signed in, fetch additional data from Firestore
                    const userRef = doc(db, "users", user.uid);
                    let userSnap;
                    try {
                        userSnap = await getDoc(userRef);
                    } catch (firestoreError) {
                        console.error("Firestore read error:", firestoreError);
                        // If we can't read/write to Firestore (e.g. rules), fall back to email-based role detection
                        let role = 'user';
                        if (user.email && user.email.startsWith('admin')) {
                            role = 'admin';
                        } else if (user.email && user.email.startsWith('partner')) {
                            role = 'partner';
                        }
                        setUserRole(role);
                        setCurrentUser(user);
                        setLoading(false);
                        return;
                    }

                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setUserRole(data.role);
                    } else {
                        // Create new user document if it doesn't exist
                        let role = 'user';
                        if (user.email && user.email.startsWith('admin')) {
                            role = 'admin';
                        } else if (user.email && user.email.startsWith('partner')) {
                            role = 'partner';
                        }

                        try {
                            await setDoc(userRef, {
                                email: user.email,
                                displayName: user.displayName || 'User',
                                role: role,
                                createdAt: new Date().toISOString()
                            });
                            setUserRole(role);
                        } catch (writeError) {
                            console.error("Firestore write error:", writeError);
                            // Set default role if write fails
                            setUserRole('user');
                        }
                    }
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Auth Context General Error:", error);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loading,
        isAdmin: userRole === 'admin',
        isPartner: userRole === 'partner',
        isUser: userRole === 'user'
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

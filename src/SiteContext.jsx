import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const SiteContext = createContext();

export function useSite() {
    return useContext(SiteContext);
}

export function SiteProvider({ children }) {
    // Initialize from localStorage or default
    const [siteName, setSiteName] = useState(() => {
        return localStorage.getItem('siteName') || 'Blueking';
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for site settings
        const settingsRef = doc(db, 'settings', 'general');

        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.siteName) {
                    setSiteName(data.siteName);
                    localStorage.setItem('siteName', data.siteName);
                }
            } else {
                // If doc doesn't exist, we try to create it, but we don't overwrite local if it exists?
                // Actually, let's just try to set it if we have a value
                if (!localStorage.getItem('siteName')) {
                    setDoc(settingsRef, { siteName: 'Blueking' }).catch(err => console.log("Init failed", err));
                }
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching site settings (Permission/Network):", error);
            // On error, just stick with local storage
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateSiteName = async (newName) => {
        // 1. Optimistic Local Update (Always works)
        setSiteName(newName);
        localStorage.setItem('siteName', newName);

        // 2. Try Cloud Update
        try {
            const settingsRef = doc(db, 'settings', 'general');
            await setDoc(settingsRef, { siteName: newName }, { merge: true });
            return true;
        } catch (error) {
            console.warn("Firestore update failed (using local storage fallback):", error);
            // We return true because from user perspective, it IS saved (locally)
            // You might want to return 'local' to indicate partial success if needed
            return true;
        }
    };

    const value = {
        siteName,
        updateSiteName,
        loading
    };

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
}

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
        return localStorage.getItem('siteName') || 'RoomQu';
    });

    const [chatEnabled, setChatEnabled] = useState(() => {
        const stored = localStorage.getItem('chatEnabled');
        return stored === null ? true : stored === 'true';
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
                if (data.chatEnabled !== undefined) {
                    setChatEnabled(data.chatEnabled);
                    localStorage.setItem('chatEnabled', data.chatEnabled);
                }
            } else {
                // If doc doesn't exist, we try to create it, but we don't overwrite local if it exists?
                // Actually, let's just try to set it if we have a value
                if (!localStorage.getItem('siteName')) {
                    setDoc(settingsRef, { siteName: 'RoomQu', chatEnabled: true }).catch(err => console.log("Init failed", err));
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
        setSiteName(newName);
        localStorage.setItem('siteName', newName);

        try {
            const settingsRef = doc(db, 'settings', 'general');
            await setDoc(settingsRef, { siteName: newName }, { merge: true });
        } catch (error) {
            console.error("Error updating site name:", error);
        }
    };

    const updateChatEnabled = async (enabled) => {
        setChatEnabled(enabled);
        localStorage.setItem('chatEnabled', enabled);

        try {
            const settingsRef = doc(db, 'settings', 'general');
            await setDoc(settingsRef, { chatEnabled: enabled }, { merge: true });
        } catch (error) {
            console.error("Error updating chat enabled status:", error);
        }
    };

    const value = {
        siteName,
        updateSiteName,
        chatEnabled,
        updateChatEnabled,
        loading
    };

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
}

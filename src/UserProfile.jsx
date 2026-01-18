import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin,
    Shield, ArrowLeft, LogOut, Settings,
    Bell, CreditCard, Heart
} from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';

export default function UserProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // profile, bookings, favorites, settings

    // Form Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // Firebase auth doesn't store this by default easily without verifying, so we mockup or use custom claims/firestore

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
            } else {
                navigate('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            await updateProfile(user, {
                displayName: displayName
            });
            setIsEditing(false);
            // Force refresh user state logic if needed, but onAuthStateChanged might pick it up or local state is sufficient
            setUser({ ...user, displayName: displayName });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">Profil Saya</h1>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-br from-blue-50 to-white">
                                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="font-bold text-slate-800 text-lg">{user?.displayName || 'Pengguna Blueking'}</h2>
                                <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                            </div>

                            <nav className="p-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <User size={18} />
                                    Data Diri
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <CreditCard size={18} />
                                    Pesanan Saya
                                </button>
                                <button
                                    onClick={() => setActiveTab('favorites')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Heart size={18} />
                                    Favorit
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Settings size={18} />
                                    Pengaturan
                                </button>
                                <div className="my-2 border-t border-slate-100"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} />
                                    Keluar
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl text-slate-800">Informasi Pribadi</h3>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                                        >
                                            Ubah
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="text-sm font-medium text-slate-500 hover:text-slate-600"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="text-sm font-bold text-blue-600 hover:text-blue-700"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Nama Lengkap</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-800"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-3 text-slate-800 font-medium p-2 bg-slate-50 rounded-lg">
                                                    <User size={18} className="text-slate-400" />
                                                    {user?.displayName || '-'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Email</label>
                                            <div className="flex items-center gap-3 text-slate-800 font-medium p-2 bg-slate-50 rounded-lg opacity-75">
                                                <Mail size={18} className="text-slate-400" />
                                                {user?.email}
                                                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Terverifikasi</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Nomor Telepon</label>
                                            <div className="flex items-center gap-3 text-slate-800 font-medium p-2 bg-slate-50 rounded-lg">
                                                <Phone size={18} className="text-slate-400" />
                                                <span>+62 812-3456-7890</span>
                                                <span className="ml-auto text-xs text-blue-600 cursor-pointer hover:underline">Tambah</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard size={32} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Belum Ada Pesanan</h3>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Anda belum melakukan pemesanan hotel apapun. Yuk mulai cari hotel impianmu sekarang!</p>
                                <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                    Cari Hotel
                                </button>
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart size={32} className="text-red-500 fill-red-500" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Favorit Kosong</h3>
                                <p className="text-slate-500 mb-6">Simpan hotel yang Anda suka untuk dilihat nanti.</p>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                                <h3 className="font-bold text-xl text-slate-800 mb-6">Pengaturan Akun</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Bell size={20} className="text-slate-400" />
                                            <div>
                                                <p className="font-medium text-slate-800">Notifikasi Email</p>
                                                <p className="text-xs text-slate-500">Terima update promo dan info pesanan</p>
                                            </div>
                                        </div>
                                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-600 right-0" />
                                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600 cursor-pointer"></label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Shield size={20} className="text-slate-400" />
                                            <div>
                                                <p className="font-medium text-slate-800">Ganti Password</p>
                                                <p className="text-xs text-slate-500">Update password anda secara berkala</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Update</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

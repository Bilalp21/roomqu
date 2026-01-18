import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSite } from './SiteContext';
import { ShieldCheck, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';

export default function AdminLogin() {
    const { siteName } = useSite();
    const navigate = useNavigate();

    // States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Optional: Check if user is admin in Firestore
            const userRef = doc(db, "users", user.uid);
            try {
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    if (userSnap.data().role !== 'admin') {
                        // If strict checking is enforced later:
                        // throw new Error("Akses ditolak. Bukan akun admin.");
                    }
                }
            } catch (fsError) {
                console.warn("Firestore permission error (ignoring for successful Auth login):", fsError);
                // We allow login because Auth succeeded. 
                // The rules might be blocking the read, but the user IS authenticated.
            }

            setLoading(false);
            navigate('/admin');

        } catch (err) {
            console.error(err);
            setLoading(false);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Email atau kata sandi salah.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Terlalu banyak percobaan. Silakan coba lagi nanti.');
            } else {
                setError('Gagal masuk. Periksa koneksi atau coba lagi.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[500px]">

                {/* Left Side - Brand & Visual */}
                <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-blue-600 text-white relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ShieldCheck size={32} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold">{siteName} Admin</h1>
                        </div>
                        <h2 className="text-3xl font-bold leading-tight mb-4">
                            Sistem Manajemen Properti Terpadu
                        </h2>
                        <p className="text-blue-100">
                            Kelola reservasi, atur ketersediaan kamar, dan pantau performa bisnis Anda dalam satu dashboard.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-blue-200">
                        &copy; 2026 {siteName}. All rights reserved.
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-50 -ml-16 -mb-16"></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <div className="max-w-xs mx-auto w-full">
                        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                            <Lock size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                            Admin Login
                        </h2>
                        <p className="text-center text-slate-500 mb-8 text-sm">
                            Masuk menggunakan email dan kata sandi administrator Anda.
                        </p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 border border-red-100 animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1 ml-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-slate-800 font-medium transition-all"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1 ml-1">Kata Sandi</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-slate-800 font-medium transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        Masuk Dashboard
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}


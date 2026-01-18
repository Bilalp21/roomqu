import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ArrowLeft, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { auth } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "firebase/auth";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/');
            } else {
                // Register
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (name) {
                    await updateProfile(userCredential.user, { displayName: name });
                }
                navigate('/');
            }
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
                <ArrowLeft size={20} />
                Kembali ke Beranda
            </button>

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
                {/* Left Side - Banner */}
                <div className="hidden md:flex w-1/2 bg-blue-600 text-white p-12 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-white p-2 rounded-lg">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">Blueking</h1>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 leading-tight">
                            {isLogin ? "Selamat Datang Kembali!" : "Bergabunglah Bersama Kami"}
                        </h2>
                        <p className="text-blue-100 opacity-90 leading-relaxed">
                            Nikmati kemudahan booking hotel dengan harga terbaik dan pelayanan terpercaya di seluruh Indonesia.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm opacity-75">
                        &copy; 2026 Blueking Indonesia
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full -translate-x-1/2 translate-y-1/2 opacity-50"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            {isLogin ? "Login ke Akun" : "Buat Akun Baru"}
                        </h3>
                        <p className="text-slate-500 mb-8 text-sm">
                            {isLogin ? "Masuk untuk mengakses pesanan Anda" : "Daftar untuk mulai memesan hotel impian"}
                        </p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Contoh: Budi Santoso"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="nama@email.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-700">Password</label>
                                    {isLogin && <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Lupa Password?</a>}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? 'Memproses...' : (isLogin ? "Masuk Sekarang" : "Daftar Akun")}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-2 text-slate-400 font-medium">Atau lanjutkan dengan</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm">
                                <Facebook className="text-blue-600 w-5 h-5" />
                                Facebook
                            </button>
                        </div>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                {isLogin ? "Daftar sekarang" : "Login disini"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

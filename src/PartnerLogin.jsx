import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useSite } from './SiteContext';
import { useAuth } from './AuthContext';
import { Building, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';

export default function PartnerLogin() {
    const { siteName } = useSite();
    const { isPartner, currentUser } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        whatsapp: ''
    });

    // Auto-redirect if already logged in as partner
    React.useEffect(() => {
        if (currentUser && isPartner) {
            navigate('/partner/dashboard', { replace: true });
        }
    }, [currentUser, isPartner, navigate]);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            navigate('/partner/dashboard');
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

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // Disini logika kirim data ke backend/firestore bisa ditambahkan nanti
        // Untuk sekarang kita simulasi sukses
        alert(`Terima kasih ${formData.fullName}!\n\nPermintaan pendaftaran Anda telah kami terima.\nTim kami akan segera menghubungi nomor WhatsApp ${formData.whatsapp} untuk proses verifikasi dan pembuatan akun.`);
        setShowRegisterModal(false);
        setFormData({ fullName: '', email: '', whatsapp: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[500px]">

                {/* Left Side - Brand & Visual */}
                <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Building size={32} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold">{siteName} Partner</h1>
                        </div>
                        <h2 className="text-3xl font-bold leading-tight mb-4">
                            Portal Mitra Bisnis
                        </h2>
                        <p className="text-purple-100">
                            Kelola properti Anda, pantau pemesanan, dan tingkatkan revenue dengan dashboard partner yang powerful.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-purple-200">
                        © 2026 {siteName}. All rights reserved.
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-30 -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-700 rounded-full blur-3xl opacity-30 -ml-16 -mb-16"></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <div className="max-w-xs mx-auto w-full">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6 mx-auto shadow-lg">
                            <Lock size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                            Partner Login
                        </h2>
                        <p className="text-center text-slate-500 mb-8 text-sm">
                            Masuk ke dashboard partner Anda
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none text-slate-800 font-medium transition-all"
                                        placeholder="partner@example.com"
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none text-slate-800 font-medium transition-all"
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
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        Masuk Dashboard
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Belum punya akun partner?{' '}
                                <button
                                    onClick={() => setShowRegisterModal(true)}
                                    className="text-purple-600 font-bold hover:text-purple-700"
                                >
                                    Daftar Sekarang
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Register Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
                            <button
                                onClick={() => setShowRegisterModal(false)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <h3 className="text-xl font-bold mb-1">Daftar Jadi Partner</h3>
                            <p className="text-purple-100 text-sm opacity-90">Isi formulir untuk bergabung dengan RoomQu</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="Nama Pemilik / Manajer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="email@bisnis.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor WhatsApp Aktif</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+62</div>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                            placeholder="81234567890"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Tim kami akan menghubungi Anda melalui nomor ini.</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-200 transition-all active:scale-95"
                                >
                                    Kirim Pendaftaran
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

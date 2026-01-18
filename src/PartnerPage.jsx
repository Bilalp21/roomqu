import React, { useState } from 'react';
import { useSite } from './SiteContext';
import {
    TrendingUp, Megaphone, LayoutDashboard, ShieldCheck,
    HeadphonesIcon, CheckCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PartnerPage() {
    const { siteName } = useSite();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const benefits = [
        {
            icon: TrendingUp,
            title: "Komisi Kompetitif",
            desc: "Kami menawarkan struktur biaya yang transparan dan lebih rendah dari rata-rata industri, sehingga margin keuntungan Anda tetap maksimal."
        },
        {
            icon: Megaphone,
            title: "Pemasaran Terintegrasi",
            desc: "Properti Anda akan dipromosikan melalui media sosial, kampanye email, dan optimasi Google agar selalu tampil di depan calon tamu."
        },
        {
            icon: LayoutDashboard,
            title: "Dashboard Manajemen Mandiri",
            desc: "Kelola harga, ketersediaan kamar, dan foto properti dengan mudah melalui sistem extranet kami yang user-friendly."
        },
        {
            icon: ShieldCheck,
            title: "Keamanan Pembayaran",
            desc: "Sistem pembayaran yang aman dan otomatis. Dana Anda akan dicairkan secara terjadwal tanpa proses birokrasi yang rumit."
        },
        {
            icon: HeadphonesIcon,
            title: "Dukungan Partner 24/7",
            desc: "Tim kami siap membantu Anda menyelesaikan kendala operasional kapan pun dibutuhkan."
        }
    ];

    const steps = [
        { title: "Daftar Akun", desc: "Isi formulir data diri dan informasi dasar properti Anda melalui tombol di bawah." },
        { title: "Verifikasi & Upload", desc: "Tim kami akan melakukan verifikasi singkat. Setelah disetujui, Anda bisa melengkapi foto dan detail fasilitas kamar." },
        { title: "Mulai Terima Tamu", desc: "Aktifkan status properti Anda dan mulailah menerima reservasi secara langsung dari tamu kami." }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = `Halo Admin ${siteName}, saya ingin mendaftar sebagai mitra.\n\nNama: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}`;
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/6285693182907?text=${encodedMessage}`;
        window.open(waLink, '_blank');
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header/Nav */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
                        {siteName} <span className="text-slate-500 font-normal text-sm">Partner</span>
                    </div>
                    <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-600 hover:text-blue-600">
                        Kembali ke Beranda
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-blue-600 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Mengapa Bermitra dengan {siteName}?
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Kami bukan sekadar platform pemesanan; kami adalah partner pertumbuhan bisnis Anda.
                        Bergabunglah bersama kami untuk menjangkau lebih banyak tamu.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
                    >
                        Daftar Sebagai Mitra
                    </button>
                </div>
            </header>

            {/* Benefits Section */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Keuntungan Bergabung</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <benefit.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">{benefit.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps & CTA Section */}
            <section className="bg-slate-900 text-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Cara Mulai Bergabung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-lg">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                </div>
                                <p className="text-slate-400 pl-14">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl font-bold">Siap untuk Meningkatkan Okupansi Anda?</h2>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                                Jadilah bagian dari ekosistem pariwisata masa depan. Tidak ada biaya pendaftaran,
                                Anda hanya membayar jika ada pesanan yang berhasil.
                            </p>
                            <blockquote className="text-blue-200 italic font-medium">
                                "Kami membantu hotel-hotel lokal naik kelas dengan teknologi distribusi yang cerdas dan efisien."
                            </blockquote>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                            >
                                DAFTAR SEKARANG SEBAGAI MITRA
                            </button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>
            </section>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Formulir Pendaftaran Mitra</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                    placeholder="Nama pemilik atau manajer"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                    placeholder="email@bisnis.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                    placeholder="0812..."
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Megaphone size={20} />
                                    Kirim Pendaftaran via WhatsApp
                                </button>
                                <p className="text-xs text-center text-slate-500 mt-3">
                                    Data Anda akan diteruskan ke tim kami melalui WhatsApp untuk proses verifikasi selanjutnya.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

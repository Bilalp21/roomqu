import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Star, Filter, Home as HomeIcon, Calendar,
    User, Menu, Heart, ChevronLeft, Wifi, Coffee,
    Tv, Car, CheckCircle, Shield, Plus, Minus, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './custom.css';
import { auth } from './firebase';

import { signOut } from 'firebase/auth';
import { useAuth } from './AuthContext';

import { HOTELS } from './data';
import { useSite } from './SiteContext';

/**
 * KOMPONEN FORMATTER HARGA
 */
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
};

/**
 * MAIN HOME COMPONENT
 */
export default function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const { currentUser: user, isAdmin } = useAuth();
    const { siteName } = useSite();
    const [view, setView] = useState('list'); // list, detail
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    // State untuk Pencarian Baru (Tanggal & Tamu)
    const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]); // Hari ini
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Besok
    const [guestCount, setGuestCount] = useState(2);
    const [isGuestOpen, setIsGuestOpen] = useState(false);

    // Deteksi ukuran layar untuk responsivitas JS-level
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleHotelClick = (hotel) => {
        setSelectedHotel(hotel);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setView('list');
        setSelectedHotel(null);
    };

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fav => fav !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };

    const filteredHotels = HOTELS.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800" onClick={() => setIsGuestOpen(false)}>

            {/* --- DESKTOP/MOBILE HEADER --- */}
            <header className={`sticky top-0 z-40 bg-blue-600 text-white shadow-lg transition-all ${view === 'detail' && isMobile ? 'hidden' : 'block'}`}>
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
                        <div className="bg-white p-1.5 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">{siteName}</h1>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <button onClick={() => setView('list')} className="hover:text-blue-200">Beranda</button>
                        <button className="hover:text-blue-200">Promo</button>
                        <button className="hover:text-blue-200">Pesanan Saya</button>
                        <button onClick={() => navigate('/partner')} className="hover:text-blue-200">Jadi Mitra</button>


                        {user ? (
                            <div className="flex items-center gap-2 ml-4 cursor-pointer group relative">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border border-blue-400 text-white font-bold">
                                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="max-w-[100px] truncate">{user.displayName || user.email.split('@')[0]}</span>
                                </div>

                                {/* Invisible bridge for hover stability */}
                                <div className="absolute top-full right-0 w-full h-4 bg-transparent"></div>

                                {/* Dropdown Menu */}
                                <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-white rounded-xl shadow-2xl ring-1 ring-slate-900/5 py-2 hidden group-hover:block z-50 transform transition-all duration-200 origin-top-right animate-in fade-in zoom-in-95">
                                    <div className="px-4 py-3 border-b border-slate-50 bg-gradient-to-r from-blue-50/50 to-transparent">
                                        <p className="text-xs text-slate-500 font-medium mb-1">Akun Saya {isAdmin && <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px] ml-2 font-bold uppercase">Admin</span>}</p>
                                        <p className="font-bold text-slate-800 truncate text-sm">
                                            {user.displayName || user.email}
                                        </p>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        {isAdmin && (
                                            <button onClick={() => navigate('/admin')} className="w-full text-left px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm text-slate-600 font-medium transition-all flex items-center gap-3">
                                                <Shield size={16} className="text-slate-400 group-hover:text-blue-500" />
                                                Panel Admin
                                            </button>
                                        )}
                                        <button onClick={() => navigate('/profile')} className="w-full text-left px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm text-slate-600 font-medium transition-all flex items-center gap-3">
                                            <User size={16} className="text-slate-400 group-hover:text-blue-500" />
                                            Profil Saya
                                        </button>
                                        <button className="w-full text-left px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm text-slate-600 font-medium transition-all flex items-center gap-3">
                                            <Calendar size={16} className="text-slate-400 group-hover:text-blue-500" />
                                            Pesanan Saya
                                        </button>
                                        <button className="w-full text-left px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm text-slate-600 font-medium transition-all flex items-center gap-3">
                                            <Heart size={16} className="text-slate-400 group-hover:text-blue-500" />
                                            Favorit Saya
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 mt-1 p-1.5">
                                        <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm text-red-600 font-medium transition-all flex items-center gap-3">
                                            <LogOut size={16} className="text-red-400 group-hover:text-red-500" />
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4 cursor-pointer" onClick={() => navigate('/login')}>
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border border-blue-400">
                                    <User size={16} />
                                </div>
                                <span>Masuk / Daftar</span>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Search Icon Trigger (Placeholder) */}
                    <div className="md:hidden">
                        <Menu size={24} />
                    </div>
                </div>

                {/* Search Bar Container (Only on Home/List view) */}
                {view === 'list' && (
                    <div className="bg-blue-700 pb-6 pt-2 px-4 rounded-b-3xl md:rounded-none md:bg-blue-600 md:pb-8">
                        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-2 flex flex-col md:flex-row gap-2 text-slate-800">

                            {/* INPUT DESTINASI */}
                            <div className="flex-1 flex items-center px-3 py-2 bg-slate-50 rounded border border-slate-200 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 transition-all">
                                <MapPin className="text-blue-500 w-5 h-5 mr-2 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500 font-semibold mb-0.5">Destinasi</p>
                                    <input
                                        type="text"
                                        placeholder="Mau nginep di mana?"
                                        className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 text-ellipsis"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* INPUT TANGGAL (INTERAKTIF) */}
                            <div className="flex-[1.5] flex items-center px-3 py-2 bg-slate-50 rounded border border-slate-200 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 transition-all">
                                <Calendar className="text-blue-500 w-5 h-5 mr-2 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500 font-semibold mb-0.5">Tanggal Menginap</p>
                                    <div className="flex items-center gap-2 text-sm font-bold w-full">
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            className="bg-transparent outline-none p-0 text-slate-900 w-full min-w-[100px] cursor-pointer"
                                        />
                                        <span className="text-slate-400">-</span>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="bg-transparent outline-none p-0 text-slate-900 w-full min-w-[100px] cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* INPUT TAMU (INTERAKTIF DENGAN POPUP) */}
                            <div className="relative flex items-center px-3 py-2 bg-slate-50 rounded border border-slate-200 md:w-48 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsGuestOpen(!isGuestOpen);
                                }}
                            >
                                <User className="text-blue-500 w-5 h-5 mr-2 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 font-semibold mb-0.5">Tamu & Kamar</p>
                                    <p className="text-sm font-bold truncate">{guestCount} Tamu, 1 Kamar</p>
                                </div>

                                {/* POPUP Tamu */}
                                {isGuestOpen && (
                                    <div className="absolute top-full right-0 mt-3 bg-white shadow-xl rounded-xl p-4 w-64 border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <span className="block text-sm font-bold text-slate-800">Dewasa</span>
                                                <span className="text-xs text-slate-500">Usia 17+</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 disabled:opacity-50"
                                                    disabled={guestCount <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold w-4 text-center">{guestCount}</span>
                                                <button
                                                    onClick={() => setGuestCount(guestCount + 1)}
                                                    className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center hover:bg-blue-50 text-blue-600"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-center text-slate-400 border-t border-slate-100 pt-3">
                                            Maksimal 10 tamu per pemesanan
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded shadow transition-colors md:w-auto w-full flex items-center justify-center">
                                <Search className="md:hidden mr-2" size={18} />
                                Cari
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* --- CONTENT AREA --- */}
            <main className={`max-w-6xl mx-auto min-h-screen ${isMobile ? 'pb-24' : 'pb-10 pt-8'}`}>

                {view === 'list' ? (
                    <div className="px-4 mt-6 md:mt-0">
                        {/* Promo Banner (Mobile Scrollable) */}
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="min-w-[85%] md:min-w-[400px] h-32 md:h-40 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center p-6 text-white shadow-md relative overflow-hidden shrink-0">
                                    <div className="absolute right-0 top-0 opacity-10 w-32 h-32 bg-white rounded-full translate-x-10 -translate-y-10"></div>
                                    <div className="relative z-10">
                                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold mb-2 inline-block">PROMO</span>
                                        <h3 className="font-bold text-lg">Diskon Pengguna Baru</h3>
                                        <p className="text-sm opacity-90">Hemat hingga 25% untuk pesanan pertama.</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Filter Sidebar (Desktop Only) */}
                            <aside className="hidden md:block w-64 shrink-0">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-24">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Filter</h3>
                                        <Filter size={16} className="text-slate-400" />
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-2 text-sm">Kisaran Harga</h4>
                                            <div className="h-1 bg-slate-200 rounded overflow-hidden">
                                                <div className="h-full bg-blue-500 w-1/2"></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                                <span>IDR 0</span>
                                                <span>IDR 5jt+</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-sm">Bintang Hotel</h4>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <button key={s} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors text-sm font-medium">
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Hotel List */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-bold text-lg text-slate-800">
                                        {searchQuery ? `Hasil untuk "${searchQuery}"` : "Rekomendasi Pilihan"}
                                    </h2>
                                    <span className="text-sm text-slate-500">{filteredHotels.length} Properti ditemukan</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredHotels.map((hotel) => (
                                        <div
                                            key={hotel.id}
                                            onClick={() => handleHotelClick(hotel)}
                                            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                        >
                                            <div className="relative h-48 bg-slate-200">
                                                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <button
                                                    onClick={(e) => toggleFavorite(e, hotel.id)}
                                                    className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white transition-colors"
                                                >
                                                    <Heart size={18} className={favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-slate-600"} />
                                                </button>
                                                {/* Vendor Badge */}
                                                <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-bold text-white shadow-sm 
                          ${hotel.vendorType === 'official' ? 'bg-blue-600' :
                                                        hotel.vendorType === 'partner' ? 'bg-orange-500' : 'bg-green-600'}`}>
                                                    {hotel.vendorType === 'official' ? 'Official Partner' : hotel.vendor}
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-lg leading-tight text-slate-800 line-clamp-1">{hotel.name}</h3>
                                                </div>
                                                <div className="flex items-center text-slate-500 text-xs mb-3">
                                                    <MapPin size={12} className="mr-1" />
                                                    {hotel.location}
                                                </div>

                                                <div className="flex gap-1 mb-4 flex-wrap">
                                                    {hotel.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tag}</span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-1 mb-4">
                                                    <div className="flex items-center bg-blue-50 px-2 py-0.5 rounded text-blue-700 font-bold text-xs">
                                                        <Star size={10} className="fill-blue-700 mr-1" />
                                                        {hotel.rating}
                                                    </div>
                                                    <span className="text-xs text-slate-400">({hotel.reviews} ulasan)</span>
                                                </div>

                                                <div className="border-t border-slate-100 pt-3 flex flex-col items-end">
                                                    <span className="text-xs text-slate-400 line-through">
                                                        {formatRupiah(hotel.price * 1.2)}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-sm font-semibold text-orange-500">Mulai</span>
                                                        <span className="text-lg font-bold text-blue-600">{formatRupiah(hotel.price)}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400">per malam, termasuk pajak</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- DETAIL VIEW --- */
                    <div className="animate-fade-in bg-white min-h-screen pb-20 md:pb-0">
                        {/* Mobile Back Header */}
                        <div className="md:hidden absolute top-4 left-4 z-50">
                            <button onClick={handleBack} className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg text-slate-800">
                                <ChevronLeft size={24} />
                            </button>
                        </div>

                        {/* Hero Image */}
                        <div className="relative h-64 md:h-96 w-full">
                            <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <span className="bg-blue-600 text-xs px-2 py-1 rounded mb-2 inline-block">
                                    Dikelola oleh {selectedHotel.vendor}
                                </span>
                                <h1 className="text-2xl md:text-4xl font-bold">{selectedHotel.name}</h1>
                                <p className="flex items-center text-sm md:text-base opacity-90 mt-1">
                                    <MapPin size={14} className="mr-1" /> {selectedHotel.location}
                                </p>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto px-4 py-6">
                            {/* Stats Bar */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-blue-600">{selectedHotel.rating}</span>
                                    <span className="text-xs text-slate-500">Luar Biasa</span>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                <div className="text-center">
                                    <span className="block font-bold text-slate-800">{selectedHotel.reviews}</span>
                                    <span className="text-xs text-slate-500">Ulasan</span>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                <div className="text-center">
                                    <CheckCircle className="mx-auto text-green-500 w-5 h-5 mb-1" />
                                    <span className="text-xs text-slate-500">Terverifikasi</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-3">Tentang Akomodasi</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Nikmati pengalaman menginap yang tak terlupakan di {selectedHotel.name}.
                                    Properti ini menawarkan perpaduan sempurna antara kenyamanan modern dan nuansa lokal.
                                    Cocok untuk {selectedHotel.tags.join(", ")}. Dikelola secara profesional oleh {selectedHotel.vendor} untuk menjamin standar kebersihan dan pelayanan terbaik.
                                </p>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-3">Fasilitas Utama</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedHotel.amenities.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                                            {item.includes("Wifi") ? <Wifi size={16} className="text-blue-500" /> :
                                                item.includes("Sarapan") ? <Coffee size={16} className="text-blue-500" /> :
                                                    item.includes("Parkir") || item.includes("Antar") ? <Car size={16} className="text-blue-500" /> :
                                                        <CheckCircle size={16} className="text-blue-500" />}
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Room Choice (Mock) */}
                            <div className="mb-24">
                                <h3 className="font-bold text-lg mb-4">Pilihan Kamar</h3>
                                <div className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                                    <div className="w-full md:w-48 h-32 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                        <img src={selectedHotel.image} className="w-full h-full object-cover" alt="Kamar" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-md mb-1">Deluxe King Room</h4>
                                        <p className="text-xs text-slate-500 mb-2">1 King Bed • 2 Dewasa • Pemandangan Kota</p>
                                        <div className="flex gap-2 mb-3">
                                            <span className="text-[10px] border border-green-200 text-green-700 bg-green-50 px-2 py-0.5 rounded">Sarapan Gratis</span>
                                            <span className="text-[10px] border border-blue-200 text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Bisa Refund</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end items-end md:w-40 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                                        <span className="text-xs text-slate-400 line-through">{formatRupiah(selectedHotel.price * 1.1)}</span>
                                        <span className="font-bold text-lg text-blue-600">{formatRupiah(selectedHotel.price)}</span>
                                        <button className="mt-2 w-full bg-blue-600 text-white text-sm font-bold py-2 rounded hover:bg-blue-700">
                                            Pilih
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sticky Booking Bar */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden flex items-center justify-between z-50 pb-8">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500">Harga per malam</span>
                                <span className="font-bold text-lg text-blue-600">{formatRupiah(selectedHotel.price)}</span>
                            </div>
                            <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-600">
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* --- MOBILE BOTTOM NAV --- */}
            <nav className={`fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-3 pb-5 md:hidden z-40 transition-transform duration-300 ${view === 'detail' ? 'translate-y-full' : 'translate-y-0'}`}>
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <HomeIcon size={22} fill={activeTab === 'home' ? "currentColor" : "none"} />
                    <span className="text-[10px] font-medium">Beranda</span>
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <Search size={22} />
                    <span className="text-[10px] font-medium">Cari</span>
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <Calendar size={22} />
                    <span className="text-[10px] font-medium">Pesanan</span>
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'account' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <User size={22} fill={activeTab === 'account' ? "currentColor" : "none"} />
                    <span className="text-[10px] font-medium">Akun</span>
                </button>
            </nav>

            {/* DESKTOP FOOTER (Simple) */}
            <footer className="hidden md:block bg-slate-900 text-white py-10 mt-10">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold">Blueking</h2>
                        </div>
                        <p className="text-slate-400 text-sm">Platform booking hotel multi-vendor terpercaya di Indonesia.</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Perusahaan</h3>
                        <ul className="text-slate-400 text-sm space-y-2">
                            <li>Tentang Kami</li>
                            <li>Karir</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Bantuan</h3>
                        <ul className="text-slate-400 text-sm space-y-2">
                            <li>Pusat Bantuan</li>
                            <li>Syarat & Ketentuan</li>
                            <li>Kebijakan Privasi</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Metode Pembayaran</h3>
                        <div className="flex gap-2">
                            <div className="w-10 h-6 bg-white rounded"></div>
                            <div className="w-10 h-6 bg-white rounded"></div>
                            <div className="w-10 h-6 bg-white rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    &copy; 2026 Muhamad Bilal Pangestu. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

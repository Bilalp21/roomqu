import React, { useState } from 'react';
import {
    LayoutDashboard, Hotel, Percent, Calendar, User, Settings,
    LogOut, TrendingUp, DollarSign, Users, Star, Plus, Search,
    Edit, Trash2, Eye, Bell, Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useSite } from '../SiteContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { PARTNER_HOTELS, PARTNER_ROOMS, PARTNER_PROMOS, PARTNER_BOOKINGS, PARTNER_STATS } from '../partnerData';

export default function PartnerDashboard() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { siteName } = useSite();
    const [activeTab, setActiveTab] = useState('dashboard');

    // State management
    const [hotels, setHotels] = useState(PARTNER_HOTELS);
    const [rooms, setRooms] = useState(PARTNER_ROOMS);
    const [promos, setPromos] = useState(PARTNER_PROMOS);
    const [bookings, setBookings] = useState(PARTNER_BOOKINGS);
    const stats = PARTNER_STATS;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/partner/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Gagal logout: ' + error.message);
        }
    };

    // Stats for dashboard
    const dashboardStats = [
        {
            title: 'Total Hotel',
            value: stats.totalHotels,
            icon: Hotel,
            gradient: 'from-purple-500 to-pink-600',
            trend: '+2 bulan ini'
        },
        {
            title: 'Total Kamar',
            value: stats.totalRooms,
            icon: Building,
            gradient: 'from-blue-500 to-indigo-600',
            trend: `${stats.totalRooms} kamar`
        },
        {
            title: 'Booking Bulan Ini',
            value: stats.monthlyBookings,
            icon: Calendar,
            gradient: 'from-green-500 to-emerald-600',
            trend: '+15% dari bulan lalu'
        },
        {
            title: 'Revenue Bulan Ini',
            value: `Rp ${(stats.monthlyRevenue / 1000000).toFixed(1)}Jt`,
            icon: DollarSign,
            gradient: 'from-orange-500 to-red-600',
            trend: '+12% dari bulan lalu'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 fixed h-full z-20 left-0 top-0 hidden md:flex flex-col shadow-xl">
                {/* Logo */}
                <div className="p-6 border-b border-slate-100/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Building className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-slate-800">{siteName}</h1>
                            <p className="text-xs text-slate-500">Partner Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavItem icon={Hotel} label="Hotel Saya" active={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} />
                    <NavItem icon={Building} label="Manage Kamar" active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} />
                    <NavItem icon={Percent} label="Promo & Voucher" active={activeTab === 'promos'} onClick={() => setActiveTab('promos')} />
                    <NavItem icon={Calendar} label="Booking" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                    <NavItem icon={TrendingUp} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                    <NavItem icon={User} label="Profil Partner" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <NavItem icon={Settings} label="Pengaturan" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>

                {/* User Profile Card */}
                <div className="p-4 border-t border-slate-100/50">
                    <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-4 mb-3 relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {currentUser?.displayName?.charAt(0) || 'P'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm truncate">{currentUser?.displayName || 'Partner'}</p>
                                <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}
                            type="button"
                            className="relative z-[1000] w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200 cursor-pointer"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-2 px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors"
                    >
                        Kembali ke Website
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-6 md:p-8">
                {/* Top Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-1">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'hotels' && 'Hotel Saya'}
                            {activeTab === 'rooms' && 'Manage Kamar'}
                            {activeTab === 'promos' && 'Promo & Voucher'}
                            {activeTab === 'bookings' && 'Booking'}
                            {activeTab === 'analytics' && 'Analytics'}
                            {activeTab === 'profile' && 'Profil Partner'}
                            {activeTab === 'settings' && 'Pengaturan'}
                        </h1>
                        <p className="text-slate-500">
                            {activeTab === 'dashboard' && 'Selamat datang kembali!'}
                            {activeTab === 'hotels' && 'Kelola properti hotel Anda'}
                            {activeTab === 'rooms' && 'Kelola kamar dan ketersediaan'}
                            {activeTab === 'promos' && 'Buat dan kelola promo Anda'}
                            {activeTab === 'bookings' && 'Lihat dan kelola booking'}
                            {activeTab === 'analytics' && 'Analisis performa bisnis Anda'}
                        </p>
                    </div>
                    <button className="relative p-3 bg-white hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 transition-all">
                        <Bell size={20} className="text-slate-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dashboardStats.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                            <stat.icon size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-2">{stat.title}</p>
                                    <p className="text-xs text-green-600 font-bold">{stat.trend}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Bookings */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                            <h3 className="font-bold text-xl text-slate-800 mb-4">Booking Terbaru</h3>
                            <div className="space-y-3">
                                {bookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800">{booking.guestInfo.name}</p>
                                            <p className="text-sm text-slate-500">{hotels.find(h => h.id === booking.hotelId)?.name} - {booking.checkIn}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-purple-600">Rp {booking.finalPrice.toLocaleString('id-ID')}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Hotels Tab */}
                {activeTab === 'hotels' && (
                    <div className="space-y-6">
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200">
                            <Plus size={20} />
                            Tambah Hotel Baru
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {hotels.map((hotel) => (
                                <div key={hotel.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
                                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{hotel.name}</h3>
                                                <p className="text-sm text-slate-500">{hotel.city}, {hotel.province}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${hotel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {hotel.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1 text-orange-600">
                                                <Star size={16} fill="currentColor" />
                                                <span className="font-bold">{hotel.rating}</span>
                                            </div>
                                            <span className="text-sm text-slate-500">{hotel.totalReviews} reviews</span>
                                            <span className="text-sm text-slate-500">{hotel.totalRooms} kamar</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                                                <Eye size={16} />
                                                Detail
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rooms Tab - Will be implemented with full form */}
                {activeTab === 'rooms' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl">
                                <option>Semua Hotel</option>
                                {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200">
                                <Plus size={20} />
                                Tambah Kamar Baru
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {rooms.map((room) => (
                                <div key={room.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                                    <img src={room.images[0]} alt={room.name} className="w-full h-40 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 mb-2">{room.name}</h3>
                                        <p className="text-sm text-slate-500 mb-3">{hotels.find(h => h.id === room.hotelId)?.name}</p>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-lg font-bold text-purple-600">Rp {room.price.toLocaleString('id-ID')}</span>
                                            <span className="text-sm text-slate-500">{room.quantity} kamar</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-sm">Edit</button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other tabs placeholder */}
                {(activeTab === 'promos' || activeTab === 'bookings' || activeTab === 'analytics' || activeTab === 'profile' || activeTab === 'settings') && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building size={40} className="text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Fitur {activeTab}</h3>
                        <p className="text-slate-500">Sedang dalam pengembangan...</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
        >
            <Icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
            {label}
        </button>
    );
}

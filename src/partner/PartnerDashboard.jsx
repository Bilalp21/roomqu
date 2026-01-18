import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Hotel, Percent, Calendar, User, Settings,
    LogOut, TrendingUp, DollarSign, Users, Star, Plus, Search,
    Edit, Trash2, Eye, Bell, Building, CheckCircle, X, Save, ArrowLeft, Upload, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useSite } from '../SiteContext';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { PARTNER_HOTELS, PARTNER_ROOMS, PARTNER_PROMOS, PARTNER_BOOKINGS, PARTNER_STATS } from '../partnerData';
import AddHotelForm from './components/AddHotelForm';

export default function PartnerDashboard() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { siteName } = useSite();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddHotelForm, setShowAddHotelForm] = useState(false);

    // Form States
    const [newHotel, setNewHotel] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        province: '',
        rating: 5,
        totalRooms: 0,
        facilities: [],
        images: [''],
        status: 'pending' // Default needs admin approval usually, or active
    });

    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    const [newRoom, setNewRoom] = useState({
        hotelId: '',
        name: '',
        description: '',
        price: 0,
        capacity: 2,
        bedType: 'Queen Bed',
        quantity: 1,
        size: 20,
        facilities: [],
        images: [''],
        status: 'available'
    });

    // State management - Firebase Sync
    const [hotels, setHotels] = useState([]);
    const [isLoadingHotels, setIsLoadingHotels] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Listen to Real-time Hotels Data
    useEffect(() => {
        if (!currentUser) {
            setIsLoadingHotels(false);
            return;
        }

        const q = query(
            collection(db, "hotels"),
            where("partnerId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const hotelsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Fetched Hotels for Partner:", currentUser.uid, hotelsData);
            setHotels(hotelsData);
            setIsLoadingHotels(false);
        }, (error) => {
            console.error("Error fetching hotels:", error);
            setFetchError("Gagal mengambil data: " + error.message);
            setIsLoadingHotels(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Listen to Real-time Rooms Data
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        if (!currentUser) return;

        // We want rooms that belong to this partner. 
        // We can add partnerId to room documents for easier querying.
        const q = query(
            collection(db, "rooms"),
            where("partnerId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const roomsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRooms(roomsData);
        }, (error) => {
            console.error("Error fetching rooms:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);
    // Listen to Real-time Promos Data
    const [promos, setPromos] = useState([]);
    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "promos"),
            where("partnerId", "==", currentUser.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPromos(data);
        });
        return () => unsubscribe();
    }, [currentUser]);

    // Listen to Real-time Bookings Data
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "bookings"),
            where("partnerId", "==", currentUser.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(data);
        });
        return () => unsubscribe();
    }, [currentUser]);

    // Dynamic Stats Calculation
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.finalPrice || 0), 0);
    const monthlyBookingsCount = bookings.filter(b => {
        // Simple check for "this month" - in prod use proper date libraries
        const date = new Date(b.createdAt?.toDate?.() || b.createdAt); // Handle Firestore Timestamp or ISO string
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    // Fallback/Mock stats for revenue trend since we don't have historical data structure yet
    const stats = {
        totalRooms: rooms.reduce((sum, r) => sum + (r.quantity || 0), 0),
        monthlyBookings: monthlyBookingsCount,
        monthlyRevenue: totalRevenue
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/partner/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Gagal logout: ' + error.message);
        }
    };

    const handleAddHotel = async (e) => {
        e.preventDefault();
        try {
            const hotelData = {
                ...newHotel,
                partnerId: currentUser.uid,
                totalReviews: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'pending' // Enforce pending status
            };

            await addDoc(collection(db, "hotels"), hotelData);

            setShowAddHotelForm(false);
            alert('Hotel berhasil ditambahkan dan menunggu persetujuan Admin!');
            // Reset form
            setNewHotel({
                name: '',
                description: '',
                address: '',
                city: '',
                province: '',
                rating: 5,
                totalRooms: 0,
                facilities: [],
                images: [''],
                status: 'pending'
            });
        } catch (error) {
            console.error("Error adding hotel:", error);
            alert("Gagal menambahkan hotel: " + error.message);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!newRoom.hotelId) {
            alert("Silakan pilih hotel terlebih dahulu.");
            return;
        }

        try {
            const roomData = {
                ...newRoom,
                partnerId: currentUser.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, "rooms"), roomData);

            // Optionally update totalRooms in hotel doc
            // const hotelRef = doc(db, "hotels", newRoom.hotelId);
            // await updateDoc(hotelRef, { totalRooms: increment(newRoom.quantity) });

            setShowAddRoomForm(false);
            alert('Kamar berhasil ditambahkan!');
            setNewRoom({
                hotelId: '',
                name: '',
                description: '',
                price: 0,
                capacity: 2,
                bedType: 'Queen Bed',
                quantity: 1,
                size: 20,
                facilities: [],
                images: [''],
                status: 'available'
            });
        } catch (error) {
            console.error("Error adding room:", error);
            alert("Gagal menambahkan kamar: " + error.message);
        }
    };

    // Stats for dashboard
    const dashboardStats = [
        {
            title: 'Total Hotel',
            value: hotels.length,
            icon: Hotel,
            gradient: 'from-purple-500 to-pink-600',
            trend: '+Realtime'
        },
        {
            title: 'Total Kamar',
            value: rooms.length, // Or stats.totalRooms for total units
            icon: Building,
            gradient: 'from-blue-500 to-indigo-600',
            trend: `${stats.totalRooms} unit`
        },
        {
            title: 'Booking Bulan Ini',
            value: stats.monthlyBookings,
            icon: Calendar,
            gradient: 'from-green-500 to-emerald-600',
            trend: 'Realtime data'
        },
        {
            title: 'Revenue Total',
            value: `Rp ${(stats.monthlyRevenue / 1000000).toFixed(1)}Jt`,
            icon: DollarSign,
            gradient: 'from-orange-500 to-red-600',
            trend: 'Akumulasi'
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
                        {!showAddHotelForm ? (
                            <>
                                <button
                                    onClick={() => setShowAddHotelForm(true)}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200"
                                >
                                    <Plus size={20} />
                                    Tambah Hotel Baru
                                </button>

                                {isLoadingHotels ? (
                                    <div className="text-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                        <p className="text-slate-500">Mengambil data hotel...</p>
                                    </div>
                                ) : fetchError ? (
                                    <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center">
                                        <h3 className="font-bold text-lg mb-2">Gagal Memuat Data</h3>
                                        <p>{fetchError}</p>
                                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold">Coba Muat Ulang</button>
                                    </div>
                                ) : hotels.length === 0 ? (
                                    <div className="col-span-1 lg:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-100">
                                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Hotel size={40} className="text-purple-300" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-2">Belum Ada Hotel</h3>
                                        <p className="text-slate-500 mb-6">Anda belum menambahkan properti apapun. Mulai sekarang!</p>
                                        <button
                                            onClick={() => setShowAddHotelForm(true)}
                                            className="bg-white border-2 border-purple-100 hover:border-purple-200 text-purple-600 px-6 py-2 rounded-xl font-bold transition-all"
                                        >
                                            Tambah Hotel Pertama
                                        </button>
                                        <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs font-mono text-slate-500 max-w-md mx-auto text-left space-y-1">
                                            <p className="font-bold border-b border-slate-200 pb-1 mb-2">Debug Info (Developer):</p>
                                            <p>Partner UID: <span className="font-bold">{currentUser?.uid}</span></p>
                                            <p>Email: {currentUser?.email}</p>
                                            <p>Fetch Status: {isLoadingHotels ? 'Loading...' : 'Done'}</p>
                                            <p>Hotels Count: {hotels.length}</p>
                                        </div>
                                    </div>
                                ) : (
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
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${hotel.status === 'active' ? 'bg-green-100 text-green-700' :
                                                            hotel.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {hotel.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="flex items-center gap-1 text-orange-600">
                                                            <Star size={16} fill="currentColor" />
                                                            <span className="font-bold">{hotel.rating}</span>
                                                        </div>
                                                        <span className="text-sm text-slate-500">{hotel.totalReviews} reviews</span>
                                                        <span className="text-sm text-slate-500">{hotel.totalRooms || 0} kamar</span>
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
                                )}
                            </>
                        ) : (
                            <AddHotelForm
                                currentUser={currentUser}
                                onCancel={() => setShowAddHotelForm(false)}
                                onSuccess={() => setShowAddHotelForm(false)}
                            />
                        )}
                    </div>
                )}

                {/* Rooms Tab - Will be implemented with full form */}
                {activeTab === 'rooms' && (
                    <div className="space-y-6">
                        {!showAddRoomForm ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <select className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100">
                                        <option value="all">Semua Hotel</option>
                                        {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                    </select>
                                    <button
                                        onClick={() => setShowAddRoomForm(true)}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200"
                                    >
                                        <Plus size={20} />
                                        Tambah Kamar Baru
                                    </button>
                                </div>

                                {rooms.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                                        <Building size={48} className="mx-auto text-slate-300 mb-4" />
                                        <h3 className="text-lg font-bold text-slate-700">Belum Ada Kamar</h3>
                                        <p className="text-slate-500">Silakan tambahkan tipe kamar untuk hotel Anda.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {rooms.map((room) => (
                                            <div key={room.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
                                                <div className="h-48 relative">
                                                    <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                        Sisa: {room.quantity} Unit
                                                    </div>
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <div className="mb-auto">
                                                        <h3 className="font-bold text-slate-800 text-lg mb-1">{room.name}</h3>
                                                        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                                                            <Building size={12} />
                                                            {hotels.find(h => h.id === room.hotelId)?.name || 'Unknown Hotel'}
                                                        </p>
                                                        <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                            {room.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mb-4">
                                                            {room.facilities.slice(0, 3).map((f, i) => (
                                                                <span key={i} className="text-[10px] px-2 py-1 bg-purple-50 text-purple-600 rounded-md font-medium border border-purple-100">{f}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t border-slate-100">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div>
                                                                <p className="text-xs text-slate-400">Harga per malam</p>
                                                                <p className="text-lg font-bold text-purple-600">Rp {Number(room.price).toLocaleString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-sm transition-colors">Edit</button>
                                                            <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4 mb-8">
                                    <button
                                        onClick={() => setShowAddRoomForm(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <ArrowLeft size={24} className="text-slate-600" />
                                    </button>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">Tambah Tipe Kamar Baru</h2>
                                        <p className="text-slate-500 text-sm">Kelola inventaris kamar untuk properti Anda</p>
                                    </div>
                                </div>

                                <form onSubmit={handleAddRoom} className="space-y-8">
                                    {/* Hotel Selection */}
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <label className="text-sm font-bold text-purple-900 mb-2 block">Pilih Properti / Hotel</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none"
                                            value={newRoom.hotelId}
                                            onChange={e => setNewRoom({ ...newRoom, hotelId: e.target.value })}
                                        >
                                            <option value="">-- Pilih Hotel --</option>
                                            {hotels.filter(h => h.status === 'active').map(h => (
                                                <option key={h.id} value={h.id}>{h.name}</option>
                                            ))}
                                            {hotels.filter(h => h.status !== 'active').map(h => (
                                                <option key={h.id} value={h.id} disabled>{h.name} (Belum disetujui)</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-purple-600 mt-2">* Hanya hotel yang berstatus "Active" yang dapat ditambahkan kamar.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Basic Info */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Nama Tipe Kamar</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                    placeholder="Contoh: Deluxe King Room"
                                                    value={newRoom.name}
                                                    onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700">Harga per Malam</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold">Rp</span>
                                                        <input
                                                            required
                                                            type="number"
                                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                            placeholder="0"
                                                            value={newRoom.price}
                                                            onChange={e => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700">Jumlah Unit</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                        value={newRoom.quantity}
                                                        onChange={e => setNewRoom({ ...newRoom, quantity: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700">Kapasitas</label>
                                                    <div className="relative">
                                                        <input
                                                            required
                                                            type="number"
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                            value={newRoom.capacity}
                                                            onChange={e => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                                                        />
                                                        <span className="absolute right-4 top-3.5 text-slate-400 text-xs">Orang</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 col-span-2">
                                                    <label className="text-sm font-bold text-slate-700">Tipe Ranjang</label>
                                                    <select
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                        value={newRoom.bedType}
                                                        onChange={e => setNewRoom({ ...newRoom, bedType: e.target.value })}
                                                    >
                                                        <option value="Single Bed">Single Bed</option>
                                                        <option value="Double Bed">Double Bed</option>
                                                        <option value="Queen Bed">Queen Bed</option>
                                                        <option value="King Bed">King Bed</option>
                                                        <option value="Twin Bed">Twin Bed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Deskripsi Kamar</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                    placeholder="Deskripsikan kenyamanan kamar ini..."
                                                    value={newRoom.description}
                                                    onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Fasilitas Kamar</label>
                                                <textarea
                                                    required
                                                    rows="2"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                    placeholder="AC, TV, Minibar, Bathtub..."
                                                    value={newRoom.facilities.join(', ')}
                                                    onChange={e => setNewRoom({ ...newRoom, facilities: e.target.value.split(',').map(f => f.trim()) })}
                                                ></textarea>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">URL Foto Kamar</label>
                                                <input
                                                    required
                                                    type="url"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                                    placeholder="https://example.com/room.jpg"
                                                    value={newRoom.images[0]}
                                                    onChange={e => {
                                                        const imgs = [...newRoom.images];
                                                        imgs[0] = e.target.value;
                                                        setNewRoom({ ...newRoom, images: imgs });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddRoomForm(false)}
                                            className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            Simpan Kamar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
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

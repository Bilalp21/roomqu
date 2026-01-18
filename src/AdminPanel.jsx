import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Hotel, Users, Settings, User,
    Plus, Search, Trash2, Edit, Bell, LogOut,
    TrendingUp, DollarSign, Calendar, ChevronDown,
    Mail, Phone, MapPin, Shield, Camera, CheckCircle,
    XCircle, Clock, Building, FileText, CreditCard, Eye, Sparkles
} from 'lucide-react';
import { HOTELS } from './data';
import { VENDORS, VENDOR_STATS } from './vendorData';
import { useNavigate } from 'react-router-dom';
import { useSite } from './SiteContext';
import { useAuth } from './AuthContext';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import VendorManagement from './VendorManagement';
import { VendorDetailModal, AddVendorModal } from './VendorModals';
import ApprovalTab from './admin/ApprovalTab';

export default function AdminPanel() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    // HOTEL DATA MANAGEMENT (FIREBASE)
    const [allHotels, setAllHotels] = useState([]);
    const [dbError, setDbError] = useState(null);

    // Real-time listener for ALL hotels
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "hotels"),
            (snapshot) => {
                const hotelsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllHotels(hotelsData);
                setDbError(null);
                console.log(`[AdminPanel] Loaded ${hotelsData.length} hotels from Firestore`);
            },
            (error) => {
                console.error("Error fetching hotels:", error);
                setDbError("Gagal mengambil data dari database. Cek koneksi atau izin akses. Detail: " + error.code);
            }
        );
        return () => unsubscribe();
    }, []);

    // Derived states
    // Case-insensitive check for robustness
    const pendingHotels = allHotels.filter(h => h.status && h.status.toLowerCase() === 'pending');
    const activeHotels = allHotels.filter(h => h.status === 'active');
    // Keep approvalHotels for compatibility if used elsewhere, but prefer pendingHotels for the tab
    const approvalHotels = allHotels;

    console.log("Admin Panel All Hotels:", allHotels);
    console.log("Admin Panel Pending Hotels:", pendingHotels);

    const { siteName, updateSiteName, chatEnabled, updateChatEnabled } = useSite();
    const [tempSiteName, setTempSiteName] = useState(siteName);
    // AI Settings State
    const [aiApiKey, setAiApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
    const [aiPrompt, setAiPrompt] = useState(localStorage.getItem('geminiSystemPrompt') || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Vendor Management States
    // VENDOR DATA MANAGEMENT (FIREBASE)
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "vendors"), (snapshot) => {
            const vendorsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVendors(vendorsData);
        }, (error) => {
            console.error("Error fetching vendors:", error);
        });
        return () => unsubscribe();
    }, []);

    const [vendorSearchQuery, setVendorSearchQuery] = useState('');
    const [vendorFilter, setVendorFilter] = useState('all'); // all, active, pending, suspended
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [showVendorDetailModal, setShowVendorDetailModal] = useState(false);

    const handleApproveHotel = async (id) => {
        if (confirm('Setujui hotel ini untuk ditayangkan?')) {
            try {
                await updateDoc(doc(db, "hotels", id), {
                    status: 'active',
                    approvedAt: new Date().toISOString()
                });
                // No need to manually update state, onSnapshot handles it
            } catch (error) {
                console.error("Error approving hotel:", error);
                alert("Gagal menyetujui hotel: " + error.message);
            }
        }
    };

    const handleRejectHotel = async (id) => {
        if (confirm('Tolak pengajuan hotel ini?')) {
            try {
                await updateDoc(doc(db, "hotels", id), {
                    status: 'rejected',
                    rejectedAt: new Date().toISOString()
                });
            } catch (error) {
                console.error("Error rejecting hotel:", error);
                alert("Gagal menolak hotel: " + error.message);
            }
        }
    };

    const handleSeedDatabase = async () => {
        if (!confirm('PERINGATAN: Ini akan mengunggah data dummy hotel ke Firebase. Lanjutkan?')) return;

        try {
            const batch = writeBatch(db);
            let count = 0;

            HOTELS.forEach((hotel) => {
                // Check if hotel already exists in our current state state to avoid dups if possible, 
                // but ID might differ.
                // For seeding, we just create new refs with custom IDs if possible or auto-ids.
                // Let's use the ID from the mock data as the doc ID to be safe and idempotent-ish.
                const docRef = doc(db, "hotels", hotel.id);
                batch.set(docRef, {
                    ...hotel,
                    partnerId: 'seed-partner', // Dummy partner ID
                    status: 'active', // Default active for seed data
                    createdAt: new Date().toISOString()
                });
                count++;
            });

            await batch.commit();
            alert(`Berhasil mengunggah ${count} hotel ke database!`);
        } catch (error) {
            console.error("Error seeding database:", error);
            alert("Gagal seeding database: " + error.message);
        }
    };

    // Admin Profile Data
    const [adminProfile, setAdminProfile] = useState({
        displayName: currentUser?.displayName || 'Administrator',
        email: currentUser?.email || 'admin@roomqu.id',
        phone: '+62 812-3456-7890',
        role: 'Super Admin',
        location: 'Jakarta, Indonesia',
        joinDate: 'Januari 2024'
    });

    // Mock Statistics with real data integration
    const stats = [
        {
            title: 'Total Pendapatan',
            value: 'Rp 450.5Jt',
            icon: DollarSign,
            gradient: 'from-emerald-500 to-teal-600',
            trend: '+12.5%',
            trendUp: true
        },
        {
            title: 'Total Pemesanan',
            value: '1,240',
            icon: Calendar,
            gradient: 'from-blue-500 to-indigo-600',
            trend: '+8.2%',
            trendUp: true
        },
        {
            title: 'Hotel Aktif',
            value: activeHotels.length, // synced
            icon: Hotel,
            gradient: 'from-orange-500 to-red-600',
            trend: '+Realtime',
            trendUp: true
        },
        {
            title: 'Vendor Terdaftar',
            value: vendors.length,
            icon: Users,
            gradient: 'from-purple-500 to-pink-600',
            trend: '+Realtime',
            trendUp: true
        },
    ];

    // Filter logic for Management Tab
    const filteredHotels = activeHotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hotel.vendor || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (confirm('Apakah anda yakin ingin menghapus hotel ini?')) {
            try {
                await deleteDoc(doc(db, "hotels", id));
            } catch (error) {
                console.error("Error deleting hotel:", error);
                alert("Gagal menghapus hotel: " + error.message);
            }
        }
    };

    // Vendor Management Handlers (FIREBASE)
    const handleVendorStatusChange = async (vendorId, newStatus) => {
        try {
            await updateDoc(doc(db, "vendors", vendorId), { status: newStatus });
        } catch (error) {
            console.error("Error updating vendor status:", error);
            alert("Gagal update status vendor: " + error.message);
        }
    };

    const handleVendorApprove = async (vendorId) => {
        if (confirm('Setujui vendor ini?')) {
            try {
                await updateDoc(doc(db, "vendors", vendorId), {
                    status: 'active',
                    approvedAt: new Date().toISOString()
                });
                setShowVendorDetailModal(false);
                alert('Vendor berhasil disetujui!');
            } catch (error) {
                alert("Gagal: " + error.message);
            }
        }
    };

    const handleVendorReject = async (vendorId) => {
        if (confirm('Tolak vendor ini?')) {
            try {
                await updateDoc(doc(db, "vendors", vendorId), {
                    status: 'rejected',
                    rejectedAt: new Date().toISOString()
                });
                setShowVendorDetailModal(false);
                alert('Vendor ditolak.');
            } catch (error) {
                alert("Gagal: " + error.message);
            }
        }
    };

    const handleVendorSuspend = async (vendorId) => {
        if (confirm('Suspend vendor ini?')) {
            await handleVendorStatusChange(vendorId, 'suspended');
            setShowVendorDetailModal(false);
            alert('Vendor berhasil di-suspend.');
        }
    };

    const handleVendorDelete = async (vendorId) => {
        if (confirm('Apakah Anda yakin ingin menghapus vendor ini? Tindakan ini tidak dapat dibatalkan.')) {
            try {
                await deleteDoc(doc(db, "vendors", vendorId));
                alert('Vendor berhasil dihapus.');
            } catch (error) {
                alert("Gagal hapus: " + error.message);
            }
        }
    };

    const handleAddVendor = async (formData) => {
        const newVendor = {
            ...formData,
            status: 'pending',
            verificationStatus: 'pending',
            joinDate: new Date().toISOString().split('T')[0],
            totalHotels: 0,
            totalBookings: 0,
            totalRevenue: 0,
            rating: 0,
            documents: {
                businessLicense: false,
                taxId: false,
                bankAccount: !!formData.accountNumber
            },
            bankInfo: {
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountName: formData.accountName
            },
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, "vendors"), newVendor);
            setShowVendorModal(false);
            alert('Vendor baru berhasil ditambahkan!');
        } catch (error) {
            console.error("Error adding vendor:", error);
            alert("Gagal menambahkan vendor: " + error.message);
        }
    };

    const handleLogout = async () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            try {
                await signOut(auth);
                navigate('/admin/login');
            } catch (error) {
                console.error('Logout error:', error);
                alert('Gagal logout. Silakan coba lagi.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex font-sans">
            {/* Modern Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 fixed h-full z-20 left-0 top-0 hidden md:flex flex-col shadow-xl">
                {/* Logo Header */}
                <div className="p-6 border-b border-slate-100/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-slate-800">{siteName}</h1>
                            <p className="text-xs text-slate-500">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <NavItem
                        icon={Hotel}
                        label="Manajemen Hotel"
                        active={activeTab === 'hotels'}
                        onClick={() => setActiveTab('hotels')}
                    />

                    {/* Approval Tab Notification Badge */}
                    <div className="relative">
                        <NavItem
                            icon={CheckCircle}
                            label="Approval Hotel"
                            active={activeTab === 'approvals'}
                            onClick={() => setActiveTab('approvals')}
                        />
                        {pendingHotels.length > 0 && (
                            <span className="absolute right-4 top-3 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse border-2 border-white">
                                {pendingHotels.length}
                            </span>
                        )}
                    </div>

                    <NavItem
                        icon={Users}
                        label="Vendor & Mitra"
                        active={activeTab === 'vendors'}
                        onClick={() => setActiveTab('vendors')}
                    />
                    <NavItem
                        icon={User}
                        label="Profil Admin"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <NavItem
                        icon={Settings}
                        label="Pengaturan"
                        active={activeTab === 'settings'}
                        onClick={() => {
                            setActiveTab('settings');
                            setTempSiteName(siteName);
                        }}
                    />
                    <NavItem
                        icon={Sparkles}
                        label="AI Chatbot"
                        active={activeTab === 'ai-settings'}
                        onClick={() => setActiveTab('ai-settings')}
                    />
                </nav>

                {/* User Profile Card */}
                <div className="p-4 border-t border-slate-100/50">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {adminProfile.displayName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm truncate">{adminProfile.displayName}</p>
                                <p className="text-xs text-slate-500 truncate">{adminProfile.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
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
                {/* Top Header Bar */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-1">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'hotels' && 'Manajemen Hotel'}
                            {activeTab === 'vendors' && 'Vendor & Mitra'}
                            {activeTab === 'profile' && 'Profil Admin'}
                            {activeTab === 'settings' && 'Pengaturan Website'}
                            {activeTab === 'ai-settings' && 'Konfigurasi AI'}
                        </h1>
                        <p className="text-slate-500">
                            {activeTab === 'dashboard' && 'Selamat datang kembali, Admin!'}
                            {activeTab === 'hotels' && 'Kelola daftar hotel dan properti Anda'}
                            {activeTab === 'vendors' && 'Manajemen vendor dan mitra bisnis'}
                            {activeTab === 'profile' && 'Kelola informasi profil Anda'}
                            {activeTab === 'settings' && 'Konfigurasi aplikasi dan preferensi'}
                            {activeTab === 'ai-settings' && 'Atur API Key dan Prompt untuk Chatbot Gemini'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-3 bg-white hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 transition-all">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="md:hidden">
                            <button
                                onClick={handleLogout}
                                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="group relative bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                                    <div className="relative p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                                <stat.icon size={24} className="text-white" />
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">Statistik Pendapatan</h3>
                                    <p className="text-sm text-slate-500">Performa bulanan tahun 2024</p>
                                </div>
                                <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-medium">
                                    <option>30 Hari Terakhir</option>
                                    <option>3 Bulan Terakhir</option>
                                    <option>Tahun Ini</option>
                                </select>
                            </div>
                            <div className="h-80 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                <div className="text-center">
                                    <TrendingUp size={48} className="text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-400 font-medium">Grafik Pendapatan</p>
                                    <p className="text-sm text-slate-400">Chart akan muncul di sini</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hotels Tab */}
                {activeTab === 'hotels' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                <Plus size={20} />
                                Tambah Hotel
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari nama hotel atau vendor..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-medium">
                                <option value="all">Semua Vendor</option>
                                <option value="official">Official Partner</option>
                                <option value="individual">Individual</option>
                            </select>
                        </div>

                        {/* Hotels Table */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Hotel Info</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Vendor</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Harga / Malam</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredHotels.map((hotel) => (
                                            <tr key={hotel.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <img src={hotel.image} alt={hotel.name} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                                                        <div>
                                                            <p className="font-bold text-slate-800">{hotel.name}</p>
                                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                <span className="truncate max-w-[200px]">{hotel.location}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-700">{hotel.vendor}</span>
                                                        <VendorBadge type={hotel.vendorType} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-blue-600 text-lg">Rp {hotel.price.toLocaleString('id-ID')}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 px-3 py-1.5 rounded-lg w-fit text-sm font-bold border border-orange-100">
                                                        ★ {hotel.rating}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(hotel.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredHotels.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    <Hotel size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p className="font-medium">Tidak ada hotel ditemukan untuk "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Vendors Tab */}
                {activeTab === 'vendors' && (
                    <VendorManagement
                        vendors={vendors}
                        vendorSearchQuery={vendorSearchQuery}
                        setVendorSearchQuery={setVendorSearchQuery}
                        vendorFilter={vendorFilter}
                        setVendorFilter={setVendorFilter}
                        setSelectedVendor={setSelectedVendor}
                        setShowVendorDetailModal={setShowVendorDetailModal}
                        setShowVendorModal={setShowVendorModal}
                        handleVendorStatusChange={handleVendorStatusChange}
                        handleVendorDelete={handleVendorDelete}
                    />
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                        {/* Profile Header Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-8 text-white">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl border-4 border-white/30">
                                            {adminProfile.displayName.charAt(0)}
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-2 bg-white text-blue-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={18} />
                                        </button>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-3xl font-bold mb-2">{adminProfile.displayName}</h2>
                                        <p className="text-blue-100 mb-4 flex items-center gap-2 justify-center md:justify-start">
                                            <Shield size={18} />
                                            {adminProfile.role}
                                        </p>
                                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                <Mail size={16} />
                                                <span className="text-sm">{adminProfile.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                <MapPin size={16} />
                                                <span className="text-sm">{adminProfile.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-blue-600" />
                                    Informasi Personal
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={adminProfile.displayName}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, displayName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={adminProfile.email}
                                            readOnly
                                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Nomor Telepon</label>
                                        <input
                                            type="tel"
                                            value={adminProfile.phone}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <Settings size={20} className="text-blue-600" />
                                    Informasi Akun
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Role</label>
                                        <input
                                            type="text"
                                            value={adminProfile.role}
                                            readOnly
                                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Lokasi</label>
                                        <input
                                            type="text"
                                            value={adminProfile.location}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, location: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">Bergabung Sejak</label>
                                        <input
                                            type="text"
                                            value={adminProfile.joinDate}
                                            readOnly
                                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="font-bold text-xl text-slate-800 mb-6">Informasi Umum</h3>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const success = await updateSiteName(tempSiteName);
                                if (success) alert('Nama website berhasil diperbarui!');
                            }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Website / Brand</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50"
                                        value={tempSiteName}
                                        onChange={(e) => setTempSiteName(e.target.value)}
                                        placeholder="Masukkan nama website brand Anda"
                                    />
                                    <p className="text-sm text-slate-500 mt-2">Nama ini akan muncul di header website dan panel admin.</p>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Approval Tab */}
                {activeTab === 'approvals' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Menunggu Persetujuan</h2>
                                <p className="text-slate-500">Daftar hotel baru yang diajukan oleh partner.</p>
                            </div>
                        </div>

                        <ApprovalTab
                            pendingHotels={pendingHotels}
                            onApprove={handleApproveHotel}
                            onReject={handleRejectHotel}
                        />
                    </div>
                )}

                {/* AI Settings Tab */}
                {activeTab === 'ai-settings' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                        <Sparkles className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800">Gemini AI Configuration</h3>
                                        <p className="text-sm text-slate-500">Atur kecerdasan buatan untuk asisten virtual</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                                    <span className={`text-sm font-bold ${chatEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                                        {chatEnabled ? 'Chat Aktif' : 'Chat Non-Aktif'}
                                    </span>
                                    <button
                                        onClick={() => updateChatEnabled(!chatEnabled)}
                                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${chatEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${chatEnabled ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                localStorage.setItem('geminiApiKey', aiApiKey);
                                localStorage.setItem('geminiSystemPrompt', aiPrompt);
                                alert('Pengaturan AI berhasil disimpan!');
                            }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Gemini API Key</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50 pr-10"
                                            value={aiApiKey}
                                            onChange={(e) => setAiApiKey(e.target.value)}
                                            placeholder="Masukkan API Key dari Google AI Studio"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Dapatkan API Key di <a href="https://aistudio.google.com/" target="_blank" className="text-blue-600 hover:underline">Google AI Studio</a>. Key ini disimpan di local browser untuk demo.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">System Instruction / RAG Prompt</label>
                                    <textarea
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50 h-40 font-mono text-sm"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Contoh: Kamu adalah asisten hotel RoomQu. Jawab dengan ramah..."
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        Instruksi ini akan digabungkan dengan data hotel otomatis (RAG) saat mengirim ke AI.
                                        Kosongkan untuk menggunakan prompt default.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                                    >
                                        Simpan Konfigurasi AI
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Database Tools (Dev Mode) */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-red-100 rounded-xl shadow-sm">
                                    <Settings className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">Database Tools</h3>
                                    <p className="text-sm text-slate-500">Alat bantu pengembang dan pemeliharaan</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <p className="text-sm text-slate-600 mb-4">
                                    Jika dashboard kosong, Anda dapat menggunakan tombol ini untuk mengisi database dengan data dummy awal.
                                    Pastikan koneksi internet lancar.
                                </p>
                                <button
                                    onClick={handleSeedDatabase}
                                    className="px-6 py-3 bg-white text-slate-700 font-bold rounded-lg border-2 border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    <Sparkles size={18} />
                                    Seed Dummy Data to Firebase
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Hotel Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Tambah Hotel Baru</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); alert('Fitur simpan (Demo) berhasil!'); }}>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Hotel</label>
                                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" placeholder="Contoh: Grand Luxury Hotel" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Harga / Malam</label>
                                    <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" placeholder="Rp 0" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi</label>
                                    <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" placeholder="Kota, Provinsi" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Vendor</label>
                                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" placeholder="Nama Perusahaan / Pemilik" required />
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">Batal</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all">Simpan Hotel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Vendor Detail Modal */}
            {showVendorDetailModal && selectedVendor && (
                <VendorDetailModal
                    vendor={selectedVendor}
                    onClose={() => setShowVendorDetailModal(false)}
                    onApprove={handleVendorApprove}
                    onReject={handleVendorReject}
                    onSuspend={handleVendorSuspend}
                />
            )}

            {/* Add Vendor Modal */}
            {showVendorModal && (
                <AddVendorModal
                    onClose={() => setShowVendorModal(false)}
                    onSubmit={handleAddVendor}
                />
            )}
        </div>
    );
}

function NavItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
        >
            <Icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
            {label}
        </button>
    );
}

function VendorBadge({ type }) {
    const styles = {
        official: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
        partner: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200',
        individual: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200'
    };

    const labels = {
        official: 'Official Partner',
        partner: 'Verified Partner',
        individual: 'Individual Owner'
    };

    return (
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg border ${styles[type] || 'bg-gray-100 text-gray-600'} mt-1 inline-block`}>
            {labels[type] || type}
        </span>
    );
}

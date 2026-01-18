import React from 'react';
import {
    Users, Search, Plus, Eye, Edit, Trash2, CheckCircle,
    XCircle, Clock, Building, Mail, Phone, MapPin,
    DollarSign, Hotel, Calendar, FileText, CreditCard, Shield
} from 'lucide-react';

export default function VendorManagement({
    vendors,
    vendorSearchQuery,
    setVendorSearchQuery,
    vendorFilter,
    setVendorFilter,
    setSelectedVendor,
    setShowVendorDetailModal,
    setShowVendorModal,
    handleVendorStatusChange,
    handleVendorDelete
}) {

    // Filter vendors based on search and filter
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch =
            vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
            vendor.email.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
            vendor.contactPerson.toLowerCase().includes(vendorSearchQuery.toLowerCase());

        const matchesFilter =
            vendorFilter === 'all' || vendor.status === vendorFilter;

        return matchesSearch && matchesFilter;
    });

    // Calculate stats
    const stats = [
        {
            title: 'Total Vendor',
            value: vendors.length,
            icon: Users,
            gradient: 'from-purple-500 to-pink-600',
            color: 'purple'
        },
        {
            title: 'Vendor Aktif',
            value: vendors.filter(v => v.status === 'active').length,
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-600',
            color: 'green'
        },
        {
            title: 'Pending Verifikasi',
            value: vendors.filter(v => v.status === 'pending').length,
            icon: Clock,
            gradient: 'from-orange-500 to-amber-600',
            color: 'orange'
        },
        {
            title: 'Total Hotel',
            value: vendors.reduce((sum, v) => sum + v.totalHotels, 0),
            icon: Hotel,
            gradient: 'from-blue-500 to-indigo-600',
            color: 'blue'
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button
                    onClick={() => setShowVendorModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Tambah Vendor Baru
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari vendor, email, atau contact person..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
                            value={vendorSearchQuery}
                            onChange={(e) => setVendorSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-medium"
                        value={vendorFilter}
                        onChange={(e) => setVendorFilter(e.target.value)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVendors.map((vendor) => (
                    <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        onViewDetails={() => {
                            setSelectedVendor(vendor);
                            setShowVendorDetailModal(true);
                        }}
                        onStatusChange={handleVendorStatusChange}
                        onDelete={handleVendorDelete}
                    />
                ))}
            </div>

            {filteredVendors.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                    <Users size={64} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ada vendor ditemukan</h3>
                    <p className="text-slate-500">
                        {vendorSearchQuery ? `Tidak ada hasil untuk "${vendorSearchQuery}"` : 'Belum ada vendor terdaftar'}
                    </p>
                </div>
            )}
        </div>
    );
}

function VendorCard({ vendor, onViewDetails, onStatusChange, onDelete }) {
    const statusConfig = {
        active: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-200',
            label: 'Aktif',
            icon: CheckCircle
        },
        pending: {
            bg: 'bg-orange-100',
            text: 'text-orange-700',
            border: 'border-orange-200',
            label: 'Pending',
            icon: Clock
        },
        suspended: {
            bg: 'bg-red-100',
            text: 'text-red-700',
            border: 'border-red-200',
            label: 'Suspended',
            icon: XCircle
        }
    };

    const typeConfig = {
        official: { label: 'Official Partner', color: 'blue' },
        partner: { label: 'Verified Partner', color: 'green' },
        individual: { label: 'Individual', color: 'orange' }
    };

    const status = statusConfig[vendor.status];
    const type = typeConfig[vendor.type];
    const StatusIcon = status.icon;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {vendor.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{vendor.name}</h3>
                                <p className="text-sm text-slate-500">ID: {vendor.id}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border ${status.bg} ${status.text} ${status.border} flex items-center gap-1.5 text-xs font-bold`}>
                        <StatusIcon size={14} />
                        {status.label}
                    </div>
                </div>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold bg-${type.color}-100 text-${type.color}-700 border border-${type.color}-200`}>
                    {type.label}
                </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <span className="truncate">{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span className="truncate">{vendor.address}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{vendor.totalHotels}</p>
                        <p className="text-xs text-slate-500">Hotel</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{vendor.totalBookings}</p>
                        <p className="text-xs text-slate-500">Booking</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{vendor.commission}%</p>
                        <p className="text-xs text-slate-500">Komisi</p>
                    </div>
                </div>

                {/* Revenue */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 font-medium">Total Revenue</span>
                        <span className="text-lg font-bold text-green-600">
                            Rp {(vendor.totalRevenue / 1000000).toFixed(1)}Jt
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onViewDetails}
                        className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-200"
                    >
                        <Eye size={16} />
                        Detail
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(vendor.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

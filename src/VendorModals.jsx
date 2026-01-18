import React from 'react';
import {
    X, Building, Mail, Phone, MapPin, User, Calendar,
    CheckCircle, XCircle, FileText, CreditCard, DollarSign,
    Hotel, TrendingUp, Star
} from 'lucide-react';

export function VendorDetailModal({ vendor, onClose, onApprove, onReject, onSuspend }) {
    if (!vendor) return null;

    const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aktif' },
        pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending' },
        suspended: { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended' }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl my-8 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-4 border-white/30">
                            {vendor.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{vendor.name}</h2>
                            <p className="text-purple-100">ID: {vendor.id}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${statusConfig[vendor.status].bg} ${statusConfig[vendor.status].text}`}>
                                    {statusConfig[vendor.status].label}
                                </span>
                                {vendor.verificationStatus === 'verified' && (
                                    <span className="px-3 py-1 rounded-lg text-sm font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
                                        <CheckCircle size={14} />
                                        Terverifikasi
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-slate-50 rounded-xl p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <Building size={20} className="text-purple-600" />
                                    Informasi Kontak
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail size={18} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Email</p>
                                            <p className="text-sm text-slate-800">{vendor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={18} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Telepon</p>
                                            <p className="text-sm text-slate-800">{vendor.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Alamat</p>
                                            <p className="text-sm text-slate-800">{vendor.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <User size={18} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Contact Person</p>
                                            <p className="text-sm text-slate-800">{vendor.contactPerson}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar size={18} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Bergabung Sejak</p>
                                            <p className="text-sm text-slate-800">{new Date(vendor.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Information */}
                            <div className="bg-slate-50 rounded-xl p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <CreditCard size={20} className="text-purple-600" />
                                    Informasi Bank
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">Nama Bank</p>
                                        <p className="text-sm text-slate-800 font-bold">{vendor.bankInfo.bankName || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">Nomor Rekening</p>
                                        <p className="text-sm text-slate-800 font-mono">{vendor.bankInfo.accountNumber || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">Nama Pemegang</p>
                                        <p className="text-sm text-slate-800">{vendor.bankInfo.accountName || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Statistics */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-purple-600" />
                                    Statistik Performa
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <Hotel size={24} className="mx-auto mb-2 text-purple-600" />
                                        <p className="text-2xl font-bold text-slate-800">{vendor.totalHotels}</p>
                                        <p className="text-xs text-slate-500">Total Hotel</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <Calendar size={24} className="mx-auto mb-2 text-blue-600" />
                                        <p className="text-2xl font-bold text-slate-800">{vendor.totalBookings}</p>
                                        <p className="text-xs text-slate-500">Total Booking</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <DollarSign size={24} className="mx-auto mb-2 text-green-600" />
                                        <p className="text-xl font-bold text-slate-800">Rp {(vendor.totalRevenue / 1000000).toFixed(1)}Jt</p>
                                        <p className="text-xs text-slate-500">Total Revenue</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <Star size={24} className="mx-auto mb-2 text-orange-600" />
                                        <p className="text-2xl font-bold text-slate-800">{vendor.rating || 0}</p>
                                        <p className="text-xs text-slate-500">Rating</p>
                                    </div>
                                </div>
                                <div className="mt-4 bg-white rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 font-medium">Komisi</span>
                                        <span className="text-2xl font-bold text-purple-600">{vendor.commission}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-slate-50 rounded-xl p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-purple-600" />
                                    Dokumen Verifikasi
                                </h3>
                                <div className="space-y-2">
                                    <DocumentStatus label="Izin Usaha" status={vendor.documents.businessLicense} />
                                    <DocumentStatus label="NPWP" status={vendor.documents.taxId} />
                                    <DocumentStatus label="Rekening Bank" status={vendor.documents.bankAccount} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-slate-50 rounded-xl p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-3">Deskripsi</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{vendor.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
                    {vendor.status === 'pending' && (
                        <>
                            <button
                                onClick={() => onApprove(vendor.id)}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all"
                            >
                                <CheckCircle size={20} />
                                Setujui Vendor
                            </button>
                            <button
                                onClick={() => onReject(vendor.id)}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all"
                            >
                                <XCircle size={20} />
                                Tolak
                            </button>
                        </>
                    )}
                    {vendor.status === 'active' && (
                        <button
                            onClick={() => onSuspend(vendor.id)}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all"
                        >
                            <XCircle size={20} />
                            Suspend Vendor
                        </button>
                    )}
                    {vendor.status === 'suspended' && (
                        <button
                            onClick={() => onApprove(vendor.id)}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all"
                        >
                            <CheckCircle size={20} />
                            Aktifkan Kembali
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="py-3 px-6 border-2 border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

function DocumentStatus({ label, status }) {
    return (
        <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
            <span className="text-sm text-slate-700">{label}</span>
            {status ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-bold">
                    <CheckCircle size={16} />
                    Lengkap
                </span>
            ) : (
                <span className="flex items-center gap-1 text-red-600 text-sm font-bold">
                    <XCircle size={16} />
                    Belum
                </span>
            )}
        </div>
    );
}

export function AddVendorModal({ onClose, onSubmit }) {
    const [formData, setFormData] = React.useState({
        name: '',
        type: 'individual',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        commission: 10,
        bankName: '',
        accountNumber: '',
        accountName: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-8 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">Tambah Vendor Baru</h2>
                    <p className="text-purple-100">Daftarkan vendor atau mitra bisnis baru</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Vendor *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="PT Hospitality Indonesia"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Vendor *</label>
                            <select
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="individual">Individual</option>
                                <option value="partner">Partner</option>
                                <option value="official">Official Partner</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="vendor@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Telepon *</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="+62 xxx xxxx xxxx"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Alamat *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="Jl. Contoh No. 123, Jakarta"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Person *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="Nama PIC"
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Komisi (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="10"
                                value={formData.commission}
                                onChange={(e) => setFormData({ ...formData, commission: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="font-bold text-slate-800 mb-3">Informasi Bank</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Bank</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="Bank Mandiri"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nomor Rekening</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="1234567890"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Pemegang Rekening</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="Nama sesuai rekening"
                                value={formData.accountName}
                                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
                            <textarea
                                rows="3"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none resize-none"
                                placeholder="Deskripsi singkat tentang vendor..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all"
                        >
                            Tambah Vendor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

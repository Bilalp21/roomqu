import React from 'react';
import { MapPin, Star, CheckCircle, XCircle } from 'lucide-react';

export default function ApprovalTab({ pendingHotels, onApprove, onReject }) {
    if (pendingHotels.length === 0) {
        return (
            <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Semua Sudah Beres!</h3>
                <p className="text-slate-500">Tidak ada pengajuan hotel baru saat ini.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {pendingHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
                    <div className="w-full md:w-72 h-64 md:h-auto relative shrink-0">
                        <img
                            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                            PENDING APPROVAL
                        </div>
                        {/* Overlay gradient for text readability if needed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden"></div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{hotel.name}</h3>
                                    <p className="text-slate-500 text-sm flex items-center gap-1">
                                        <MapPin size={14} className="text-red-500" />
                                        {hotel.address}, {hotel.city}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 self-start">
                                    <Star size={16} className="text-orange-500" fill="currentColor" />
                                    <span className="font-bold text-sm text-slate-700">{hotel.rating || 0} Bintang</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi</h4>
                                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                    {hotel.description || 'Tidak ada deskripsi.'}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fasilitas Utama</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(hotel.facilities || []).length > 0 ? (
                                        <>
                                            {(hotel.facilities || []).slice(0, 5).map((fac, idx) => (
                                                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
                                                    {fac}
                                                </span>
                                            ))}
                                            {(hotel.facilities || []).length > 5 && (
                                                <span className="text-xs text-slate-500 px-2 py-1 flex items-center">
                                                    +{(hotel.facilities || []).length - 5} lainnya
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Belum ada fasilitas diinput</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-auto">
                            <button
                                onClick={() => onApprove(hotel.id)}
                                className="flex-1 py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200 hover:shadow-green-300 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <CheckCircle size={18} />
                                Setujui & Tayangkan
                            </button>
                            <button
                                onClick={() => onReject(hotel.id)}
                                className="sm:w-auto py-2.5 px-6 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <XCircle size={18} />
                                Tolak
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

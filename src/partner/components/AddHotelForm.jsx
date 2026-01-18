import React, { useState } from 'react';
import { ArrowLeft, Building, MapPin, Upload, CheckCircle, Save } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AddHotelForm({ currentUser, onCancel, onSuccess }) {
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
        status: 'pending'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Session expired. Please login again.");
            return;
        }

        setIsSubmitting(true);

        try {
            const hotelData = {
                ...newHotel,
                partnerId: currentUser.uid,
                status: 'pending',
                totalReviews: 0,
                rating: Number(newHotel.rating),
                facilities: (newHotel.facilities || []).filter(f => typeof f === 'string' && f.trim() !== ''),
                images: (newHotel.images || []).filter(img => typeof img === 'string' && img.trim() !== ''),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, "hotels"), hotelData);

            alert('Hotel berhasil ditambahkan dan menunggu persetujuan admin!');
            onSuccess();
        } catch (error) {
            console.error("Error adding hotel document: ", error);
            alert("Gagal menyimpan hotel: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Tambah Hotel Baru</h2>
                    <p className="text-slate-500 text-sm">Lengkapi data properti Anda sesuai SOP yang berlaku</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Building size={18} className="text-purple-600" />
                        Informasi Dasar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nama Properti / Hotel</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                placeholder="Contoh: Grand RoomQu Hotel"
                                value={newHotel.name}
                                onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Kategori Bintang</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                value={newHotel.rating}
                                onChange={e => setNewHotel({ ...newHotel, rating: Number(e.target.value) })}
                            >
                                <option value="1">1 Bintang</option>
                                <option value="2">2 Bintang</option>
                                <option value="3">3 Bintang</option>
                                <option value="4">4 Bintang</option>
                                <option value="5">5 Bintang</option>
                            </select>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Deskripsi Hotel</label>
                            <textarea
                                required
                                rows="3"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                placeholder="Jelaskan keunikan dan fasilitas utama hotel Anda..."
                                value={newHotel.description}
                                onChange={e => setNewHotel({ ...newHotel, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Section 2: Location */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <MapPin size={18} className="text-purple-600" />
                        Lokasi Properti
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Alamat Lengkap</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                placeholder="Jl. Contoh No. 123"
                                value={newHotel.address}
                                onChange={e => setNewHotel({ ...newHotel, address: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Kota / Kabupaten</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                    placeholder="Jakarta Pusat"
                                    value={newHotel.city}
                                    onChange={e => setNewHotel({ ...newHotel, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Provinsi</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                    placeholder="DKI Jakarta"
                                    value={newHotel.province}
                                    onChange={e => setNewHotel({ ...newHotel, province: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Images & Facilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Upload size={18} className="text-purple-600" />
                            Foto Properti
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">URL Gambar Utama</label>
                            <input
                                required
                                type="url"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                placeholder="https://example.com/image.jpg"
                                value={newHotel.images[0]}
                                onChange={e => {
                                    const newImages = [...newHotel.images];
                                    newImages[0] = e.target.value;
                                    setNewHotel({ ...newHotel, images: newImages });
                                }}
                            />
                            <p className="text-xs text-slate-400">Untuk demo, gunakan URL gambar langsung.</p>
                        </div>
                        {newHotel.images[0] && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                                <img src={newHotel.images[0]} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <CheckCircle size={18} className="text-purple-600" />
                            Fasilitas Unggulan
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Fasilitas (Pisahkan dengan koma)</label>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                                placeholder="WiFi, Kolam Renang, Parkir Gratis, Gym..."
                                value={newHotel.facilities.join(', ')}
                                onChange={e => setNewHotel({ ...newHotel, facilities: e.target.value.split(',').map(f => f.trim()) })}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Hotel'}
                    </button>
                </div>
            </form>
        </div>
    );
}

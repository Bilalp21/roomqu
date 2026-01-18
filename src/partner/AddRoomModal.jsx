import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

export default function AddRoomModal({ onClose, onSubmit, hotels }) {
    const [formData, setFormData] = useState({
        hotelId: '',
        name: '',
        price: '',
        description: '',
        capacity: 2,
        size: '',
        bedType: 'King Bed',
        quantity: 1,
        facilities: [],
        images: [],
        videos: [],
        status: 'active'
    });

    // Daftar fasilitas yang tersedia
    const availableFacilities = [
        'AC', 'TV', 'WiFi', 'Minibar', 'Safe Box',
        'Bathtub', 'Shower', 'Balcony', 'Living Room',
        'Kitchen', 'Microwave', 'Coffee Maker', 'Hair Dryer',
        'Iron', 'Telephone', 'Work Desk', 'Sofa', 'Wardrobe'
    ];

    // Pilihan tipe kasur
    const bedTypes = [
        'Single Bed',
        'Double Bed',
        'King Bed',
        'Queen Bed',
        'Twin Beds',
        'King Bed + Sofa Bed',
        'Bunk Bed'
    ];

    const handleFacilityToggle = (facility) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // In production, upload to server/cloud storage
        // For now, create temporary URLs
        const newImages = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            videos: [...prev.videos, ...newVideos]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const removeVideo = (index) => {
        setFormData(prev => ({
            ...prev,
            videos: prev.videos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.hotelId) {
            alert('Pilih hotel terlebih dahulu');
            return;
        }
        if (!formData.name || !formData.price) {
            alert('Nama kamar dan harga wajib diisi');
            return;
        }
        if (formData.images.length === 0) {
            alert('Upload minimal 1 gambar kamar');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl my-8 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">Tambah Kamar Baru</h2>
                    <p className="text-purple-100">Lengkapi informasi kamar Anda</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* Hotel Selection */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Pilih Hotel <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                            value={formData.hotelId}
                            onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                        >
                            <option value="">-- Pilih Hotel --</option>
                            {hotels.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nama Room & Harga */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Nama Kamar <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="Contoh: Deluxe Room, Suite Room"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Harga per Malam (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                placeholder="500000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Tentang Akomodasi */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Tentang Akomodasi / Deskripsi
                        </label>
                        <textarea
                            rows="4"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none resize-none"
                            placeholder="Deskripsikan kamar Anda, termasuk pemandangan, kenyamanan, dan keunikan yang ditawarkan..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    {/* Pilihan Kamar */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 text-lg">Pilihan Kamar</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Kasur</label>
                                <select
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                    value={formData.bedType}
                                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                                >
                                    {bedTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Kapasitas (Orang)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Luas Kamar (m²)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                    placeholder="35"
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Kamar Tersedia</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fasilitas */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            Fasilitas Kamar
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {availableFacilities.map(facility => (
                                <label
                                    key={facility}
                                    className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.facilities.includes(facility)
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-slate-200 bg-white hover:border-purple-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                        checked={formData.facilities.includes(facility)}
                                        onChange={() => handleFacilityToggle(facility)}
                                    />
                                    <span className="text-sm font-medium">{facility}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            {formData.facilities.length} fasilitas dipilih
                        </p>
                    </div>

                    {/* Upload Gambar */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            Gambar Kamar <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ImageIcon size={32} className="text-purple-600" />
                                </div>
                                <p className="font-bold text-slate-700 mb-1">Upload Gambar Kamar</p>
                                <p className="text-sm text-slate-500">Klik untuk memilih gambar (JPG, PNG)</p>
                                <p className="text-xs text-slate-400 mt-1">Maksimal 10 gambar</p>
                            </label>
                        </div>

                        {/* Image Preview */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-xl" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upload Video */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            Video Kamar (Opsional)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={handleVideoUpload}
                                className="hidden"
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <VideoIcon size={32} className="text-pink-600" />
                                </div>
                                <p className="font-bold text-slate-700 mb-1">Upload Video Kamar</p>
                                <p className="text-sm text-slate-500">Klik untuk memilih video (MP4, MOV)</p>
                                <p className="text-xs text-slate-400 mt-1">Maksimal 3 video</p>
                            </label>
                        </div>

                        {/* Video Preview */}
                        {formData.videos.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {formData.videos.map((video, idx) => (
                                    <div key={idx} className="relative group">
                                        <video src={video} className="w-full h-48 object-cover rounded-xl" controls />
                                        <button
                                            type="button"
                                            onClick={() => removeVideo(idx)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Status Kamar</label>
                        <select
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Aktif (Tersedia untuk Booking)</option>
                            <option value="inactive">Tidak Aktif (Tidak Tersedia)</option>
                        </select>
                    </div>

                    {/* Submit Buttons */}
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
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Tambah Kamar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

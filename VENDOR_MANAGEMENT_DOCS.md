# 📋 Dokumentasi Halaman Vendor & Mitra

## 🎯 Overview
Halaman Vendor & Mitra adalah sistem manajemen komprehensif untuk mengelola vendor, partner, dan mitra bisnis yang menyediakan properti hotel di platform.

---

## 📊 Skema Data Vendor

### **Struktur Data Vendor**
```javascript
{
    id: 'VND001',                    // Unique ID vendor
    name: 'PT Hospitality Indonesia', // Nama vendor/perusahaan
    type: 'official',                // Tipe: official, partner, individual
    email: 'contact@example.com',    // Email kontak
    phone: '+62 21 5555 1234',       // Nomor telepon
    address: 'Jl. Sudirman No. 123', // Alamat lengkap
    contactPerson: 'Budi Santoso',   // Nama PIC
    
    // Status Management
    status: 'active',                // active, pending, suspended, rejected
    verificationStatus: 'verified',  // verified, pending, unverified
    joinDate: '2023-05-15',         // Tanggal bergabung
    
    // Business Metrics
    totalHotels: 12,                 // Jumlah hotel yang dimiliki
    totalBookings: 450,              // Total booking yang terjadi
    totalRevenue: 125000000,         // Total revenue (Rupiah)
    commission: 15,                  // Persentase komisi (%)
    rating: 4.8,                     // Rating vendor (0-5)
    
    // Documents Verification
    documents: {
        businessLicense: true,       // Izin usaha
        taxId: true,                 // NPWP
        bankAccount: true            // Rekening bank
    },
    
    // Banking Information
    bankInfo: {
        bankName: 'Bank Mandiri',
        accountNumber: '1234567890',
        accountName: 'PT Hospitality Indonesia'
    },
    
    description: 'Deskripsi vendor...'
}
```

---

## 🎨 Fitur Utama

### **1. Dashboard Statistik Vendor**
- **Total Vendor**: Jumlah semua vendor terdaftar
- **Vendor Aktif**: Vendor yang sudah terverifikasi dan aktif
- **Pending Verifikasi**: Vendor menunggu approval
- **Total Hotel**: Agregat semua hotel dari vendor

### **2. Manajemen Vendor**

#### **A. Daftar Vendor (Vendor Cards)**
Setiap vendor ditampilkan dalam card yang menunjukkan:
- **Header**: Avatar, nama, ID, status (Active/Pending/Suspended)
- **Badge Tipe**: Official Partner, Verified Partner, atau Individual
- **Informasi Kontak**: Email, telepon, alamat
- **Statistik**: Total hotel, booking, komisi
- **Revenue**: Total pendapatan yang dihasilkan
- **Actions**: Detail, Edit, Delete

#### **B. Search & Filter**
- **Search**: Cari berdasarkan nama vendor, email, atau contact person
- **Filter Status**: 
  - Semua Status
  - Aktif
  - Pending
  - Suspended

### **3. Detail Vendor Modal**

Modal detail menampilkan informasi lengkap:

#### **Informasi Kontak**
- Email
- Telepon
- Alamat lengkap
- Contact Person
- Tanggal bergabung

#### **Informasi Bank**
- Nama bank
- Nomor rekening
- Nama pemegang rekening

#### **Statistik Performa**
- Total Hotel
- Total Booking
- Total Revenue
- Rating

#### **Dokumen Verifikasi**
- ✅ Izin Usaha (Business License)
- ✅ NPWP (Tax ID)
- ✅ Rekening Bank

#### **Actions dalam Detail Modal**
Berdasarkan status vendor:

**Jika Pending:**
- ✅ **Setujui Vendor** → Ubah status menjadi Active
- ❌ **Tolak** → Hapus vendor dari sistem

**Jika Active:**
- ⏸️ **Suspend Vendor** → Ubah status menjadi Suspended

**Jika Suspended:**
- ✅ **Aktifkan Kembali** → Ubah status menjadi Active

### **4. Tambah Vendor Baru**

Form lengkap untuk mendaftarkan vendor baru:

#### **Informasi Dasar**
- Nama Vendor (required)
- Tipe Vendor (Individual/Partner/Official)
- Email (required)
- Telepon (required)
- Alamat (required)
- Contact Person (required)
- Komisi (%) - default 10%

#### **Informasi Bank**
- Nama Bank
- Nomor Rekening
- Nama Pemegang Rekening

#### **Deskripsi**
- Deskripsi singkat tentang vendor

**Proses Setelah Submit:**
- Vendor baru dibuat dengan status "Pending"
- Verification status "Pending"
- Total hotel, booking, revenue = 0
- Menunggu approval dari admin

---

## 🔄 Workflow Manajemen Vendor

### **1. Registrasi Vendor Baru**
```
Admin mengisi form → Submit → 
Vendor dibuat (status: Pending) → 
Menunggu verifikasi dokumen
```

### **2. Verifikasi Vendor**
```
Admin review detail vendor → 
Cek dokumen (Izin Usaha, NPWP, Bank) → 
Approve/Reject
```

**Jika Approve:**
- Status: Pending → Active
- Vendor dapat menambahkan hotel
- Mulai menerima booking

**Jika Reject:**
- Vendor dihapus dari sistem
- Notifikasi ke vendor (future feature)

### **3. Monitoring Vendor Aktif**
```
Vendor aktif → 
Tambah hotel → 
Terima booking → 
Generate revenue → 
Admin monitor performa
```

### **4. Suspend Vendor**
```
Vendor melanggar kebijakan → 
Admin suspend → 
Status: Active → Suspended → 
Hotel tidak bisa dibooking → 
Vendor tidak bisa tambah hotel
```

### **5. Reaktivasi Vendor**
```
Masalah resolved → 
Admin aktifkan kembali → 
Status: Suspended → Active → 
Vendor kembali operasional
```

---

## 🎯 Fungsi-Fungsi Utama

### **Handler Functions**

#### **1. handleVendorStatusChange(vendorId, newStatus)**
Mengubah status vendor
```javascript
// Parameter:
// - vendorId: ID vendor yang akan diubah
// - newStatus: 'active' | 'pending' | 'suspended'

// Contoh:
handleVendorStatusChange('VND001', 'active')
```

#### **2. handleVendorApprove(vendorId)**
Menyetujui vendor pending
```javascript
// Mengubah status dari 'pending' → 'active'
// Menutup modal detail
// Menampilkan notifikasi sukses
```

#### **3. handleVendorReject(vendorId)**
Menolak vendor pending
```javascript
// Menghapus vendor dari sistem
// Menutup modal detail
// Menampilkan notifikasi
```

#### **4. handleVendorSuspend(vendorId)**
Suspend vendor aktif
```javascript
// Mengubah status dari 'active' → 'suspended'
// Menutup modal detail
// Menampilkan notifikasi
```

#### **5. handleVendorDelete(vendorId)**
Menghapus vendor permanen
```javascript
// Konfirmasi dari admin
// Hapus vendor dari database
// Update UI
```

#### **6. handleAddVendor(formData)**
Menambahkan vendor baru
```javascript
// Generate ID baru (VND###)
// Set status default: 'pending'
// Set verification: 'pending'
// Initialize metrics (0)
// Tambah ke database
```

---

## 📈 Metrics & Analytics

### **Vendor Performance Metrics**
- **Total Hotels**: Jumlah properti yang dimiliki
- **Total Bookings**: Jumlah pemesanan yang terjadi
- **Total Revenue**: Pendapatan yang dihasilkan
- **Commission Rate**: Persentase komisi yang dikenakan
- **Rating**: Rating vendor (dari review customer)

### **System-wide Metrics**
- Total vendor terdaftar
- Vendor aktif vs pending vs suspended
- Total revenue dari semua vendor
- Average commission rate
- Total hotel dari semua vendor
- Total booking dari semua vendor

---

## 🔐 Status & Verification

### **Status Vendor**
| Status | Deskripsi | Actions Available |
|--------|-----------|-------------------|
| **Pending** | Menunggu verifikasi admin | Approve, Reject |
| **Active** | Vendor terverifikasi dan operasional | Suspend, Edit, Delete |
| **Suspended** | Vendor di-suspend karena pelanggaran | Activate, Delete |
| **Rejected** | Vendor ditolak (dihapus dari sistem) | - |

### **Verification Status**
| Status | Deskripsi |
|--------|-----------|
| **Verified** | Dokumen lengkap dan terverifikasi |
| **Pending** | Menunggu verifikasi dokumen |
| **Unverified** | Dokumen belum lengkap |

### **Vendor Types**
| Type | Deskripsi | Commission Range |
|------|-----------|------------------|
| **Official Partner** | Partner resmi dengan kontrak | 15-20% |
| **Verified Partner** | Partner terverifikasi | 10-15% |
| **Individual** | Pemilik individu | 8-12% |

---

## 🎨 UI Components

### **1. VendorManagement.jsx**
Component utama untuk halaman vendor
- Stats cards
- Search & filter
- Vendor grid/cards
- Empty state

### **2. VendorModals.jsx**
Modal components:
- **VendorDetailModal**: Detail lengkap vendor
- **AddVendorModal**: Form tambah vendor baru

### **3. vendorData.js**
Mock data untuk development:
- VENDORS array
- VENDOR_STATS object

---

## 🚀 Future Enhancements

### **Planned Features**
1. **Email Notifications**: Notifikasi otomatis ke vendor
2. **Document Upload**: Upload dokumen verifikasi
3. **Commission Calculator**: Kalkulator komisi otomatis
4. **Performance Reports**: Laporan performa vendor
5. **Vendor Dashboard**: Dashboard khusus untuk vendor
6. **Contract Management**: Manajemen kontrak vendor
7. **Payment Integration**: Integrasi pembayaran komisi
8. **Review System**: Sistem review untuk vendor
9. **Analytics Dashboard**: Analytics mendalam
10. **Export Data**: Export data vendor ke Excel/PDF

---

## 📝 Best Practices

### **Untuk Admin**
1. Selalu verifikasi dokumen sebelum approve
2. Monitor performa vendor secara berkala
3. Suspend vendor yang melanggar kebijakan
4. Update commission rate sesuai performa
5. Komunikasi rutin dengan vendor

### **Untuk Developer**
1. Validasi input form dengan ketat
2. Handle error dengan graceful
3. Implement loading states
4. Add confirmation dialogs untuk actions penting
5. Optimize performance untuk large datasets
6. Implement pagination untuk scalability

---

## 🔧 Technical Stack

- **React**: UI framework
- **Lucide Icons**: Icon library
- **Tailwind CSS**: Styling
- **Firebase**: Backend (future)
- **State Management**: React useState

---

## 📞 Support

Untuk pertanyaan atau issue terkait vendor management:
- Email: admin@roomqu.id
- Dokumentasi: /docs/vendor-management
- Support: /admin/support

---

**Last Updated**: 18 Januari 2026
**Version**: 1.0.0
**Author**: Admin Panel Team

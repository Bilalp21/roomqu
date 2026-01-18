# 🏗️ Arsitektur Sistem 3-Role: User, Partner, Admin

## 📋 Overview
Sistem ini memiliki 3 role berbeda dengan dashboard dan fitur yang terpisah:
- **User**: Customer yang memesan hotel
- **Partner**: Pemilik hotel/properti yang mengelola listing mereka
- **Admin**: Administrator platform yang mengelola seluruh sistem

---

## 🎭 Role Structure

### **1. USER (Customer)**
**Email Pattern**: `user@...` atau email biasa  
**Dashboard**: `/profile` atau `/user/dashboard`

**Fitur:**
- ✅ Browse & search hotel
- ✅ Booking hotel
- ✅ Lihat riwayat booking
- ✅ Manage profil
- ✅ Review & rating hotel
- ✅ Wishlist/Favorit
- ✅ Notifikasi booking

**Pages:**
- `/` - Home (browse hotels)
- `/login` - User login
- `/profile` - User profile & booking history
- `/hotel/:id` - Hotel detail & booking
- `/booking/:id` - Booking detail

---

### **2. PARTNER (Hotel Owner/Vendor)**
**Email Pattern**: `partner@...`  
**Dashboard**: `/partner/dashboard`

**Fitur:**
- ✅ Manage hotel/properti
- ✅ Tambah/edit/hapus room
- ✅ Upload foto & video
- ✅ Set harga & availability
- ✅ Manage promo & voucher
- ✅ Lihat booking masuk
- ✅ Analytics & revenue
- ✅ Profil partner
- ✅ Manage fasilitas

**Pages:**
- `/partner/login` - Partner login
- `/partner/dashboard` - Dashboard overview
- `/partner/hotels` - Daftar hotel
- `/partner/hotels/add` - Tambah hotel baru
- `/partner/hotels/:id/edit` - Edit hotel
- `/partner/hotels/:id/rooms` - Manage rooms
- `/partner/hotels/:id/rooms/add` - Tambah room
- `/partner/promos` - Manage promo & voucher
- `/partner/bookings` - Daftar booking
- `/partner/analytics` - Analytics & reports
- `/partner/profile` - Profil partner

---

### **3. ADMIN (Platform Administrator)**
**Email Pattern**: `admin@...`  
**Dashboard**: `/admin`

**Fitur:**
- ✅ Manage semua user
- ✅ Manage vendor/partner
- ✅ Approve/reject hotel baru
- ✅ Manage semua booking
- ✅ Platform analytics
- ✅ Manage promo platform
- ✅ Settings platform
- ✅ Financial reports

**Pages:**
- `/admin/login` - Admin login
- `/admin` - Dashboard overview
- `/admin/hotels` - Manage semua hotel
- `/admin/vendors` - Manage vendor/partner
- `/admin/users` - Manage users
- `/admin/bookings` - Semua booking
- `/admin/analytics` - Platform analytics
- `/admin/settings` - Platform settings
- `/admin/profile` - Admin profile

---

## 🗂️ Data Schema

### **User Schema**
```javascript
{
    uid: 'user123',
    email: 'customer@example.com',
    displayName: 'John Doe',
    role: 'user',
    phone: '+62 812 3456 7890',
    avatar: 'url',
    createdAt: '2024-01-01',
    bookings: ['booking1', 'booking2'],
    wishlist: ['hotel1', 'hotel2'],
    reviews: ['review1', 'review2']
}
```

### **Partner Schema**
```javascript
{
    uid: 'partner123',
    email: 'partner@example.com',
    displayName: 'PT Hotel Indonesia',
    role: 'partner',
    phone: '+62 21 1234 5678',
    address: 'Jl. Sudirman No. 123',
    businessType: 'official' | 'partner' | 'individual',
    verificationStatus: 'verified' | 'pending' | 'rejected',
    bankInfo: {
        bankName: 'Bank Mandiri',
        accountNumber: '1234567890',
        accountName: 'PT Hotel Indonesia'
    },
    commission: 15, // percentage
    hotels: ['hotel1', 'hotel2'],
    totalRevenue: 125000000,
    rating: 4.8,
    createdAt: '2024-01-01'
}
```

### **Hotel Schema**
```javascript
{
    id: 'hotel123',
    partnerId: 'partner123',
    name: 'Grand Luxury Hotel',
    description: 'Hotel mewah di pusat kota...',
    address: 'Jl. Thamrin No. 45, Jakarta',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    coordinates: {
        lat: -6.2088,
        lng: 106.8456
    },
    images: ['url1', 'url2', 'url3'],
    videos: ['url1'],
    facilities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
    rating: 4.5,
    totalReviews: 120,
    status: 'active' | 'pending' | 'suspended',
    rooms: ['room1', 'room2'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
}
```

### **Room Schema**
```javascript
{
    id: 'room123',
    hotelId: 'hotel123',
    name: 'Deluxe Room',
    description: 'Kamar deluxe dengan pemandangan kota',
    price: 500000, // per night
    capacity: 2, // persons
    size: 35, // sqm
    bedType: 'King Bed',
    images: ['url1', 'url2'],
    facilities: ['AC', 'TV', 'WiFi', 'Minibar'],
    availability: {
        '2024-01-20': 5, // 5 rooms available
        '2024-01-21': 3,
        '2024-01-22': 0 // fully booked
    },
    status: 'active' | 'inactive',
    createdAt: '2024-01-01'
}
```

### **Promo/Voucher Schema**
```javascript
{
    id: 'promo123',
    partnerId: 'partner123', // null if platform promo
    code: 'NEWYEAR2024',
    name: 'Promo Tahun Baru',
    description: 'Diskon 20% untuk booking di Januari',
    type: 'percentage' | 'fixed',
    value: 20, // 20% or Rp 20000
    minTransaction: 500000,
    maxDiscount: 100000,
    validFrom: '2024-01-01',
    validUntil: '2024-01-31',
    usageLimit: 100,
    usageCount: 45,
    applicableHotels: ['hotel1', 'hotel2'], // empty = all hotels
    status: 'active' | 'inactive',
    createdAt: '2024-01-01'
}
```

### **Booking Schema**
```javascript
{
    id: 'booking123',
    userId: 'user123',
    hotelId: 'hotel123',
    roomId: 'room123',
    partnerId: 'partner123',
    checkIn: '2024-01-20',
    checkOut: '2024-01-22',
    nights: 2,
    guests: 2,
    roomCount: 1,
    pricePerNight: 500000,
    totalPrice: 1000000,
    promoCode: 'NEWYEAR2024',
    discount: 200000,
    finalPrice: 800000,
    commission: 120000, // 15% of finalPrice
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
    paymentStatus: 'pending' | 'paid' | 'refunded',
    paymentMethod: 'transfer' | 'ewallet' | 'credit_card',
    guestInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+62 812 3456 7890'
    },
    specialRequests: 'Late check-in',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
}
```

---

## 🎯 Partner Dashboard Features

### **1. Dashboard Overview**
**Stats Cards:**
- Total Hotel
- Total Rooms
- Total Bookings (bulan ini)
- Total Revenue (bulan ini)
- Occupancy Rate
- Average Rating

**Charts:**
- Revenue trend (line chart)
- Booking trend (bar chart)
- Room occupancy (pie chart)

**Recent Activity:**
- Latest bookings
- Pending approvals
- Low stock rooms

---

### **2. Manage Hotels**

**List Hotels:**
- Grid/List view
- Search & filter
- Status indicator
- Quick actions (Edit, View, Delete)

**Add/Edit Hotel:**
- Basic info (nama, deskripsi, alamat)
- Location (city, province, coordinates)
- Upload images (multiple)
- Upload videos
- Facilities checklist
- Status (active/inactive)

---

### **3. Manage Rooms**

**Form Tambah Room:**
```
✅ Nama Room (required)
✅ Harga per Malam (required)
✅ Tentang Akomodasi (description)
✅ Fasilitas (checklist)
   - AC
   - TV
   - WiFi
   - Minibar
   - Bathtub
   - Balcony
   - etc.
✅ Gambar/Video (multiple upload)
✅ Pilihan Kamar:
   - Bed Type (Single/Double/King/Twin)
   - Capacity (persons)
   - Size (sqm)
   - Quantity (jumlah kamar tersedia)
✅ Availability Calendar
✅ Status (Active/Inactive)
```

**Room Management:**
- List all rooms
- Edit room details
- Update availability
- Set dynamic pricing
- Bulk actions

---

### **4. Manage Promo & Voucher**

**Add Promo:**
- Promo code
- Nama promo
- Deskripsi
- Type (percentage/fixed)
- Value
- Min transaction
- Max discount
- Valid period
- Usage limit
- Applicable hotels/rooms
- Status

**Promo List:**
- Active promos
- Expired promos
- Usage statistics
- Edit/Delete actions

---

### **5. Bookings Management**

**Booking List:**
- Filter by status (pending/confirmed/cancelled/completed)
- Filter by date range
- Search by booking ID or guest name
- Export to Excel

**Booking Detail:**
- Guest information
- Room details
- Payment information
- Special requests
- Actions (Confirm, Cancel, Refund)

---

### **6. Analytics & Reports**

**Revenue Analytics:**
- Daily/Weekly/Monthly revenue
- Revenue by hotel
- Revenue by room type
- Commission breakdown

**Booking Analytics:**
- Booking trends
- Cancellation rate
- Average booking value
- Peak seasons

**Performance Metrics:**
- Occupancy rate
- Average daily rate (ADR)
- Revenue per available room (RevPAR)
- Customer satisfaction score

---

### **7. Partner Profile**

**Business Information:**
- Company name
- Business type
- Contact details
- Address
- Tax ID (NPWP)
- Business license

**Bank Information:**
- Bank name
- Account number
- Account holder name

**Verification Status:**
- Document verification
- Email verification
- Phone verification

**Settings:**
- Notification preferences
- Payment settings
- Commission rate (view only)

---

## 🔐 Route Protection

### **Protected Routes**
```javascript
// User Routes
<Route path="/profile" element={<UserRoute><UserProfile /></UserRoute>} />

// Partner Routes
<Route path="/partner/*" element={<PartnerRoute><PartnerDashboard /></PartnerRoute>} />

// Admin Routes
<Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
```

### **Route Guards**
```javascript
// UserRoute: Only for role='user'
// PartnerRoute: Only for role='partner'
// AdminRoute: Only for role='admin'
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── user/
│   │   ├── HotelCard.jsx
│   │   ├── BookingCard.jsx
│   │   └── ReviewForm.jsx
│   ├── partner/
│   │   ├── HotelForm.jsx
│   │   ├── RoomForm.jsx
│   │   ├── PromoForm.jsx
│   │   └── BookingList.jsx
│   └── admin/
│       ├── VendorManagement.jsx
│       ├── UserManagement.jsx
│       └── PlatformSettings.jsx
├── pages/
│   ├── user/
│   │   ├── Home.jsx
│   │   ├── HotelDetail.jsx
│   │   └── UserProfile.jsx
│   ├── partner/
│   │   ├── PartnerLogin.jsx
│   │   ├── PartnerDashboard.jsx
│   │   ├── ManageHotels.jsx
│   │   ├── ManageRooms.jsx
│   │   ├── ManagePromos.jsx
│   │   └── PartnerProfile.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminPanel.jsx
│       └── VendorManagement.jsx
├── context/
│   ├── AuthContext.jsx (3 roles)
│   └── SiteContext.jsx
├── data/
│   ├── hotels.js
│   ├── rooms.js
│   ├── promos.js
│   └── vendors.js
└── App.jsx (routing)
```

---

## 🚀 Implementation Plan

### **Phase 1: Authentication & Routing** ✅
- [x] Update AuthContext for 3 roles
- [x] Create PartnerLogin page
- [ ] Create route protection
- [ ] Update App.jsx routing

### **Phase 2: Partner Dashboard**
- [ ] Dashboard overview
- [ ] Stats cards & charts
- [ ] Recent activity

### **Phase 3: Hotel Management**
- [ ] List hotels
- [ ] Add hotel form
- [ ] Edit hotel
- [ ] Upload images/videos

### **Phase 4: Room Management**
- [ ] List rooms
- [ ] Add room form (with all fields)
- [ ] Edit room
- [ ] Availability calendar
- [ ] Dynamic pricing

### **Phase 5: Promo Management**
- [ ] List promos
- [ ] Add promo form
- [ ] Edit promo
- [ ] Usage tracking

### **Phase 6: Booking Management**
- [ ] List bookings
- [ ] Booking detail
- [ ] Confirm/Cancel booking
- [ ] Export reports

### **Phase 7: Analytics**
- [ ] Revenue charts
- [ ] Booking analytics
- [ ] Performance metrics

### **Phase 8: Partner Profile**
- [ ] Business info
- [ ] Bank info
- [ ] Verification
- [ ] Settings

---

## 📝 Next Steps

1. **Create Route Protection Components**
2. **Build Partner Dashboard Layout**
3. **Implement Hotel Management**
4. **Implement Room Management with Full Form**
5. **Add Promo/Voucher System**
6. **Build Analytics Dashboard**

---

**Last Updated**: 18 Januari 2026  
**Status**: Phase 1 In Progress  
**Version**: 2.0.0

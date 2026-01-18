// Mock data for partner hotels
export const PARTNER_HOTELS = [
    {
        id: 'HTL001',
        partnerId: 'partner123',
        name: 'Grand Luxury Hotel',
        description: 'Hotel mewah di pusat kota Jakarta dengan fasilitas lengkap dan pemandangan kota yang menakjubkan.',
        address: 'Jl. Thamrin No. 45, Jakarta Pusat',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        coordinates: { lat: -6.2088, lng: 106.8456 },
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
        ],
        videos: [],
        facilities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking', '24h Service'],
        rating: 4.8,
        totalReviews: 245,
        totalRooms: 12,
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-18'
    },
    {
        id: 'HTL002',
        partnerId: 'partner123',
        name: 'Bali Beach Resort',
        description: 'Resort tepi pantai dengan pemandangan sunset yang indah dan fasilitas premium.',
        address: 'Jl. Sunset Road No. 88, Seminyak, Bali',
        city: 'Badung',
        province: 'Bali',
        coordinates: { lat: -8.6705, lng: 115.1614 },
        images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
        ],
        videos: [],
        facilities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa'],
        rating: 4.9,
        totalReviews: 189,
        totalRooms: 8,
        status: 'active',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-10'
    },
    {
        id: 'HTL003',
        partnerId: 'partner123',
        name: 'Yogyakarta Heritage Inn',
        description: 'Hotel heritage dengan sentuhan tradisional Jawa di pusat kota Yogyakarta.',
        address: 'Jl. Malioboro No. 234, Yogyakarta',
        city: 'Yogyakarta',
        province: 'DIY Yogyakarta',
        coordinates: { lat: -7.7956, lng: 110.3695 },
        images: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
        ],
        videos: [],
        facilities: ['WiFi', 'Restaurant', 'Parking', 'Traditional Spa'],
        rating: 4.6,
        totalReviews: 98,
        totalRooms: 5,
        status: 'pending',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
    }
];

// Mock data for rooms
export const PARTNER_ROOMS = [
    {
        id: 'ROOM001',
        hotelId: 'HTL001',
        name: 'Deluxe Room',
        description: 'Kamar deluxe dengan pemandangan kota, dilengkapi dengan fasilitas modern dan tempat tidur king size yang nyaman.',
        price: 850000,
        capacity: 2,
        size: 35,
        bedType: 'King Bed',
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
        ],
        videos: [],
        facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Safe Box', 'Bathtub', 'Balcony'],
        quantity: 5,
        availability: {
            '2024-01-20': 3,
            '2024-01-21': 2,
            '2024-01-22': 0,
            '2024-01-23': 5
        },
        status: 'active',
        createdAt: '2024-01-15'
    },
    {
        id: 'ROOM002',
        hotelId: 'HTL001',
        name: 'Suite Room',
        description: 'Suite room mewah dengan ruang tamu terpisah, cocok untuk keluarga atau business traveler.',
        price: 1500000,
        capacity: 4,
        size: 60,
        bedType: 'King Bed + Sofa Bed',
        images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
        ],
        videos: [],
        facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Safe Box', 'Bathtub', 'Balcony', 'Living Room', 'Kitchen'],
        quantity: 3,
        availability: {
            '2024-01-20': 2,
            '2024-01-21': 1,
            '2024-01-22': 3
        },
        status: 'active',
        createdAt: '2024-01-15'
    },
    {
        id: 'ROOM003',
        hotelId: 'HTL001',
        name: 'Standard Room',
        description: 'Kamar standard dengan fasilitas lengkap dan harga terjangkau.',
        price: 500000,
        capacity: 2,
        size: 25,
        bedType: 'Double Bed',
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        videos: [],
        facilities: ['AC', 'TV', 'WiFi', 'Shower'],
        quantity: 10,
        availability: {
            '2024-01-20': 8,
            '2024-01-21': 6,
            '2024-01-22': 10
        },
        status: 'active',
        createdAt: '2024-01-15'
    }
];

// Mock data for promos
export const PARTNER_PROMOS = [
    {
        id: 'PROMO001',
        partnerId: 'partner123',
        code: 'NEWYEAR2024',
        name: 'Promo Tahun Baru',
        description: 'Diskon 20% untuk semua booking di bulan Januari 2024',
        type: 'percentage',
        value: 20,
        minTransaction: 500000,
        maxDiscount: 200000,
        validFrom: '2024-01-01',
        validUntil: '2024-01-31',
        usageLimit: 100,
        usageCount: 45,
        applicableHotels: ['HTL001', 'HTL002'],
        status: 'active',
        createdAt: '2023-12-20'
    },
    {
        id: 'PROMO002',
        partnerId: 'partner123',
        code: 'WEEKEND50',
        name: 'Weekend Special',
        description: 'Diskon Rp 50.000 untuk booking weekend',
        type: 'fixed',
        value: 50000,
        minTransaction: 300000,
        maxDiscount: 50000,
        validFrom: '2024-01-01',
        validUntil: '2024-03-31',
        usageLimit: 200,
        usageCount: 89,
        applicableHotels: [],
        status: 'active',
        createdAt: '2024-01-05'
    },
    {
        id: 'PROMO003',
        partnerId: 'partner123',
        code: 'EARLYBIRD',
        name: 'Early Bird Discount',
        description: 'Diskon 15% untuk booking 30 hari sebelumnya',
        type: 'percentage',
        value: 15,
        minTransaction: 1000000,
        maxDiscount: 300000,
        validFrom: '2024-02-01',
        validUntil: '2024-12-31',
        usageLimit: 50,
        usageCount: 12,
        applicableHotels: ['HTL001'],
        status: 'active',
        createdAt: '2024-01-10'
    }
];

// Mock data for bookings
export const PARTNER_BOOKINGS = [
    {
        id: 'BKG001',
        userId: 'user123',
        hotelId: 'HTL001',
        roomId: 'ROOM001',
        partnerId: 'partner123',
        checkIn: '2024-01-25',
        checkOut: '2024-01-27',
        nights: 2,
        guests: 2,
        roomCount: 1,
        pricePerNight: 850000,
        totalPrice: 1700000,
        promoCode: 'NEWYEAR2024',
        discount: 340000,
        finalPrice: 1360000,
        commission: 204000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'transfer',
        guestInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+62 812 3456 7890'
        },
        specialRequests: 'Late check-in around 10 PM',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18'
    },
    {
        id: 'BKG002',
        userId: 'user456',
        hotelId: 'HTL002',
        roomId: 'ROOM002',
        partnerId: 'partner123',
        checkIn: '2024-02-01',
        checkOut: '2024-02-05',
        nights: 4,
        guests: 3,
        roomCount: 1,
        pricePerNight: 1500000,
        totalPrice: 6000000,
        promoCode: null,
        discount: 0,
        finalPrice: 6000000,
        commission: 900000,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: null,
        guestInfo: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+62 821 9876 5432'
        },
        specialRequests: 'Need baby cot',
        createdAt: '2024-01-17',
        updatedAt: '2024-01-17'
    },
    {
        id: 'BKG003',
        userId: 'user789',
        hotelId: 'HTL001',
        roomId: 'ROOM003',
        partnerId: 'partner123',
        checkIn: '2024-01-20',
        checkOut: '2024-01-22',
        nights: 2,
        guests: 2,
        roomCount: 2,
        pricePerNight: 500000,
        totalPrice: 2000000,
        promoCode: 'WEEKEND50',
        discount: 50000,
        finalPrice: 1950000,
        commission: 292500,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        guestInfo: {
            name: 'Ahmad Fauzi',
            email: 'ahmad@example.com',
            phone: '+62 813 1234 5678'
        },
        specialRequests: null,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-22'
    }
];

// Partner statistics
export const PARTNER_STATS = {
    totalHotels: 3,
    totalRooms: 25,
    totalBookings: 45,
    monthlyBookings: 12,
    totalRevenue: 125000000,
    monthlyRevenue: 15500000,
    occupancyRate: 68,
    averageRating: 4.7,
    activePromos: 3,
    pendingBookings: 5
};

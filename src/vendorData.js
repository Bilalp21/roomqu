// Mock Vendor Data
export const VENDORS = [
    {
        id: 'VND001',
        name: 'PT Hospitality Indonesia',
        type: 'official', // official, partner, individual
        email: 'contact@hospitalityid.com',
        phone: '+62 21 5555 1234',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        contactPerson: 'Budi Santoso',
        status: 'active', // active, pending, suspended, rejected
        verificationStatus: 'verified', // verified, pending, unverified
        joinDate: '2023-05-15',
        totalHotels: 12,
        totalBookings: 450,
        totalRevenue: 125000000,
        commission: 15, // percentage
        rating: 4.8,
        documents: {
            businessLicense: true,
            taxId: true,
            bankAccount: true
        },
        bankInfo: {
            bankName: 'Bank Mandiri',
            accountNumber: '1234567890',
            accountName: 'PT Hospitality Indonesia'
        },
        description: 'Perusahaan properti terkemuka dengan 12 hotel di berbagai kota besar Indonesia.'
    },
    {
        id: 'VND002',
        name: 'Luxury Stay Group',
        type: 'partner',
        email: 'info@luxurystay.co.id',
        phone: '+62 21 5555 5678',
        address: 'Jl. Thamrin No. 45, Jakarta Pusat',
        contactPerson: 'Sarah Wijaya',
        status: 'active',
        verificationStatus: 'verified',
        joinDate: '2023-08-20',
        totalHotels: 8,
        totalBookings: 320,
        totalRevenue: 95000000,
        commission: 12,
        rating: 4.6,
        documents: {
            businessLicense: true,
            taxId: true,
            bankAccount: true
        },
        bankInfo: {
            bankName: 'BCA',
            accountNumber: '9876543210',
            accountName: 'Luxury Stay Group'
        },
        description: 'Grup hotel luxury dengan fokus pada pengalaman premium untuk tamu.'
    },
    {
        id: 'VND003',
        name: 'Bali Paradise Hotels',
        type: 'partner',
        email: 'admin@baliparadise.com',
        phone: '+62 361 123 456',
        address: 'Jl. Sunset Road No. 88, Seminyak, Bali',
        contactPerson: 'Made Suardana',
        status: 'active',
        verificationStatus: 'verified',
        joinDate: '2023-06-10',
        totalHotels: 5,
        totalBookings: 280,
        totalRevenue: 78000000,
        commission: 10,
        rating: 4.7,
        documents: {
            businessLicense: true,
            taxId: true,
            bankAccount: true
        },
        bankInfo: {
            bankName: 'BNI',
            accountNumber: '5555666677',
            accountName: 'Bali Paradise Hotels'
        },
        description: 'Spesialis hotel dan resort di Bali dengan pemandangan pantai yang menakjubkan.'
    },
    {
        id: 'VND004',
        name: 'Ahmad Property',
        type: 'individual',
        email: 'ahmad.property@gmail.com',
        phone: '+62 812 3456 7890',
        address: 'Jl. Malioboro No. 234, Yogyakarta',
        contactPerson: 'Ahmad Fauzi',
        status: 'active',
        verificationStatus: 'verified',
        joinDate: '2024-01-05',
        totalHotels: 3,
        totalBookings: 120,
        totalRevenue: 35000000,
        commission: 8,
        rating: 4.5,
        documents: {
            businessLicense: false,
            taxId: true,
            bankAccount: true
        },
        bankInfo: {
            bankName: 'BRI',
            accountNumber: '1111222233',
            accountName: 'Ahmad Fauzi'
        },
        description: 'Pemilik individu dengan 3 properti strategis di area wisata Yogyakarta.'
    },
    {
        id: 'VND005',
        name: 'Surabaya Inn Network',
        type: 'partner',
        email: 'contact@surabayainn.co.id',
        phone: '+62 31 987 6543',
        address: 'Jl. Pemuda No. 56, Surabaya',
        contactPerson: 'Dewi Lestari',
        status: 'pending',
        verificationStatus: 'pending',
        joinDate: '2024-01-15',
        totalHotels: 0,
        totalBookings: 0,
        totalRevenue: 0,
        commission: 12,
        rating: 0,
        documents: {
            businessLicense: true,
            taxId: true,
            bankAccount: false
        },
        bankInfo: {
            bankName: '',
            accountNumber: '',
            accountName: ''
        },
        description: 'Vendor baru yang sedang dalam proses verifikasi.'
    },
    {
        id: 'VND006',
        name: 'Bandung Heritage Hotels',
        type: 'individual',
        email: 'heritage.bdg@yahoo.com',
        phone: '+62 22 456 7890',
        address: 'Jl. Braga No. 12, Bandung',
        contactPerson: 'Rina Mulyani',
        status: 'suspended',
        verificationStatus: 'verified',
        joinDate: '2023-09-01',
        totalHotels: 2,
        totalBookings: 85,
        totalRevenue: 22000000,
        commission: 8,
        rating: 3.9,
        documents: {
            businessLicense: false,
            taxId: true,
            bankAccount: true
        },
        bankInfo: {
            bankName: 'Bank Mandiri',
            accountNumber: '4444555566',
            accountName: 'Rina Mulyani'
        },
        description: 'Vendor suspended karena pelanggaran kebijakan.'
    }
];

// Vendor Statistics
export const VENDOR_STATS = {
    total: 18,
    active: 14,
    pending: 3,
    suspended: 1,
    totalRevenue: 450500000,
    averageCommission: 11.5,
    totalHotels: 45,
    totalBookings: 1240
};

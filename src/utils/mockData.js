// Mock data for development and demo purposes

export const mockCourts = [
    {
        id: 1,
        name: 'Sân Cầu Lông Thiên Phúc',
        address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
        description: 'Sân cầu lông hiện đại với đầy đủ tiện nghi, ánh sáng tốt, mặt sân chất lượng cao',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
        pricePerHour: 80000,
        rating: 4.8,
        totalReviews: 127,
        amenities: ['Wifi miễn phí', 'Chỗ đậu xe', 'Phòng thay đồ', 'Máy lạnh'],
        openTime: '06:00',
        closeTime: '22:00',
        totalCourts: 8,
        owner: 'Nguyễn Văn A'
    },
    {
        id: 2,
        name: 'Câu Lạc Bộ Cầu Lông Rồng Vàng',
        address: '456 Lê Văn Việt, Quận 9, TP.HCM',
        description: 'CLB chuyên nghiệp với HLV giàu kinh nghiệm, tổ chức các giải đấu định kỳ',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        pricePerHour: 100000,
        rating: 4.9,
        totalReviews: 203,
        amenities: ['Wifi miễn phí', 'Chỗ đậu xe', 'Phòng thay đồ', 'Máy lạnh', 'Căng tin'],
        openTime: '05:00',
        closeTime: '23:00',
        totalCourts: 12,
        owner: 'Trần Thị B'
    },
    {
        id: 3,
        name: 'Sân Cầu Lông Minh Châu',
        address: '789 Võ Văn Ngân, Thủ Đức, TP.HCM',
        description: 'Sân đẹp, giá hợp lý, phù hợp cho sinh viên và người đi làm',
        image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800',
        pricePerHour: 60000,
        rating: 4.5,
        totalReviews: 89,
        amenities: ['Wifi miễn phí', 'Chỗ đậu xe', 'Phòng thay đồ'],
        openTime: '06:00',
        closeTime: '22:00',
        totalCourts: 6,
        owner: 'Lê Văn C'
    },
    {
        id: 4,
        name: 'Sân Cầu Lông VIP Star',
        address: '321 Điện Biên Phủ, Quận 3, TP.HCM',
        description: 'Sân VIP cao cấp, phục vụ giải đấu chuyên nghiệp',
        image: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800',
        pricePerHour: 150000,
        rating: 5.0,
        totalReviews: 56,
        amenities: ['Wifi miễn phí', 'Chỗ đậu xe', 'Phòng thay đồ', 'Máy lạnh', 'Căng tin', 'Spa'],
        openTime: '06:00',
        closeTime: '23:00',
        totalCourts: 10,
        owner: 'Phạm Thị D'
    },
    {
        id: 5,
        name: 'Sân Cầu Lông Thanh Niên',
        address: '654 Phan Văn Trị, Gò Vấp, TP.HCM',
        description: 'Sân rộng rãi, thoáng mát, giá cả phải chăng',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
        pricePerHour: 70000,
        rating: 4.6,
        totalReviews: 134,
        amenities: ['Wifi miễn phí', 'Chỗ đậu xe', 'Phòng thay đồ', 'Máy lạnh'],
        openTime: '06:00',
        closeTime: '22:00',
        totalCourts: 7,
        owner: 'Hoàng Văn E'
    },
    {
        id: 6,
        name: 'Sân Cầu Lông Olympic',
        address: '987 Nguyễn Oanh, Gò Vấp, TP.HCM',
        description: 'Sân tiêu chuẩn thi đấu, phù hợp tập luyện chuyên nghiệp',
        image: 'https://images.unsplash.com/photo-1593786481097-ec4c2f636c4b?w=800',
        pricePerHour: 90000,
        rating: 4.7,
        totalReviews: 98,
        amenities: ['Wifi miễn phí', 'Chỗ đậu xe', 'Phòng thay đồ', 'Máy lạnh', 'Căng tin'],
        openTime: '05:30',
        closeTime: '23:00',
        totalCourts: 9,
        owner: 'Vũ Thị F'
    }
];

export const mockBookings = [
    {
        id: 1,
        courtId: 1,
        courtName: 'Sân Cầu Lông Thiên Phúc',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-02-05',
        startTime: '08:00',
        endTime: '10:00',
        hours: 2,
        totalPrice: 160000,
        status: 'confirmed',
        courtNumber: 3,
        paymentStatus: 'paid',
        createdAt: '2026-02-01T10:30:00'
    },
    {
        id: 2,
        courtId: 2,
        courtName: 'CLB Cầu Lông Rồng Vàng',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-02-08',
        startTime: '18:00',
        endTime: '20:00',
        hours: 2,
        totalPrice: 200000,
        status: 'pending',
        courtNumber: 5,
        paymentStatus: 'pending',
        createdAt: '2026-02-01T11:15:00'
    },
    {
        id: 3,
        courtId: 1,
        courtName: 'Sân Cầu Lông Thiên Phúc',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-01-28',
        startTime: '07:00',
        endTime: '09:00',
        hours: 2,
        totalPrice: 160000,
        status: 'completed',
        courtNumber: 2,
        paymentStatus: 'paid',
        createdAt: '2026-01-25T09:20:00'
    },
    {
        id: 4,
        courtId: 3,
        courtName: 'Sân Cầu Lông Minh Châu',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-01-30',
        startTime: '19:00',
        endTime: '21:00',
        hours: 2,
        totalPrice: 120000,
        status: 'completed',
        courtNumber: 4,
        paymentStatus: 'paid',
        createdAt: '2026-01-28T14:45:00'
    },
    {
        id: 5,
        courtId: 4,
        courtName: 'Sân Cầu Lông VIP Star',
        userId: 2,
        userName: 'Trần Thị Lan',
        date: '2026-02-10',
        startTime: '14:00',
        endTime: '16:00',
        hours: 2,
        totalPrice: 300000,
        status: 'confirmed',
        courtNumber: 1,
        paymentStatus: 'paid',
        createdAt: '2026-02-01T08:00:00'
    }
];

export const mockUsers = [
    {
        id: 1,
        name: 'Nguyễn Văn Nam',
        email: 'nam.nguyen@example.com',
        phone: '0901234567',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?img=12',
        createdAt: '2025-12-01',
        totalBookings: 15,
        status: 'active'
    },
    {
        id: 2,
        name: 'Trần Thị Lan',
        email: 'lan.tran@example.com',
        phone: '0912345678',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?img=5',
        createdAt: '2025-11-15',
        totalBookings: 8,
        status: 'active'
    },
    {
        id: 3,
        name: 'Nguyễn Văn A',
        email: 'owner1@example.com',
        phone: '0923456789',
        role: 'owner',
        avatar: 'https://i.pravatar.cc/150?img=33',
        createdAt: '2025-10-01',
        courtsOwned: 1,
        status: 'active'
    },
    {
        id: 4,
        name: 'Admin System',
        email: 'admin@badminton.com',
        phone: '0987654321',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=68',
        createdAt: '2025-01-01',
        status: 'active'
    }
];

export const mockNotifications = [
    {
        id: 1,
        userId: 1,
        title: 'Đặt sân thành công',
        message: 'Bạn đã đặt sân tại Sân Cầu Lông Thiên Phúc vào ngày 05/02/2026',
        type: 'success',
        read: false,
        createdAt: '2026-02-01T10:30:00'
    },
    {
        id: 2,
        userId: 1,
        title: 'Nhắc nhở đặt sân',
        message: 'Bạn có lịch đặt sân vào lúc 8:00 ngày mai tại Sân Cầu Lông Thiên Phúc',
        type: 'info',
        read: false,
        createdAt: '2026-02-04T18:00:00'
    },
    {
        id: 3,
        userId: 1,
        title: 'Thanh toán thành công',
        message: 'Thanh toán 160.000đ cho booking #1 đã được xác nhận',
        type: 'success',
        read: true,
        createdAt: '2026-02-01T10:31:00'
    }
];

export const mockReviews = [
    {
        id: 1,
        courtId: 1,
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        rating: 5,
        comment: 'Sân đẹp, sạch sẽ, nhân viên nhiệt tình. Sẽ quay lại!',
        createdAt: '2026-01-29'
    },
    {
        id: 2,
        courtId: 1,
        userId: 2,
        userName: 'Trần Thị Lan',
        rating: 4,
        comment: 'Sân tốt, giá hợp lý. Chỗ đậu xe hơi chật một chút.',
        createdAt: '2026-01-28'
    }
];

export const mockStats = {
    user: {
        totalBookings: 15,
        upcomingBookings: 2,
        completedBookings: 13,
        totalSpent: 2250000,
        favoriteCourt: 'Sân Cầu Lông Thiên Phúc'
    },
    owner: {
        totalCourts: 8,
        todayBookings: 12,
        monthlyRevenue: 45600000,
        monthlyBookings: 234,
        occupancyRate: 78,
        topCourt: 'Sân số 3'
    },
    admin: {
        totalUsers: 1234,
        totalCourts: 45,
        totalBookings: 5678,
        todayBookings: 89,
        monthlyRevenue: 234500000,
        activeUsers: 456,
        newUsersThisMonth: 67
    }
};

export const mockRevenueData = [
    { month: 'T1', revenue: 32000000, bookings: 156 },
    { month: 'T2', revenue: 28000000, bookings: 142 },
    { month: 'T3', revenue: 35000000, bookings: 178 },
    { month: 'T4', revenue: 38000000, bookings: 191 },
    { month: 'T5', revenue: 42000000, bookings: 203 },
    { month: 'T6', revenue: 45000000, bookings: 215 },
    { month: 'T7', revenue: 48000000, bookings: 234 },
    { month: 'T8', revenue: 44000000, bookings: 221 },
    { month: 'T9', revenue: 40000000, bookings: 198 },
    { month: 'T10', revenue: 43000000, bookings: 207 },
    { month: 'T11', revenue: 46000000, bookings: 223 },
    { month: 'T12', revenue: 50000000, bookings: 241 }
];

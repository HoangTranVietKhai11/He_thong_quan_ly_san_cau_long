# Tổng hợp các tính năng đã thay đổi (Export)

Dưới đây là 6 thư mục chứa các file đã được chỉnh sửa để bạn có thể sao chép sang máy khác:

### 1. 01_Dang_Ky_SDT
*   **Mô tả**: Thêm tính năng nhập số điện thoại khi đăng ký (Validation định dạng VN).
*   **Files**:
    *   `20260325000001_add_phone_to_users.js` (Migration DB)
    *   `auth.c.js` (Controller Backend)
    *   `auth.s.js` (Service Backend)
    *   `Register.jsx` (Frontend Page)
    *   `authService.jsx` (Frontend Service)

### 2. 02_Fix_Them_San
*   **Mô tả**: Sửa lỗi không thêm được sân do sai định dạng Enum trong DB (Single/Vip/Double).
*   **Files**:
    *   `Courts.jsx` (Admin Court Page)

### 3. 03_Doi_Lich_Reschedule
*   **Mô tả**: Tính năng đổi lịch trực tiếp cho người dùng.
*   **Files**:
    *   `bookings.s.js`, `bookings.c.js`, `bookings.r.js` (Backend)
    *   `Bookings.jsx` (User Page)
    *   `bookingService.jsx` (Frontend Service)

### 4. 04_Huy_San_User
*   **Mô tả**: Mở rộng quyền hủy sân (Confirmed/Pending) và hoàn tiền ví.
*   **Files**:
    *   `Bookings.jsx`, `bookingService.jsx`

### 5. 05_Admin_Booking_Detail_Cancel
*   **Mô tả**: Admin xem chi tiết đặt sân và có quyền hủy sân (kèm lý do) + hoàn tiền tự động.
*   **Files**:
    *   `AllBookings.jsx` (Admin Page)
    *   `bookings.s.js`, `bookings.c.js`, `bookings.r.js` (Backend)

### 6. 06_Fix_Loi_He_Thong
*   **Mô tả**: Cleanup code trùng lặp và cấu hình Docker.
*   **Files**:
    *   `docker-compose.yml`
    *   `bookingService.jsx`

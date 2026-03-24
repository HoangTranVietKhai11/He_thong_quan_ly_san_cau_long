# Hướng dẫn Các Luồng Kiểm thử Toàn diện

Tài liệu này cung cấp các bước chi tiết để kiểm thử các quy trình nghiệp vụ chính của Hệ thống Quản lý Sân Cầu lông.

---

## 1. Luồng Khởi tạo Hệ thống (Admin & Chủ sân)

**Mục tiêu:** Thiết lập dữ liệu cơ sở để hệ thống có thể hoạt động.

### Bước 1: Admin tạo tài khoản Chủ sân
1. Đăng nhập với quyền **Admin**.
2. Truy cập: `Quản lý Người dùng` > `Thêm Người dùng`.
3. Nhập thông tin (Email, Tên, SĐT, Mật khẩu) và chọn vai trò: **Owner**.
4. Kiểm tra: Tài khoản mới xuất hiện trong danh sách và có thể đăng nhập.

### Bước 2: Chủ sân tạo Cơ sở và Sân
1. Đăng nhập với quyền **Owner**.
2. Truy cập: `Quản lý Cơ sở` > `Thêm Cơ sở mới`.
3. Nhập thông tin (Tên cơ sở, Địa chỉ, SĐT).
4. Sau khi tạo cơ sở, vào chi tiết cơ sở đó và chọn `Thêm Sân`.
5. Nhập số lượng sân hoặc thông tin từng sân cụ thể.
6. Kiểm tra: Cơ sở và sân hiển thị đúng trên Dashboard của Chủ sân.

---

## 2. Luồng Đặt sân & Ưu đãi (Người dùng)

**Mục tiêu:** Người dùng tìm sân, áp mã giảm giá và hoàn tất đặt sân.

### Bước 1: Tìm kiếm và Chọn sân
1. Đăng nhập với quyền **User**.
2. Truy cập: `Trang chủ` hoặc `Đặt sân`.
3. Chọn ngày muốn chơi và Cơ sở/Sân cụ thể trên Lịch (Calendar).
4. Chọn các khung giờ (Slot) còn trống (màu xanh).

### Bước 2: Áp dụng Voucher và Đặt sân
1. Trong màn hình xác nhận đặt sân, nhập **Mã Voucher** (ví dụ: `GIAM30`).
2. Kiểm tra: Giá tiền được cập nhật giảm đúng 30%.
3. Nhấn `Xác nhận Đặt sân`.
4. Kiểm tra: Booking xuất hiện trong `Lịch sử Đặt sân` với trạng thái "Đã xác nhận".

---

## 3. Luồng Ví & Thanh toán (Người dùng & Admin)

**Mục tiêu:** Kiểm tra tích hợp Ví điện tử trong hệ thống.

### Bước 1: Nạp tiền vào Ví
1. Đăng nhập quyền **User**, vào `Ví của tôi` > `Nạp tiền`.
2. Kiểm tra: Nếu nạp qua API Admin (công cụ test), Admin thực hiện `Nạp tiền cho User`.
3. Kiểm tra: Số dư ví của User tăng lên tương ứng.

### Bước 2: Thanh toán Booking bằng Ví
1. Thực hiện đặt sân như Luồng 2.
2. Tại bước thanh toán, chọn phương thức: **Ví hệ thống**.
3. Xác nhận thanh toán.
4. Kiểm tra: Số dư ví bị trừ, booking chuyển trạng thái "Đã thanh toán".

---

## 4. Luồng Vận hành & Check-in (Nhân viên)

**Mục tiêu:** Quản lý khách hàng tại sân và các dịch vụ đi kèm.

### Bước 1: Check-in khách hàng
1. Đăng nhập quyền **Staff**.
2. Truy cập: `Quản lý Booking`.
3. Tìm booking theo tên khách hoặc mã.
4. Nhấn `Check-in`.
5. Kiểm tra: Trạng thái booking chuyển sang "Đã check-in".

### Bước 2: Thuê vật tư và Bảo trì
1. Staff vào mục `Quản lý Vật tư`, thực hiện `Cho thuê` (vợt, cầu...) gắn với Booking vừa check-in.
2. Nếu có sân hỏng, Staff tạo `Lịch bảo trì` cho sân đó.
3. Kiểm tra: Sân đang bảo trì sẽ hiển thị màu xám/đỏ trên lịch và không thể đặt.

---

## 5. Luồng Quản lý Doanh thu & Ca làm việc (Chủ sân & Nhân viên)

**Mục tiêu:** Kiểm soát dòng tiền và hiệu suất.

### Bước 1: Chốt ca làm việc (Staff)
1. Nhân viên thực hiện `Bắt đầu ca` đầu ngày với số tiền mặt ban đầu.
2. Cuối ngày, thực hiện `Kết thúc ca`, nhập số tiền mặt thực tế thu được.
3. Kiểm tra: Hệ thống báo cáo chênh lệch (nếu có).

### Bước 2: Xem báo cáo doanh thu (Owner)
1. Chủ sân vào `Dashboard Doanh thu`.
2. Xem biểu đồ doanh thu theo ngày/tháng và theo từng cơ sở.
3. Kiểm tra: Các số liệu khớp với các booking đã hoàn thành.

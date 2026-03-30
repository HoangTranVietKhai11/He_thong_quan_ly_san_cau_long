# BẢNG TIẾN ĐỘ DỰ ÁN (Project Progress Tracker)
**Dự án:** Hệ thống Quản lý Sân Cầu lông
**Cập nhật lần cuối:** Hôm nay

Phân chia dự án thành các giai đoạn (Phase) để dễ dàng theo dõi mục tiêu và khối lượng công việc còn lại.

| Giai đoạn (Phase) | Hạng mục công việc (Tasks) | Trạng thái | Ước tính (%) | Người phụ trách |
| :--- | :--- | :---: | :---: | :--- |
| **Giai đoạn 1: Khởi tạo & Cơ sở dữ liệu** | Thiết kế Database (Users, Courts, Bookings, Vouchers...) | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Cài đặt Môi trường (Docker, Vite, Express, Postgres) | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Cấu hình xác thực (JWT Auth, Role-based middlewares) | 🟢 Hoàn thành | 100% | Antigravity & User |
| | | | | |
| **Giai đoạn 2: Tính năng User (Khách hàng)**| Đăng ký, Đăng nhập, Quản lý Hồ sơ | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Lịch sân trực tiếp (Xem sân trống, Đã đặt, Bảo trì) | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Đặt sân & Chuyển thẳng đến trang Nhận thanh toán | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Áp dụng mã Voucher tự động trừ tiền | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Lịch sử giao dịch (Xem đơn, Hủy đơn) | 🟢 Hoàn thành | 100% | Antigravity & User |
| | Hiển thị QR Code & Thông tin chuyển khoản linh hoạt | 🟢 Hoàn thành | 100% | Antigravity & User |
| | | | | |
| **Giai đoạn 3: Tính năng Staff (Nhân viên)** | Đăng nhập tài khoản Staff, Phân quyền Route | 🟡 Đang làm | 80% | Antigravity & User |
| | Quản lý kho (Vật tư, thiết bị cho thuê) | 🟡 Đang làm | 70% | Antigravity & User |
| | Xác nhận nhận tiền mặt (Cập nhật đơn thành Fully Paid) | 🟡 Đang làm | 60% | Antigravity |
| | Đặt sân tấp nập tại quầy cho khách vãng lai | ⚪ Chưa làm | 0% | Antigravity |
| | Kiểm tra Ca làm việc cá nhân / Bàn giao ca | ⚪ Chưa làm | 0% | Antigravity |
| | | | | |
| **Giai đoạn 4: Tính năng Admin (Chủ sân)** | Quản lý Người dùng, Sân (Đóng/Mở/Bảo trì) | 🟡 Đang làm | 50% | Antigravity |
| | Bảng phân ca làm việc (Shift Management) cho Staff | 🟡 Đang làm | 30% | Antigravity |
| | Quản lý Voucher (Thêm mã mới, Hạn mức sử dụng) | 🟡 Đang làm | 50% | Antigravity |
| | Thống kê Dashboard (Doanh thu, Tỉ lệ lấp đầy) | 🟡 Đang làm | 10% | Antigravity |
| | Sửa lỗi báo cáo thống kê (`db is not a function`) | ⚪ Cần fix sớm | 0% | Antigravity |
| | | | | |
| **Giai đoạn 5: Tối ưu Hệ thống (Nâng cao)**| Tự động hóa: Cron Job hủy đơn do khách bùng | ⚪ Chưa làm | 0% | Antigravity |
| | Chống Bot/Spam (Block User nếu chưa thanh toán >3 đơn)| ⚪ Chưa làm | 0% | Antigravity |
| | Logic "Khung Giờ Vàng" (Golden Hour Prediction) | ⚪ Kế hoạch | 0% | Antigravity |
| | Cập nhật giá theo thì / Giờ cao điểm linh hoạt | ⚪ Kế hoạch | 0% | Antigravity |

---
**Chú giải trạng thái:**
* 🟢 **Hoàn thành (Done):** Tính năng đã viết xong code, hoạt động trên luồng thực tế và đã fix bug.
* 🟡 **Đang làm (In Progress):** Đã có khung sườn phần cứng/nói chung, có UI nhưng dữ liệu hoặc API còn lỗi/chưa đồng bộ hoàn chỉnh.
* ⚪ **Chưa làm (To-Do):** Sắp xếp làm trong các ngày tiếp theo.
* 🔴 **Bị Block (Blocked):** Chờ duyệt hoặc đang kẹt logic/kỹ thuật (Hiện dự án chưa có mục nào bị block).

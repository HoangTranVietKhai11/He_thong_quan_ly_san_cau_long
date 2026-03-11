# Kiểm thử Phần mềm - Hệ thống Đặt sân Cầu lông

| Thông tin | Chi tiết |
|---|---|
| **Tên dự án** | Hệ thống Quản lý và Đặt sân Cầu lông |
| **Người review các Test** | |
| **Mô tả** | Test case cho toàn bộ chức năng của hệ thống đặt sân cầu lông |
| **Mục tiêu kiểm thử** | Kiểm tra tất cả các chức năng hoạt động đúng yêu cầu |
| **Môi trường kiểm thử** | Use Postman for API Testing, Use Google Chrome for FE Testing, Use React Dev Tools |

---

## 1. MODULE ĐĂNG NHẬP (Authentication - Login)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_LOGIN_001 | 1. Người dùng có tài khoản hợp lệ trong hệ thống. 2. Hệ thống hoạt động bình thường và có thể truy cập. | 1. Mở trang đăng nhập (/login). 2. Nhập thông tin đăng nhập hợp lệ. 3. Nhấn nút "Đăng nhập". | - Email: example_user@example.com - Password: password123 | 1. Đăng nhập thành công. 2. Chuyển hướng đến trang dashboard tương ứng với role. 3. Hiển thị thông tin người dùng. | | Pass | Medium | Low | Nếu đăng nhập thất bại, kiểm tra credentials và ghi nhận lỗi cụ thể. |
| TC_LOGIN_002 | 1. Hệ thống hoạt động bình thường. | 1. Mở trang đăng nhập. 2. Nhập email đúng nhưng mật khẩu sai. 3. Nhấn nút "Đăng nhập". | - Email: example_user@example.com - Password: wrongpassword | 1. Đăng nhập thất bại. 2. Hiển thị thông báo lỗi "Sai thông tin đăng nhập". 3. Vẫn ở trang đăng nhập. | | Pass | Medium | Medium | Kiểm tra thông báo lỗi hiển thị rõ ràng. |
| TC_LOGIN_003 | 1. Hệ thống hoạt động bình thường. | 1. Mở trang đăng nhập. 2. Nhập email không tồn tại. 3. Nhấn nút "Đăng nhập". | - Email: notexist@example.com - Password: password123 | 1. Đăng nhập thất bại. 2. Hiển thị thông báo lỗi phù hợp. 3. Vẫn ở trang đăng nhập. | | Pass | Medium | Medium | |
| TC_LOGIN_004 | 1. Hệ thống hoạt động bình thường. | 1. Mở trang đăng nhập. 2. Để trống email và mật khẩu. 3. Nhấn nút "Đăng nhập". | - Email: (trống) - Password: (trống) | 1. Form validation ngăn submit. 2. Hiển thị thông báo yêu cầu nhập thông tin. | | Pass | Low | Low | Kiểm tra required attribute trên form. |
| TC_LOGIN_005 | 1. Hệ thống hoạt động bình thường. | 1. Mở trang đăng nhập. 2. Nhập email sai định dạng. 3. Nhấn nút "Đăng nhập". | - Email: invalid-email - Password: password123 | 1. Form validation báo lỗi email không hợp lệ. 2. Không gửi request đến server. | | Pass | Low | Low | |
| TC_LOGIN_006 | 1. Người dùng có tài khoản admin. | 1. Mở trang đăng nhập. 2. Đăng nhập với tài khoản admin. 3. Nhấn "Đăng nhập". | - Email: admin@example.com - Password: admin123 | 1. Đăng nhập thành công. 2. Chuyển hướng đến /admin/dashboard. | | Pass | High | High | Kiểm tra phân quyền đúng role admin. |
| TC_LOGIN_007 | 1. Người dùng có tài khoản owner. | 1. Mở trang đăng nhập. 2. Đăng nhập với tài khoản owner. 3. Nhấn "Đăng nhập". | - Email: owner@example.com - Password: owner123 | 1. Đăng nhập thành công. 2. Chuyển hướng đến /owner/dashboard. | | Pass | High | High | Kiểm tra phân quyền đúng role owner. |
| TC_LOGIN_008 | 1. Người dùng có tài khoản staff. | 1. Mở trang đăng nhập. 2. Đăng nhập với tài khoản staff. 3. Nhấn "Đăng nhập". | - Email: staff@example.com - Password: staff123 | 1. Đăng nhập thành công. 2. Chuyển hướng đến /staff/dashboard. | | Pass | High | High | Kiểm tra phân quyền đúng role staff. |
| TC_LOGIN_009 | 1. Hệ thống hoạt động. | 1. Mở trang đăng nhập. 2. Nhấn link "Quên mật khẩu?". | Không có | 1. Chuyển hướng đến trang /forgot-password. 2. Trang quên mật khẩu hiển thị đúng. | | Pass | Low | Low | |
| TC_LOGIN_010 | 1. Hệ thống hoạt động. | 1. Mở trang đăng nhập. 2. Nhấn link "Đăng ký ngay". | Không có | 1. Chuyển hướng đến trang /register. 2. Trang đăng ký hiển thị đúng. | | Pass | Low | Low | |

---

## 2. MODULE ĐĂNG KÝ (Authentication - Register)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_REGISTER_001 | 1. Trang đăng ký hoạt động. 2. Hệ thống có thể xử lý đăng ký. | 1. Truy cập trang đăng ký (/register). 2. Điền đầy đủ thông tin hợp lệ. 3. Nhấn nút "Đăng ký". | - Họ tên: Nguyen Van A - Email: nguyenvana@example.com - SĐT: 0901234567 - Mật khẩu: P@ssword123 - Xác nhận MK: P@ssword123 | 1. Đăng ký thành công. 2. Chuyển hướng đến /user/dashboard. 3. Tài khoản được tạo trong hệ thống. | | Pass | Medium | High | Kiểm tra dữ liệu lưu đúng vào DB. |
| TC_REGISTER_002 | 1. Trang đăng ký hoạt động. | 1. Truy cập trang đăng ký. 2. Nhập mật khẩu và xác nhận mật khẩu khác nhau. 3. Nhấn "Đăng ký". | - Họ tên: Nguyen Van B - Email: test@example.com - SĐT: 0909876543 - Mật khẩu: P@ssword123 - Xác nhận MK: DifferentPass | 1. Đăng ký thất bại. 2. Hiển thị lỗi "Mật khẩu xác nhận không khớp". | | Pass | Medium | High | |
| TC_REGISTER_003 | 1. Email đã tồn tại trong hệ thống. | 1. Truy cập trang đăng ký. 2. Nhập email đã tồn tại. 3. Nhấn "Đăng ký". | - Họ tên: Nguyen Van C - Email: existing@example.com - SĐT: 0912345678 - Mật khẩu: P@ssword123 - Xác nhận MK: P@ssword123 | 1. Đăng ký thất bại. 2. Hiển thị lỗi "Email đã tồn tại". | | Pass | Medium | High | |
| TC_REGISTER_004 | 1. Trang đăng ký hoạt động. | 1. Truy cập trang đăng ký. 2. Để trống tất cả các trường. 3. Nhấn "Đăng ký". | - Tất cả các trường: (trống) | 1. Form validation ngăn submit. 2. Hiển thị thông báo yêu cầu nhập. | | Pass | Low | Low | |
| TC_REGISTER_005 | 1. Trang đăng ký hoạt động. | 1. Truy cập trang đăng ký. 2. Nhập email sai định dạng. 3. Nhấn "Đăng ký". | - Họ tên: Test User - Email: invalid-email - SĐT: 0901234567 - Mật khẩu: P@ssword123 - Xác nhận MK: P@ssword123 | 1. Form validation báo lỗi email không hợp lệ. | | Pass | Low | Low | |
| TC_REGISTER_006 | 1. Trang đăng ký hoạt động. | 1. Truy cập trang đăng ký. 2. Nhấn link "Đăng nhập". | Không có | 1. Chuyển hướng đến trang /login. | | Pass | Low | Low | |

---

## 3. MODULE QUÊN MẬT KHẨU (Forgot Password)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_FORGOT_001 | 1. Trang quên mật khẩu hoạt động. 2. Email đã đăng ký trong hệ thống. | 1. Truy cập /forgot-password. 2. Nhập email hợp lệ. 3. Nhấn "Gửi email khôi phục". | - Email: user@example.com | 1. Hiển thị thông báo thành công "Email khôi phục đã được gửi". 2. Email khôi phục được gửi đến hộp thư. | | Pass | Medium | High | |
| TC_FORGOT_002 | 1. Trang quên mật khẩu hoạt động. | 1. Truy cập /forgot-password. 2. Để trống email. 3. Nhấn "Gửi email khôi phục". | - Email: (trống) | 1. Form validation ngăn submit. | | Pass | Low | Low | |
| TC_FORGOT_003 | 1. Trang quên mật khẩu hoạt động. | 1. Truy cập /forgot-password. 2. Nhấn link "Quay lại đăng nhập". | Không có | 1. Chuyển hướng về trang /login. | | Pass | Low | Low | |

---

## 4. MODULE TRANG CÔNG KHAI (Public Pages)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_HOME_001 | 1. Hệ thống hoạt động. | 1. Truy cập trang chủ (/). | Không có | 1. Trang chủ hiển thị đầy đủ thông tin. 2. Các section hiển thị đúng (banner, giới thiệu, sân nổi bật). | | Pass | Low | Low | |
| TC_COURTS_001 | 1. Hệ thống hoạt động. 2. Có dữ liệu sân trong DB. | 1. Truy cập trang danh sách sân (/courts). | Không có | 1. Hiển thị danh sách sân cầu lông. 2. Mỗi sân có thông tin cơ bản (tên, giá, trạng thái). | | Pass | Medium | Medium | |
| TC_COURTS_002 | 1. Hệ thống hoạt động. 2. Có sân với ID hợp lệ. | 1. Truy cập trang chi tiết sân (/courts/:id). | - ID sân: 1 | 1. Hiển thị thông tin chi tiết sân. 2. Hiển thị giá, lịch trống, tiện ích. | | Pass | Medium | Medium | |
| TC_ABOUT_001 | 1. Hệ thống hoạt động. | 1. Truy cập trang giới thiệu (/about). | Không có | 1. Trang giới thiệu hiển thị đúng nội dung. | | Pass | Low | Low | |

---

## 5. MODULE NGƯỜI DÙNG (User Dashboard)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_USER_DASH_001 | 1. Đã đăng nhập với role user. | 1. Truy cập /user/dashboard. | Không có | 1. Hiển thị dashboard người dùng. 2. Thống kê booking, lịch sử gần đây. | | Pass | Medium | Medium | |
| TC_USER_BOOK_001 | 1. Đã đăng nhập với role user. 2. Có sân available. | 1. Truy cập /user/bookings. 2. Chọn sân cần đặt. 3. Chọn ngày và khung giờ. 4. Xác nhận đặt sân. | - Sân: Sân 1 - Ngày: 15/03/2026 - Giờ: 08:00-10:00 | 1. Đặt sân thành công. 2. Booking hiển thị trong danh sách. 3. Trạng thái booking: Đã xác nhận. | | Pass | High | High | Kiểm tra booking không bị trùng lịch. |
| TC_USER_BOOK_002 | 1. Đã đăng nhập với role user. 2. Có booking trước đó. | 1. Truy cập /user/bookings. 2. Xem danh sách booking. | Không có | 1. Hiển thị danh sách booking của user. 2. Mỗi booking hiển thị đầy đủ thông tin. | | Pass | Medium | Medium | |
| TC_USER_BOOK_003 | 1. Đã đăng nhập với role user. 2. Có booking chưa diễn ra. | 1. Truy cập /user/bookings. 2. Chọn booking cần hủy. 3. Nhấn "Hủy booking". 4. Xác nhận hủy. | - Booking ID: BK001 | 1. Hủy booking thành công. 2. Trạng thái chuyển sang "Đã hủy". | | Pass | High | High | Kiểm tra chính sách hủy. |
| TC_USER_CAL_001 | 1. Đã đăng nhập với role user. | 1. Truy cập /user/calendar. 2. Xem lịch. | Không có | 1. Hiển thị lịch với các slot trống/đã đặt. 2. Có thể chuyển ngày/tuần/tháng. | | Pass | Medium | Medium | |
| TC_USER_RECUR_001 | 1. Đã đăng nhập với role user. | 1. Truy cập /user/recurring. 2. Tạo booking định kỳ. 3. Chọn lịch lặp lại. 4. Xác nhận. | - Sân: Sân 2 - Ngày bắt đầu: 15/03/2026 - Giờ: 18:00-20:00 - Lặp: Hàng tuần - Số tuần: 4 | 1. Tạo booking định kỳ thành công. 2. Hiển thị các booking trong danh sách. | | Pass | High | High | |
| TC_USER_WAIT_001 | 1. Đã đăng nhập với role user. 2. Slot mong muốn đã đầy. | 1. Truy cập /user/waitlist. 2. Đăng ký chờ cho slot mong muốn. | - Sân: Sân 1 - Ngày: 16/03/2026 - Giờ: 08:00-10:00 | 1. Đăng ký vào danh sách chờ thành công. 2. Nhận thông báo khi slot trống. | | Pass | Medium | Medium | |
| TC_USER_PROF_001 | 1. Đã đăng nhập với role user. | 1. Truy cập /user/profile. 2. Cập nhật thông tin cá nhân. 3. Nhấn "Lưu". | - Họ tên: Nguyen Van A Updated - SĐT: 0909999888 | 1. Cập nhật thông tin thành công. 2. Thông tin mới hiển thị đúng. | | Pass | Medium | Medium | |
| TC_USER_PROF_002 | 1. Đã đăng nhập với role user. | 1. Truy cập /user/profile. 2. Đổi mật khẩu. 3. Nhấn "Lưu". | - MK cũ: oldpass123 - MK mới: newpass456 - Xác nhận: newpass456 | 1. Đổi mật khẩu thành công. 2. Đăng nhập lại với mật khẩu mới OK. | | Pass | High | High | |
| TC_USER_NOTI_001 | 1. Đã đăng nhập với role user. 2. Có thông báo trong hệ thống. | 1. Truy cập /user/notifications. | Không có | 1. Hiển thị danh sách thông báo. 2. Thông báo mới nhất ở trên cùng. | | Pass | Low | Low | |
| TC_USER_VOUCH_001 | 1. Đã đăng nhập với role user. | 1. Truy cập /user/vouchers. | Không có | 1. Hiển thị danh sách voucher khả dụng. 2. Thông tin voucher (mã, giảm giá, hạn sử dụng). | | Pass | Low | Medium | |

---

## 6. MODULE NHÂN VIÊN (Staff Dashboard)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_STAFF_DASH_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/dashboard. | Không có | 1. Hiển thị dashboard nhân viên. 2. Thống kê booking hôm nay, check-in, tình trạng sân. | | Pass | Medium | Medium | |
| TC_STAFF_CHECKIN_001 | 1. Đã đăng nhập với role staff. 2. Có booking hôm nay. | 1. Truy cập /staff/checkin. 2. Tìm booking cần check-in. 3. Xác nhận check-in. | - Mã booking: BK001 hoặc tên khách | 1. Check-in thành công. 2. Trạng thái booking chuyển sang "Đã check-in". | | Pass | High | High | |
| TC_STAFF_CHECKIN_002 | 1. Đã đăng nhập với role staff. 2. Khách đã check-in. | 1. Truy cập /staff/checkin. 2. Tìm booking đã check-in. 3. Xác nhận check-out. | - Mã booking: BK001 | 1. Check-out thành công. 2. Trạng thái booking chuyển sang "Hoàn thành". 3. Tính phí phát sinh (nếu có). | | Pass | High | High | |
| TC_STAFF_COUNTER_001 | 1. Đã đăng nhập với role staff. 2. Có sân trống. | 1. Truy cập /staff/booking. 2. Đặt sân cho khách tại quầy. 3. Điền thông tin khách. 4. Xác nhận đặt sân. | - Tên khách: Tran Van B - SĐT: 0901111222 - Sân: Sân 3 - Giờ: 14:00-16:00 | 1. Đặt sân tại quầy thành công. 2. Booking mới xuất hiện trong danh sách. | | Pass | High | High | |
| TC_STAFF_PAY_001 | 1. Đã đăng nhập với role staff. 2. Khách cần thanh toán. | 1. Truy cập /staff/payment. 2. Tìm booking cần thanh toán. 3. Xử lý thanh toán. 4. Xác nhận. | - Mã booking: BK001 - Phương thức: Tiền mặt - Số tiền: 200.000đ | 1. Thanh toán thành công. 2. Hóa đơn được tạo. | | Pass | High | High | |
| TC_STAFF_COURTS_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/courts. | Không có | 1. Hiển thị danh sách sân và trạng thái. 2. Có thể cập nhật trạng thái sân. | | Pass | Medium | Medium | |
| TC_STAFF_EQUIP_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/equipment. 2. Xem danh sách thiết bị. | Không có | 1. Hiển thị inventory thiết bị. 2. Số lượng, tình trạng từng thiết bị. | | Pass | Medium | Medium | |
| TC_STAFF_REPAIR_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/repairs. 2. Tạo yêu cầu sửa chữa. | - Sân: Sân 2 - Mô tả: Lưới rách - Mức độ: Trung bình | 1. Tạo yêu cầu sửa chữa thành công. 2. Hiển thị trong danh sách lịch sửa chữa. | | Pass | Medium | High | |
| TC_STAFF_VOUCH_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/vouchers. 2. Xem danh sách voucher. 3. Áp dụng voucher cho khách. | - Mã voucher: GIAM20 - Booking: BK002 | 1. Áp dụng voucher thành công. 2. Giá booking được giảm đúng. | | Pass | Medium | High | |
| TC_STAFF_PROF_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/profile. 2. Xem và cập nhật thông tin cá nhân. | - Họ tên: Staff Updated - SĐT: 0908888777 | 1. Cập nhật thông tin thành công. | | Pass | Medium | Medium | |
| TC_STAFF_SEC_001 | 1. Đã đăng nhập với role staff. | 1. Truy cập /staff/security. | Không có | 1. Hiển thị cài đặt bảo mật. 2. Có thể đổi mật khẩu, cài đặt 2FA. | | Pass | Medium | High | |

---

## 7. MODULE CHỦ SÂN (Owner Dashboard)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_OWNER_DASH_001 | 1. Đã đăng nhập với role owner. | 1. Truy cập /owner/dashboard. | Không có | 1. Hiển thị dashboard chủ sân. 2. Thống kê doanh thu, booking, tình trạng sân. | | Pass | Medium | Medium | |
| TC_OWNER_COURTS_001 | 1. Đã đăng nhập với role owner. | 1. Truy cập /owner/courts. 2. Xem danh sách sân. | Không có | 1. Hiển thị tất cả sân của owner. 2. Trạng thái, thông tin từng sân. | | Pass | Medium | Medium | |
| TC_OWNER_COURTS_002 | 1. Đã đăng nhập với role owner. | 1. Truy cập /owner/courts. 2. Thêm sân mới. 3. Điền thông tin. 4. Lưu. | - Tên sân: Sân 5 - Loại: Đơn - Giá: 150.000đ/h - Mô tả: Sân trong nhà | 1. Thêm sân thành công. 2. Sân mới hiển thị trong danh sách. | | Pass | High | High | |
| TC_OWNER_COURTS_003 | 1. Đã đăng nhập với role owner. 2. Có sân cần chỉnh sửa. | 1. Truy cập /owner/courts. 2. Chọn sân cần sửa. 3. Cập nhật thông tin. 4. Lưu. | - Giá mới: 180.000đ/h | 1. Cập nhật thành công. 2. Thông tin mới hiển thị đúng. | | Pass | Medium | Medium | |
| TC_OWNER_BOOK_001 | 1. Đã đăng nhập với role owner. 2. Có booking. | 1. Truy cập /owner/bookings. | Không có | 1. Hiển thị tất cả booking trên sân của owner. 2. Filter/tìm kiếm hoạt động. | | Pass | Medium | Medium | |
| TC_OWNER_REV_001 | 1. Đã đăng nhập với role owner. 2. Có dữ liệu doanh thu. | 1. Truy cập /owner/revenue. 2. Xem báo cáo doanh thu. | - Khoảng thời gian: Tháng 3/2026 | 1. Hiển thị biểu đồ doanh thu. 2. Tổng doanh thu, chi tiết theo ngày/tuần. | | Pass | High | High | |

---

## 8. MODULE QUẢN TRỊ - DASHBOARD (Admin Dashboard)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_DASH_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/dashboard. | Không có | 1. Hiển thị tổng quan hệ thống. 2. Thống kê người dùng, sân, booking, doanh thu. | | Pass | Medium | Medium | |

---

## 9. MODULE QUẢN TRỊ - QUẢN LÝ TÀI KHOẢN (Admin Accounts)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_USER_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users. 2. Xem danh sách người dùng. | Không có | 1. Hiển thị danh sách tất cả người dùng. 2. Thông tin: tên, email, role, trạng thái. | | Pass | Medium | Medium | |
| TC_ADMIN_USER_002 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users. 2. Tìm kiếm người dùng. | - Từ khóa: "Nguyen" | 1. Hiển thị kết quả tìm kiếm phù hợp. | | Pass | Medium | Medium | |
| TC_ADMIN_USER_003 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users. 2. Chọn người dùng. 3. Khóa/Mở khóa tài khoản. | - User ID: U001 | 1. Khóa/mở khóa thành công. 2. Trạng thái cập nhật đúng. | | Pass | High | High | |
| TC_ADMIN_PERM_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users/permissions. 2. Xem và chỉnh sửa phân quyền. | - Role: staff - Quyền: Quản lý booking | 1. Hiển thị bảng phân quyền. 2. Cập nhật quyền thành công. | | Pass | High | High | |
| TC_ADMIN_LOG_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users/logs. | Không có | 1. Hiển thị system logs. 2. Filter theo thời gian, loại hoạt động. | | Pass | Medium | Medium | |
| TC_ADMIN_OAUTH_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users/oauth. 2. Cấu hình OAuth. | - Provider: Google - Client ID: xxx - Client Secret: xxx | 1. Cấu hình OAuth thành công. 2. Đăng nhập qua Google hoạt động. | | Pass | High | High | |
| TC_ADMIN_SEC_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/users/security. 2. Cấu hình bảo mật. | - 2FA: Bật - Session timeout: 30 phút | 1. Cài đặt bảo mật được lưu thành công. | | Pass | High | High | |

---

## 10. MODULE QUẢN TRỊ - QUẢN LÝ SÂN (Admin Courts)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_COURT_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts. 2. Xem danh sách sân. | Không có | 1. Hiển thị tất cả sân trong hệ thống. 2. Thông tin chi tiết từng sân. | | Pass | Medium | Medium | |
| TC_ADMIN_COURT_002 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts. 2. Thêm sân mới. 3. Điền thông tin. 4. Lưu. | - Tên sân: Sân Test - Loại: Đôi - Giá: 200.000đ/h - Chủ sân: Owner A | 1. Thêm sân thành công. 2. Sân mới xuất hiện trong danh sách. | | Pass | High | High | |
| TC_ADMIN_COURT_003 | 1. Đã đăng nhập với role admin. 2. Có sân cần xóa. | 1. Truy cập /admin/courts. 2. Chọn sân. 3. Nhấn "Xóa". 4. Xác nhận. | - Sân: Sân Test | 1. Xóa sân thành công. 2. Sân không còn trong danh sách. | | Pass | High | High | Kiểm tra booking liên quan khi xóa sân. |
| TC_ADMIN_PRICE_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts/pricing. 2. Xem và cập nhật bảng giá. | - Sân: Sân 1 - Giờ cao điểm: 250.000đ/h - Giờ thường: 150.000đ/h | 1. Cập nhật giá thành công. 2. Giá mới áp dụng đúng. | | Pass | High | High | |
| TC_ADMIN_MAINT_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts/maintenance. 2. Xem lịch bảo trì. 3. Thêm lịch bảo trì mới. | - Sân: Sân 2 - Ngày: 20/03/2026 - Mô tả: Bảo trì định kỳ | 1. Thêm lịch bảo trì thành công. 2. Sân tự động chuyển trạng thái. | | Pass | High | High | |
| TC_ADMIN_FLOOR_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts/floor-plan. | Không có | 1. Hiển thị sơ đồ mặt bằng sân. 2. Trạng thái sân hiển thị trực quan. | | Pass | Medium | Medium | |
| TC_ADMIN_REPAIR_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts/repairs. | Không có | 1. Hiển thị lịch sử sửa chữa. 2. Chi tiết từng lần sửa chữa. | | Pass | Medium | Medium | |
| TC_ADMIN_ALERT_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts/alerts. | Không có | 1. Hiển thị cảnh báo thiết bị. 2. Mức độ ưu tiên các cảnh báo. | | Pass | Medium | High | |
| TC_ADMIN_USAGE_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/courts/history. | Không có | 1. Hiển thị lịch sử sử dụng sân. 2. Filter theo thời gian, sân. | | Pass | Medium | Medium | |

---

## 11. MODULE QUẢN TRỊ - QUẢN LÝ BOOKING (Admin Bookings)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_BOOK_001 | 1. Đã đăng nhập với role admin. 2. Có booking trong hệ thống. | 1. Truy cập /admin/bookings. | Không có | 1. Hiển thị tất cả booking. 2. Filter theo trạng thái, ngày, sân. | | Pass | Medium | Medium | |
| TC_ADMIN_BOOK_002 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/bookings. 2. Chỉnh sửa booking. | - Booking: BK001 - Giờ mới: 10:00-12:00 | 1. Cập nhật booking thành công. 2. Thông tin mới hiển thị đúng. | | Pass | High | High | |
| TC_ADMIN_BOOK_003 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/bookings. 2. Hủy booking. 3. Xác nhận. | - Booking: BK001 | 1. Hủy booking thành công. 2. Trạng thái: Đã hủy. | | Pass | High | High | |
| TC_ADMIN_CAL_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/bookings/calendar. | Không có | 1. Hiển thị lịch live với booking. 2. Có thể xem theo ngày/tuần/tháng. | | Pass | Medium | Medium | |
| TC_ADMIN_CONF_001 | 1. Đã đăng nhập với role admin. 2. Có booking xung đột. | 1. Truy cập /admin/bookings/conflicts. | Không có | 1. Hiển thị danh sách xung đột booking. 2. Có công cụ giải quyết xung đột. | | Pass | High | High | |
| TC_ADMIN_POL_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/bookings/policies. 2. Cấu hình chính sách hủy. | - Thời gian hủy miễn phí: 24h - Phí hủy muộn: 50% | 1. Lưu chính sách thành công. 2. Áp dụng cho booking mới. | | Pass | High | High | |
| TC_ADMIN_CHKIN_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/bookings/checkin. | Không có | 1. Hiển thị danh sách check-in hôm nay. 2. Trạng thái check-in/out. | | Pass | Medium | Medium | |
| TC_ADMIN_BERR_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/bookings/errors. | Không có | 1. Hiển thị booking lỗi. 2. Chi tiết lỗi và công cụ xử lý. | | Pass | High | High | |

---

## 12. MODULE QUẢN TRỊ - TÀI CHÍNH (Admin Finance)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_DEP_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/deposits. | Không có | 1. Hiển thị danh sách đặt cọc. 2. Trạng thái, số tiền, thời gian. | | Pass | High | High | |
| TC_ADMIN_CPAY_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/counter. | Không có | 1. Hiển thị thanh toán tại quầy. 2. Chi tiết giao dịch. | | Pass | High | High | |
| TC_ADMIN_OT_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/overtime. | Không có | 1. Hiển thị phí phát sinh quá giờ. 2. Chi tiết phí, booking liên quan. | | Pass | High | High | |
| TC_ADMIN_FVOUCH_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/vouchers. 2. Tạo voucher mới. | - Mã: GIAM30 - Giảm giá: 30% - Hạn sử dụng: 30/04/2026 - Số lượng: 100 | 1. Tạo voucher thành công. 2. Voucher xuất hiện trong danh sách. | | Pass | High | High | |
| TC_ADMIN_WALLET_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/wallets. | Không có | 1. Hiển thị danh sách ví người dùng. 2. Số dư, lịch sử giao dịch. | | Pass | High | High | |
| TC_ADMIN_REVR_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/revenue. 2. Xem báo cáo doanh thu. | - Thời gian: Tháng 3/2026 | 1. Hiển thị báo cáo doanh thu chi tiết. 2. Biểu đồ, bảng số liệu. | | Pass | High | High | |
| TC_ADMIN_TERR_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/finance/transactions. | Không có | 1. Hiển thị lỗi giao dịch. 2. Công cụ xử lý lỗi. | | Pass | High | High | |

---

## 13. MODULE QUẢN TRỊ - THỐNG KÊ (Admin Statistics)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_STAT_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/statistics. | Không có | 1. Hiển thị tổng quan thống kê. 2. Các chỉ số chính. | | Pass | Medium | Medium | |
| TC_ADMIN_BANA_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/statistics/bookings. | Không có | 1. Hiển thị phân tích booking. 2. Biểu đồ xu hướng, tỉ lệ hủy. | | Pass | Medium | Medium | |
| TC_ADMIN_OCC_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/statistics/occupancy. | Không có | 1. Hiển thị thống kê công suất sân. 2. Tỉ lệ sử dụng theo giờ/ngày. | | Pass | Medium | Medium | |
| TC_ADMIN_PERF_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/statistics/performance. | Không có | 1. Hiển thị hiệu suất từng sân. 2. Doanh thu, tỉ lệ sử dụng. | | Pass | Medium | Medium | |
| TC_ADMIN_REPT_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/statistics/reports. 2. Tạo báo cáo. | - Loại: Doanh thu - Thời gian: Q1/2026 - Định dạng: PDF | 1. Tạo báo cáo thành công. 2. Tải xuống file báo cáo. | | Pass | Medium | High | |

---

## 14. MODULE QUẢN TRỊ - CÀI ĐẶT (Admin Settings)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ADMIN_SET_001 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/settings. 2. Cập nhật cài đặt hệ thống. | - Tên hệ thống: Badminton Pro - Ngôn ngữ: Tiếng Việt - Múi giờ: UTC+7 | 1. Lưu cài đặt thành công. 2. Cài đặt mới được áp dụng. | | Pass | Medium | High | |
| TC_ADMIN_SET_002 | 1. Đã đăng nhập với role admin. | 1. Truy cập /admin/settings. 2. Cấu hình email thông báo. | - SMTP Server: smtp.gmail.com - Port: 587 - Email: noreply@example.com | 1. Cấu hình email thành công. 2. Gửi email test OK. | | Pass | High | High | |

---

## 15. MODULE PHÂN QUYỀN & BẢO MẬT (Authorization)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_AUTH_001 | 1. Chưa đăng nhập. | 1. Truy cập trực tiếp /admin/dashboard. | Không có | 1. Chuyển hướng đến trang /unauthorized hoặc /login. 2. Không cho phép truy cập. | | Pass | High | High | Kiểm tra ProtectedRoute hoạt động đúng. |
| TC_AUTH_002 | 1. Đăng nhập với role user. | 1. Truy cập trực tiếp /admin/dashboard. | Không có | 1. Chuyển hướng đến trang /unauthorized. 2. Không cho phép truy cập admin. | | Pass | High | High | |
| TC_AUTH_003 | 1. Đăng nhập với role user. | 1. Truy cập trực tiếp /staff/dashboard. | Không có | 1. Chuyển hướng đến /unauthorized. 2. Không cho phép truy cập staff. | | Pass | High | High | |
| TC_AUTH_004 | 1. Đăng nhập với role staff. | 1. Truy cập trực tiếp /owner/dashboard. | Không có | 1. Chuyển hướng đến /unauthorized. 2. Không cho phép truy cập owner. | | Pass | High | High | |
| TC_AUTH_005 | 1. Đăng nhập với role user. | 1. Truy cập trực tiếp /owner/revenue. | Không có | 1. Chuyển hướng đến /unauthorized. | | Pass | High | High | |

---

## 16. MODULE XỬ LÝ LỖI (Error Handling)

| Test Case ID | Tiền điều kiện/Điều kiện trước | Các bước kiểm thử | Dữ liệu nhập | Các kết quả mong muốn | Các kết quả thực | Trạng thái thực thi | Mức độ Bug | Độ ưu tiên xử lý Bug | Các file đính kèm |
|---|---|---|---|---|---|---|---|---|---|
| TC_ERR_001 | 1. Hệ thống hoạt động. | 1. Truy cập URL không tồn tại (/xyz123). | Không có | 1. Hiển thị trang 404 Not Found. 2. Có link quay về trang chủ. | | Pass | Low | Low | |
| TC_ERR_002 | 1. Hệ thống hoạt động. | 1. Truy cập /unauthorized. | Không có | 1. Hiển thị trang Unauthorized. 2. Thông báo không có quyền truy cập. | | Pass | Low | Low | |

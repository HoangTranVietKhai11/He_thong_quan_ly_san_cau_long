# Kịch bản Người dùng (User Scenarios) - Hệ thống Quản lý Sân Cầu lông

Dưới đây là các kịch bản sử dụng (User Flows) chi tiết dành cho 3 nhóm người dùng chính của hệ thống: **Khách hàng (User)**, **Nhân viên (Staff)**, và **Quản lý (Admin)**.

---

## 1. MÀN 1: KHÁCH HÀNG (Người đến thuê sân)
*Mục tiêu: Đặt sân nhanh chóng, theo dõi lịch sử và thanh toán thuận tiện.*

### Kịch bản 1.1: Trải nghiệm Đặt sân mới
1. **Truy cập & Đăng nhập:** Khách hàng vào trang chủ, lướt xem các hình ảnh sân, bảng giá. Bấm "Đăng nhập" hoặc "Đăng ký" tài khoản mới.
2. **Kiểm tra lịch sân:** Khách chọn mục "Lịch sân trực tiếp". Họ có thể chọn ngày trên lịch để xem các khung giờ nào đang "Còn trống", khung nào "Đã đặt" (không hiển thị tên người khác để bảo mật) hoặc "Bảo trì".
3. **Chốt sân:** Khách click vào một ô "Còn trống" (ví dụ: Sân số 1, khung 18:00 - 19:00). Một hộp thoại hiện lên thông báo giá tiền tạm tính.
4. **Áp dụng khuyến mãi (Tùy chọn):** Khách có thể nhập mã Voucher (nếu có) trước khi xác nhận.
5. **Thanh toán:** Click "Chốt sân ngay". Hệ thống lập tức nhảy sang trang **Thanh toán**. Khách có thể mở app Ngân hàng để quét QR code chuyển khoản, hoặc đơn giản là đóng trình duyệt và đến sân trả tiền mặt.
6. **Kiểm tra lại:** Khách vào mục "Lịch của tôi" để xem lại mã đơn đặt sân và trạng thái thanh toán (Chưa thanh toán / Đã thanh toán).

### Kịch bản 1.2: Hủy lịch (Chưa thanh toán)
1. Do lịch bận đột xuất, khách vào mục "Lịch của tôi", tìm đến đơn hàng ngày mai. 
2. Khách bấm nút "Hủy". Hệ thống hỏi lại để xác nhận. 
3. Sau khi hủy, ô lưới lịch tại màn hình "Lịch sân trực tiếp" lập tức tự động đổi từ màu xanh (Đã đặt) thành màu trắng (Còn trống) để khách khác có thể đặt.

---

## 2. MÀN 2: NHÂN VIÊN TẠI QUẦY (Staff)
*Mục tiêu: Đón khách, thu tiền thật nhanh, quản lý các thiết bị tại sân.*

### Kịch bản 2.1: Đón khách đã đặt trước qua Web
1. **Đầu ca:** Nhân viên tới quầy, mở máy ảo/Tablet, đăng nhập tài khoản Staff.
2. **Trực lịch:** Nhân viên mở trang "Lịch sân trực tiếp". Trên màn hình của Staff, họ có thể **nhìn thấy tên và số điện thoại** của người đặt (khác với khách hàng bị ẩn).
3. **Khách hàng đến:** Khách đọc tên hoặc số điện thoại. Nhân viên tra cứu nhanh trên màn hình.
4. **Nhận tiền:** Khách đưa tiền mặt hoặc chuyển khoản tại quầy. Nhân viên bấm chữ "Xác nhận đã nhận tiền mặt" cho đơn đặt đó. Trạng thái lập tức chuyển thành "Fully Paid" (Hoàn tất).

### Kịch bản 2.2: Đặt sân giúp khách vãng lai
1. Khách đi ngang qua, không có tài khoản, ghé vào quầy hỏi: *"Em ơi còn sân nào đánh luôn bây giờ không?"*
2. Staff xem nhanh lịch trực tiếp. Thấy Sân số 3 đang trống, Staff lập tức thao tác "Đặt sân tại quầy". 
3. Chọn khung giờ, nhập tên (tạm thời) của khách để ghi nhớ, nhận tiền mặt và chốt. Hệ thống đồng bộ để không ai đặt trùng trên Web nữa.

### Kịch bản 2.3: Quản lý thiết bị / Ca làm việc
1. Hết ca, Staff vào mục "Kho vật tư" để đếm lại số lượng quả cầu mẻ, vợt cho thuê. Ghi nhận hao hụt (nếu có).
2. Staff kiểm tra "Quản lý ca" để xem ngày mai mình giao ca với ai, giờ nào.

---

## 3. MÀN 3: CHỦ SÂN / QUẢN TRỊ VIÊN (Admin)
*Mục tiêu: Kiểm soát doanh thu, chống thất thoát, điều phối hoạt động kinh doanh.*

### Kịch bản 3.1: Kiểm tra tình hình kinh doanh mỗi sáng
1. Sáng uống cafe, Chủ sân mở Laptop đăng nhập Admin.
2. Trang đầu tiên đập vào mắt là **Bảng Điều Khiển (Dashboard)**.
3. Chủ sân có thể kiểm tra: Doanh thu hôm qua là bao nhiêu? (Bao nhiêu tiền mặt do Staff thu, bao nhiêu chuyển khoản). Sân nào đông khách nhất? Giờ "Vàng" nào bị trống nhiều để ra mắt khuyến mãi?

### Kịch bản 3.2: Điều chỉnh chiến lược (Tạo Khuyến mãi)
1. Chủ sân nhận thấy khung giờ 9:00 sáng đến 15:00 chiều các ngày trong tuần đang rất vắng khách (Tỷ lệ lấp đầy thấp).
2. Vào mục "Quản lý Voucher", Chủ sân tạo mã `TRUAVANG20`, giảm 20% cho các đơn đặt sân trong khung giờ này.
3. Vào "Sự kiện & Bảng tin", lập một bài thông báo: *"Khuyến mãi khủng giờ hành chính..."* để tất cả khách hàng nhìn thấy khi đăng nhập.

### Kịch bản 3.3: Bảo trì đột xuất
1. Sân số 2 bị đứt lưới hoặc hỏng đèn, không thể cho thuê.
2. Admin hoặc Staff vào quản lý thiết lập trạng thái Sân số 2 thành "Bảo trì" cho ngày hôm nay. 
3. Các đơn khách đã lỡ đặt trên Sân 2 sẽ được Admin liên hệ đổi sang Sân 3 hoặc hoàn tiền. Lưới lịch của Sân 2 tự động chuyển thành màu Xám để không ai đặt được nữa.

# Kịch bản Kiểm thử - Module Người Dùng (User)

**Dự án:** Hệ thống Quản lý và Đặt sân Cầu lông
**Phiên bản:** 1.0 | **Ngày:** 11/03/2026

---

## KỊCH BẢN 1: Người dùng mới đăng ký và đặt sân lần đầu

**Bối cảnh:**
Anh Minh là khách hàng mới, chưa có tài khoản. Anh muốn đặt sân cầu lông cho buổi tối thứ 6.

**Diễn biến:**

Anh Minh truy cập vào trang chủ của hệ thống, thấy danh sách sân và muốn đặt. Hệ thống yêu cầu đăng nhập, anh nhấn vào "Đăng ký ngay". Anh điền đầy đủ thông tin: họ tên, email, số điện thoại, mật khẩu và xác nhận mật khẩu.

Sau khi đăng ký thành công, hệ thống tự động đăng nhập và chuyển anh vào trang Dashboard. Anh thấy giao diện tổng quan, chưa có booking nào.

Anh vào mục **"Đặt sân"**, chọn Sân 2, chọn ngày thứ 6 tuần này (14/03/2026), chọn khung giờ 18:00-20:00. Hệ thống hiển thị giá 180.000đ. Anh nhấn **"Xác nhận đặt sân"**. Hệ thống xác nhận booking thành công và gửi thông báo về trang Notifications.

**Kết quả cần kiểm tra:**
- Đăng ký tài khoản thành công, chuyển hướng đúng trang
- Booking được tạo với đầy đủ thông tin
- Thông báo booking hiển thị trong /user/notifications
- Trạng thái booking: "Đã xác nhận"

---

## KỊCH BẢN 2: Người dùng quên mật khẩu và lấy lại truy cập

**Bối cảnh:**
Chị Lan đã có tài khoản nhưng quên mật khẩu. Chị cần lấy lại để đăng nhập xem lịch sân đã đặt.

**Diễn biến:**

Chị Lan vào trang đăng nhập, nhập đúng email nhưng nhập sai mật khẩu nhiều lần. Hệ thống hiển thị thông báo lỗi. Chị nhấn vào **"Quên mật khẩu?"**, nhập email của mình và nhấn "Gửi email khôi phục".

Hệ thống hiển thị thông báo thành công: *"Email khôi phục đã được gửi đến lan@example.com"*. Chị kiểm tra hộp thư, mở link khôi phục, đặt mật khẩu mới và đăng nhập lại thành công.

**Kết quả cần kiểm tra:**
- Đăng nhập sai nhiều lần: hiển thị lỗi đúng, không bị khóa đột ngột
- Trang quên mật khẩu hoạt động đúng
- Email khôi phục được gửi thành công
- Đăng nhập với mật khẩu mới thành công

---

## KỊCH BẢN 3: Người dùng đặt sân định kỳ hàng tuần

**Bối cảnh:**
Anh Hùng chơi cầu lông mỗi tối thứ 3 và thứ 5, muốn đặt sân cố định 4 tuần liên tiếp để không bị mất chỗ.

**Diễn biến:**

Anh đăng nhập, vào mục **"Đặt sân định kỳ"** (/user/recurring). Anh chọn Sân 1, khung giờ 19:00-21:00, bắt đầu từ thứ 3 ngày 18/03/2026, chu kỳ **hàng tuần**, kéo dài **4 tuần**.

Hệ thống hiển thị tóm tắt: 4 booking ngày 18/3, 25/3, 1/4, 8/4. Tổng tiền: 4 × 200.000đ = 800.000đ. Anh xác nhận. Hệ thống kiểm tra xem các slot có trống không — nếu tuần nào bị conflict, hệ thống thông báo cho anh biết.

**Kết quả cần kiểm tra:**
- 4 booking được tạo đúng ngày, đúng giờ
- Tổng tiền tính đúng
- Nếu có conflict: hiển thị thông báo rõ ràng
- Tất cả 4 booking xuất hiện trong /user/bookings

---

## KỊCH BẢN 4: Người dùng hủy booking và nhận hoàn tiền

**Bối cảnh:**
Chị Mai đặt sân ngày 20/03 nhưng có việc đột xuất phải hủy. Chị muốn hủy và biết có được hoàn tiền không.

**Diễn biến:**

Chị vào **/user/bookings**, tìm booking ngày 20/03, nhấn nút **"Hủy"**. Hệ thống hiển thị popup xác nhận kèm thông tin chính sách hủy:

> *"Hủy trước 24h: hoàn 100% | Hủy trong vòng 24h: hoàn 50% | Hủy trong vòng 2h: không hoàn"*

Chị xác nhận hủy. Hệ thống cập nhật trạng thái booking sang **"Đã hủy"** và gửi thông báo xác nhận hủy kèm thông tin hoàn tiền.

**Kết quả cần kiểm tra:**
- Popup hiển thị đúng chính sách hủy
- Booking chuyển trạng thái "Đã hủy" ngay lập tức
- Thông báo hủy xuất hiện trong Notifications
- Số tiền hoàn lại được tính đúng theo chính sách

---

## KỊCH BẢN 5: Người dùng sử dụng voucher giảm giá khi đặt sân

**Bối cảnh:**
Anh Tú nhận được voucher **GIAM30** giảm 30% từ chương trình khuyến mãi. Anh muốn dùng voucher này để đặt sân cuối tuần.

**Diễn biến:**

Anh vào mục **"Voucher của tôi"** (/user/vouchers) để xem danh sách voucher hiện có. Anh thấy voucher GIAM30 còn hiệu lực đến 31/03/2026.

Anh chuyển sang trang đặt sân, chọn Sân 3 ngày Chủ nhật 16/03, khung giờ 07:00-09:00. Giá gốc 200.000đ. Anh nhập mã **GIAM30** vào ô voucher. Hệ thống tự động áp dụng giảm 30%, còn **140.000đ**. Anh xác nhận đặt sân.

**Kết quả cần kiểm tra:**
- Voucher hiển thị đúng thông tin (mã, mức giảm, hạn sử dụng)
- Áp dụng voucher: giá giảm đúng 30%
- Nếu nhập sai mã: hiển thị lỗi rõ ràng
- Nếu voucher hết hạn: hiển thị "Voucher đã hết hạn"
- Booking tạo với giá đã giảm 140.000đ

---

## KỊCH BẢN 6: Người dùng đăng ký vào danh sách chờ

**Bối cảnh:**
Anh Dũng muốn đặt Sân 1 lúc 08:00-10:00 sáng thứ 7 nhưng slot này đã đầy. Anh muốn được thông báo nếu có người hủy.

**Diễn biến:**

Anh vào **/user/calendar** xem lịch. Slot 08:00-10:00 thứ 7 hiển thị màu đỏ (đã đặt). Anh nhấn vào slot đó, hệ thống hiển thị thông báo *"Slot này đã được đặt — Bạn có muốn đăng ký danh sách chờ không?"*.

Anh nhấn **"Đăng ký chờ"**. Hệ thống xác nhận: *"Bạn đang ở vị trí #2 trong danh sách chờ"*. Anh có thể vào /user/waitlist để xem và quản lý các slot đang chờ.

Khi người đặt trước hủy slot, hệ thống tự động gửi thông báo đến anh Dũng với link xác nhận đặt trong vòng 30 phút.

**Kết quả cần kiểm tra:**
- Slot đã đặt hiển thị màu đỏ rõ ràng trên lịch
- Đăng ký waitlist thành công, hiển thị vị trí thứ mấy
- Danh sách chờ quản lý được tại /user/waitlist
- Thông báo tự động khi slot trống (nếu backend hỗ trợ)

---

## KỊCH BẢN 7: Người dùng xem lịch và quản lý booking qua Calendar

**Bối cảnh:**
Chị Hoa muốn xem toàn bộ lịch đặt sân của mình trong tháng 3 để lên kế hoạch trước.

**Diễn biến:**

Chị vào **/user/calendar**. Mặc định lịch hiển thị tuần hiện tại với các slot theo màu: xanh lá (trống), xanh dương (booking của chị), đỏ (booking của người khác).

Chị chuyển sang chế độ xem **tháng** để thấy tổng thể. Chị nhìn thấy các ngày mình đã đặt được đánh dấu. Chị nhấn vào một booking của mình trên lịch, hệ thống hiển thị chi tiết: sân, giờ, trạng thái, giá.

Chị muốn đặt thêm buổi sáng thứ 6, nhấn vào slot trống 06:00-08:00, form đặt sân hiện ra với ngày và giờ đã điền sẵn. Chị xác nhận đặt nhanh chóng.

**Kết quả cần kiểm tra:**
- Calendar hiển thị đúng, phân biệt màu rõ ràng
- Chuyển đổi chế độ xem (ngày/tuần/tháng) hoạt động
- Nhấn vào booking trên lịch: xem được chi tiết
- Nhấn vào slot trống: mở form đặt sân với thông tin điền sẵn

---

## KỊCH BẢN 8: Người dùng cập nhật thông tin cá nhân và đổi mật khẩu

**Bối cảnh:**
Anh Nam vừa đổi số điện thoại mới và muốn cập nhật trong hệ thống. Anh cũng muốn đổi mật khẩu cho bảo mật hơn.

**Diễn biến:**

Anh vào **/user/profile**. Anh thấy đầy đủ thông tin cá nhân. Anh cập nhật số điện thoại từ 0901234567 thành 0909999777, nhấn "Lưu". Hệ thống xác nhận cập nhật thành công.

Tiếp theo anh kéo xuống phần **"Đổi mật khẩu"**, nhập mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới. Nhấn "Lưu mật khẩu". Hệ thống xác nhận và yêu cầu anh đăng nhập lại.

Anh đăng nhập với mật khẩu mới — thành công. Thử đăng nhập với mật khẩu cũ — thất bại như mong đợi.

**Kết quả cần kiểm tra:**
- Cập nhật SĐT lưu đúng, reload lại vẫn giữ nguyên
- Đổi mật khẩu thành công: MK mới hoạt động, MK cũ thất bại
- Nếu nhập sai MK cũ: hiển thị lỗi "Mật khẩu cũ không đúng"
- Nếu MK mới ≠ xác nhận: hiển thị lỗi ngay

---

## KỊCH BẢN 9: Kiểm tra phân quyền — User không truy cập được trang Admin/Staff

**Bối cảnh:**
Một người dùng tò mò muốn thử truy cập vào trang quản trị để xem có vào được không.

**Diễn biến:**

Người dùng đã đăng nhập với tài khoản role **user**. Họ thử nhập thẳng URL:
- `http://localhost:5173/admin/dashboard` → Hệ thống chuyển hướng sang `/unauthorized`
- `http://localhost:5173/staff/dashboard` → Hệ thống chuyển hướng sang `/unauthorized`
- `http://localhost:5173/owner/revenue` → Hệ thống chuyển hướng sang `/unauthorized`

Trang Unauthorized hiển thị thông báo *"Bạn không có quyền truy cập trang này"* và nút "Về trang chủ".

**Kết quả cần kiểm tra:**
- Truy cập `/admin/*` bị chặn, chuyển về `/unauthorized`
- Truy cập `/staff/*` bị chặn, chuyển về `/unauthorized`
- Truy cập `/owner/*` bị chặn, chuyển về `/unauthorized`
- Trang Unauthorized hiển thị đúng thông báo

---

## KỊCH BẢN 10: Người dùng đăng xuất và kiểm tra bảo mật phiên

**Bối cảnh:**
Anh Khoa dùng máy tính dùng chung tại quán cà phê. Sau khi đặt sân xong, anh muốn đăng xuất để bảo mật.

**Diễn biến:**

Anh nhấn vào avatar/tên của mình ở góc trên bên phải, chọn **"Đăng xuất"**. Hệ thống xác nhận đăng xuất và chuyển anh về trang `/login`.

Anh thử nhấn nút **Back** của trình duyệt — hệ thống không cho vào lại Dashboard mà chuyển về `/login`. Người dùng tiếp theo dùng máy đó không thể truy cập tài khoản anh Khoa.

**Kết quả cần kiểm tra:**
- Đăng xuất xong chuyển về `/login`
- Nhấn Back sau đăng xuất: không vào lại được Dashboard
- Token bị xóa khỏi localStorage sau đăng xuất
- Không thể dùng token cũ để gọi API sau đăng xuất

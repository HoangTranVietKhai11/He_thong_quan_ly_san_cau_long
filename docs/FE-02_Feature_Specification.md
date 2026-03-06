# FE-02: Quản Lý Sân & Hạ Tầng — Đặc Tả Chức Năng

---

## 1. Chức năng này dùng để làm gì?

Module **FE-02** là phần quản lý toàn bộ cơ sở vật chất của sân cầu lông. Cụ thể:

- **Admin** có thể thêm, sửa, xóa sân; cấu hình giá thuê theo từng khung giờ; lên lịch bảo trì và xem báo cáo sử dụng sân.
- **Nhân viên (Staff)** theo dõi trạng thái sân theo thời gian thực qua sơ đồ mặt bằng và kiểm soát thiết bị trong kho.
- **Khách hàng (User)** tìm kiếm và xem sân phù hợp với ngày, giờ và loại sân mình muốn.

Nếu không có module này, hệ thống không biết có bao nhiêu sân, sân nào đang bận, giá là bao nhiêu, kho còn thiết bị gì — tức là toàn bộ hoạt động vận hành sẽ bị tê liệt.

---

## 2. Actor / Roles (Đối tượng sử dụng)

### 👤 Admin (Quản trị viên)
- Người duy nhất có quyền **tạo và xóa sân**.
- Người duy nhất có quyền **định giá** cho các khung giờ.
- Người duy nhất có quyền **lên lịch bảo trì** và xem toàn bộ **lịch sử sử dụng sân**.

### 👔 Staff (Nhân viên vận hành)
- Xem **sơ đồ mặt bằng** để biết sân nào đang trống / đang dùng / đang bảo trì.
- Quản lý **kho thiết bị** (vợt, cầu, lưới, đèn, ...) và báo cáo hư hỏng.
- Hỗ trợ khách tìm kiếm sân nhưng **không được** thêm/xóa/sửa thông tin sân.

### 🙋 User (Khách hàng)
- Tìm kiếm sân theo ngày, giờ, loại.
- Xem thông tin và giá sân trước khi đặt.
- **Không thao tác** được với hệ thống quản lý phía sau.

---

## 3. Purpose (Mục đích)

Module FE-02 được xây dựng nhằm giải quyết 6 vấn đề chính:

1. **Quản lý tập trung:** Thay vì dùng Excel hay sổ tay, tất cả thông tin sân (tên, loại, giá, trạng thái, ảnh) đều nằm trong một hệ thống duy nhất.

2. **Giá linh hoạt theo giờ:** Sân cầu lông thường có giá khác nhau vào buổi sáng sớm, giờ cao điểm chiều tối và các giờ đặc biệt. Module cho phép cấu hình điều này dễ dàng.

3. **Nhân viên không cần chạy ra sân để kiểm tra:** Sơ đồ mặt bằng real-time hiển thị đúng sân nào đang dùng, đang bảo trì hay còn trống — nhân viên tại quầy lễ tân thấy được ngay trên màn hình.

4. **Bảo trì chủ động, không gây bất ngờ:** Khi lên lịch bảo trì, hệ thống tự kiểm tra xem có booking nào bị trùng không và hiển thị cảnh báo để Admin/Staff xử lý kịp thời.

5. **Kiểm soát thiết bị:** Nhân viên biết ngay khi nào cần nhập thêm cầu lông, vợt hay đèn thay thế mà không cần đi kiểm tra kho thủ công.

6. **Phân tích kinh doanh:** Admin thấy được sân nào được đặt nhiều nhất, giờ nào doanh thu cao nhất để có chiến lược kinh doanh tốt hơn.

---

## 4. Interface (Mô tả giao diện từng trang)

### 📋 Trang Admin: Danh sách sân (`/admin/courts`)

**Hiển thị:** Bảng danh sách tất cả sân với các cột: Tên sân, Loại sân, Trạng thái, Giá/giờ, Hành động.

**Thao tác được:**
- Nhấn nút **"Thêm sân"** → mở hộp thoại để điền thông tin sân mới.
- Nhấn nút **"Sửa"** trên từng hàng → mở hộp thoại để chỉnh sửa.
- Nhấn nút **"Xóa"** → hệ thống hỏi xác nhận trước khi xóa.

**Màu sắc trạng thái:** Xanh lá = Sẵn sàng | Xanh dương = Đang sử dụng | Đỏ = Đang bảo trì | Xám = Đóng cửa.

---

### 💰 Trang Admin: Cấu hình Giá (`/admin/courts/pricing`)

**Hiển thị:** Ma trận hiển thị 17 khung giờ trong ngày (từ 06:00 đến 23:00), mỗi ô được tô màu theo mức giá.

**Thao tác được:**
- Chỉnh sửa giá cho từng mức: Thấp điểm / Cao điểm / Giờ VIP.
- Bật/tắt **Giờ Vàng** (toggle) → toàn bộ giá tự động tăng thêm 10%.

**Lưu ý:** Giá mới chỉ áp dụng cho booking tạo sau thời điểm thay đổi. Booking cũ giữ nguyên giá.

---

### 🗺️ Trang Admin/Staff: Sơ đồ mặt bằng (`/admin/courts/floor-plan`)

**Hiển thị:** Lưới ô vuông đại diện cho từng sân, màu ô tương ứng với trạng thái sân.

**Thao tác được:**
- Click vào ô sân → mở hộp thoại hiển thị: khách đang đặt là ai, số điện thoại, giờ bắt đầu/kết thúc.
- Đổi trạng thái sân trực tiếp từ hộp thoại (ví dụ: từ "Sẵn sàng" sang "Bảo trì").

---

### 🔧 Trang Admin: Lịch bảo trì (`/admin/courts/maintenance`)

**Hiển thị:** Danh sách lịch bảo trì với thông tin sân, ngày, giờ, kỹ thuật viên phụ trách, chi phí dự kiến.

**Thao tác được:**
- Thêm lịch bảo trì mới bằng cách điền vào form.
- Nếu khung giờ bảo trì trùng với booking đã có → **hệ thống cảnh báo rõ ràng** danh sách khách hàng bị ảnh hưởng.

---

### 📊 Trang Admin: Lịch sử sử dụng sân (`/admin/courts/history`)

**Hiển thị:** Bảng danh sách các lượt đặt sân đã hoàn thành, kèm thống kê tổng hợp và biểu đồ doanh thu theo sân.

**Thao tác được:**
- Lọc theo sân cụ thể, khoảng thời gian, hoặc loại sân.

---

### 📦 Trang Staff: Quản lý thiết bị (`/staff/equipment`)

**Hiển thị:** Bảng các loại thiết bị trong kho: tên, số lượng hiện tại, ngưỡng tối thiểu, vị trí lưu trữ, nhà cung cấp.

**Trạng thái cảnh báo:**
- `Đủ hàng` (xanh): Số lượng trên ngưỡng tối thiểu.
- `Sắp hết` (vàng): Số lượng thấp hơn ngưỡng tối thiểu.
- `Hết hàng` (đỏ): Số lượng = 0 → Banner đỏ nổi bật xuất hiện ở đầu trang.

**Thao tác được:**
- Chỉnh số lượng tồn kho trực tiếp trên bảng.
- Mở form báo hỏng → ghi số lượng hư hỏng → hệ thống tự trừ vào kho.

---

### 🔍 Trang User: Tìm kiếm sân (`/user/dashboard`)

**Hiển thị:** Form tìm kiếm với 3 ô lọc: Ngày, Khung giờ, Loại sân. Sau khi tìm → hiển thị thẻ sân phù hợp có đủ thông tin.

**Thao tác được:**
- Nhấn **"Đặt ngay"** trên thẻ sân → chuyển sang quy trình đặt sân (FE-03).

---

## 5. Data Processing (Luồng xử lý dữ liệu)

Phần này mô tả hệ thống làm gì "bên trong" khi người dùng thực hiện hành động:

**Khi Admin thêm sân:**
> Người dùng điền form → Hệ thống kiểm tra tên có trùng không → Nếu không trùng: lưu vào cơ sở dữ liệu, cập nhật danh sách, cập nhật sơ đồ mặt bằng → Hiện thông báo "Thêm thành công".

**Khi Admin thay đổi giá:**
> Admin chỉnh giá hoặc bật/tắt Giờ Vàng → Hệ thống tính lại toàn bộ bảng giá theo giờ → Lưu vào cơ sở dữ liệu → Áp dụng ngay cho mọi booking mới từ thời điểm đó.

**Khi Admin tạo lịch bảo trì:**
> Admin chọn sân + ngày + giờ → Hệ thống kiểm tra xem có booking nào bị trùng không → Nếu có: hiển thị danh sách cảnh báo → Admin xác nhận → Lưu lịch bảo trì → Sân tự đổi sang trạng thái "Bảo trì".

**Khi Staff cập nhật tồn kho:**
> Staff nhập số lượng mới → Hệ thống kiểm tra số lượng >= 0 → Lưu → So sánh với ngưỡng tối thiểu → Hiển thị/tắt cảnh báo tương ứng.

**Khi User tìm kiếm sân:**
> User điền ngày + giờ + loại sân → Hệ thống lọc các sân đang ở trạng thái "Sẵn sàng" trong khung giờ đó → Trả về danh sách kết quả sắp xếp theo giá tăng dần.

---

## 6. Function Detail (Chi tiết từng chức năng)

### FE-02.1 — Thêm / Sửa thông tin sân
- Form có các trường: Tên sân *(bắt buộc)*, Loại sân *(bắt buộc)*, Giá/giờ *(bắt buộc)*, Mô tả, Vị trí, Danh sách tiện ích.
- Hệ thống so sánh tên mới với toàn bộ sân hiện có (không phân biệt chữ hoa/thường). Nếu trùng → báo lỗi và không lưu.
- Sau khi lưu thành công: hộp thoại tự đóng, bảng danh sách cập nhật ngay.

### FE-02.2 — Upload ảnh sân
- Cho phép upload tối đa 5 ảnh, mỗi ảnh tối đa 5MB, chỉ chấp nhận định dạng JPG, PNG, WebP.
- Ảnh được xem trước ngay sau khi chọn file.
- Ảnh đầu tiên sẽ được dùng làm ảnh đại diện (thumbnail) trong danh sách.

### FE-02.3 — Phân loại sân
- 3 loại: **Standard** (sân thường), **VIP** (sân cao cấp), **Double** (sân đôi).
- Mỗi loại có màu badge riêng để dễ nhận diện trong danh sách và sơ đồ.

### FE-02.4 — Cấu hình giá động
- 3 mức giá:
  - **Thấp điểm** (06:00–09:00 và 14:00–17:00): giá rẻ nhất.
  - **Cao điểm** (17:00–21:00): giá trung bình.
  - **Giờ VIP** (09:00–14:00 và 21:00–23:00): giá cao nhất.
- **Toggle Giờ Vàng:** bật lên → tất cả mức giá tăng thêm 10%.

### FE-02.5 — Sơ đồ mặt bằng real-time
- Refresh dữ liệu tự động mỗi 30 giây để giữ thông tin luôn cập nhật.
- Click ô sân → xem thông tin booking và đổi trạng thái sân nếu cần.

### FE-02.6 — Lịch bảo trì
- Trước khi lưu: hệ thống kiểm tra toàn bộ booking trong khoảng thời gian bảo trì.
- Nếu phát hiện booking trùng → hiện danh sách chi tiết (tên khách, giờ đặt, SĐT).
- Sau khi lưu: sân tự chuyển sang `maintenance`. Khi đánh dấu hoàn thành: sân tự chuyển về `available`.

### FE-02.7 — Tìm kiếm sân nâng cao
- Chỉ trả về sân `available` trong khung giờ đã chọn — không hiển thị sân bảo trì hoặc đã có người đặt.
- Nếu không có sân phù hợp → hiện thông báo thay vì để trang trống.

### FE-02.9 — Lịch sử sử dụng sân
- Thống kê tự tính: Tổng số lượt đặt, Tổng doanh thu, Thời lượng trung bình, Sân được đặt nhiều nhất, Khung giờ hot nhất.
- Có biểu đồ cột thể hiện doanh thu theo từng sân.

### FE-02.10 — Quản lý thiết bị tồn kho
- Cảnh báo tự động so sánh `quantity` với `minQuantity` sau mỗi lần cập nhật.
- Khi `quantity = 0`: banner đỏ xuất hiện ở đầu trang, không thể bỏ qua.

---

## 7. Validation (Kiểm tra dữ liệu đầu vào)

Trước khi lưu bất kỳ thông tin nào, hệ thống kiểm tra:

| Trường dữ liệu | Điều kiện hợp lệ |
|---|---|
| Tên sân | Không để trống, tối đa 100 ký tự, không trùng tên sân đã có |
| Loại sân | Phải chọn một trong: Standard / VIP / Double |
| Giá/giờ | Số nguyên dương, tối thiểu 10.000 VNĐ |
| Ảnh upload | JPG / PNG / WebP, tối đa 5MB/ảnh, tối đa 5 ảnh |
| Ngày bảo trì | Phải từ ngày hôm nay trở đi |
| Thời lượng bảo trì | Từ 1 đến 24 giờ |
| Số lượng tồn kho | Không được âm (>= 0) |
| Ngày tìm kiếm sân | Phải từ ngày hôm nay trở đi |

---

## 8. Business Rules (Quy tắc nghiệp vụ)

Đây là những quy tắc không thể bỏ qua, được áp dụng xuyên suốt module:

1. **Không được xóa sân đang có booking:** Nếu sân vẫn còn lịch đặt chưa hoàn thành, nút "Xóa" sẽ bị vô hiệu hóa và có giải thích lý do.

2. **Thay đổi giá không ảnh hưởng booking cũ:** Booking đã được xác nhận trước đó luôn giữ mức giá tại thời điểm đặt. Chỉ booking mới mới áp dụng giá mới.

3. **Bảo trì có thể ghi đè booking (nhưng phải xác nhận):** Hệ thống cảnh báo nhưng không ngăn cản. Admin vẫn có thể tạo bảo trì trong giờ đã có booking — nhưng phải tự liên hệ khách để sắp xếp lại.

4. **Giờ Vàng áp dụng cho tất cả sân:** Không thể bật Giờ Vàng riêng cho một sân. Khi bật, mọi sân đều tăng giá 10%.

5. **Sân bảo trì / đóng cửa không xuất hiện trong kết quả tìm kiếm của User.**

6. **Số lượng tồn kho không thể âm:** Dù Admin hay Staff nhập thủ công, giá trị -1 hay số âm bất kỳ sẽ bị từ chối.

7. **User không thể truy cập trang Admin/Staff:** Hệ thống chặn theo role, chuyển hướng về trang phù hợp nếu truy cập sai quyền.

---

## 9. Functionalities (Tổng hợp chức năng)

| Mã chức năng | Tên | Ai dùng |
|---|---|---|
| FE-02.1 | Thêm / Sửa sân, kiểm tra trùng tên | Admin |
| FE-02.2 | Upload ảnh sân | Admin |
| FE-02.3 | Phân loại sân (Standard / VIP / Double) | Admin |
| FE-02.4 | Cấu hình giá động + Giờ Vàng | Admin |
| FE-02.5 | Sơ đồ mặt bằng + đổi trạng thái sân | Admin, Staff |
| FE-02.6 | Tạo / xem lịch bảo trì, cảnh báo booking trùng | Admin |
| FE-02.7 | Tìm kiếm sân nâng cao theo ngày/giờ/loại | User, Staff |
| FE-02.8 | Sơ đồ mặt bằng xem nhanh (Staff) | Staff |
| FE-02.9 | Lịch sử sử dụng sân + thống kê + biểu đồ | Admin |
| FE-02.10 | Quản lý thiết bị tồn kho + cảnh báo sắp hết | Staff |

---

## 10. Normal Cases (Trường hợp thông thường — hệ thống hoạt động đúng)

**Trường hợp 1:** Admin thêm sân "Sân 9" chưa tồn tại trong hệ thống.
> ✅ Hệ thống lưu thành công, "Sân 9" xuất hiện trong bảng danh sách và sơ đồ mặt bằng ngay lập tức.

**Trường hợp 2:** Admin bật Giờ Vàng lúc 15:00.
> ✅ Toàn bộ mức giá tăng 10%. Các khách đặt sân từ 15:00 trở đi sẽ thấy giá mới. Khách đặt trước đó không bị ảnh hưởng.

**Trường hợp 3:** Admin tạo lịch bảo trì cho "Sân 3" vào ngày mai, khoảng thời gian này không có ai đặt.
> ✅ Lịch bảo trì được tạo ngay, "Sân 3" chuyển sang trạng thái đỏ trên sơ đồ mặt bằng. Không có cảnh báo nào.

**Trường hợp 4:** Staff nhập lại số lượng cầu lông từ 3 lên 15 hộp (ngưỡng tối thiểu là 10).
> ✅ Số lượng được cập nhật, badge chuyển từ "Sắp hết" sang "Đủ hàng", không còn cảnh báo.

**Trường hợp 5:** User tìm sân vào thứ 7 khung giờ 17:00–18:00, loại Standard.
> ✅ Hệ thống trả về danh sách các sân Standard còn trống trong khung giờ đó, sắp xếp theo giá.

---

## 11. Abnormal Cases (Trường hợp bất thường — hệ thống xử lý khi có vấn đề)

**Trường hợp 1:** Admin thêm sân tên "Sân 1" — tên đã tồn tại.
> ❌ Hệ thống không lưu, hiện thông báo lỗi: *"Tên sân đã tồn tại. Vui lòng chọn tên khác."* Form vẫn giữ nguyên nội dung để Admin sửa.

**Trường hợp 2:** Admin muốn xóa "Sân 2" đang có 3 booking chưa hoàn thành.
> ❌ Nút "Xóa" bị vô hiệu hóa và hiện tooltip: *"Không thể xóa sân đang có booking chưa hoàn thành."*

**Trường hợp 3:** Admin tạo lịch bảo trì "Sân 4" từ 17:00–19:00, nhưng trong giờ đó có 2 booking.
> ⚠️ Hệ thống không tự động hủy booking mà hiện bảng cảnh báo: *"2 booking sẽ bị ảnh hưởng: [Nguyễn Văn A - 17:00, Trần Thị B - 18:00]."* Admin xác nhận → lịch bảo trì vẫn được tạo nhưng Admin phải tự liên hệ khách.

**Trường hợp 4:** Staff nhập số lượng thiết bị là -5.
> ❌ Hệ thống không lưu, hiện thông báo: *"Số lượng không được nhỏ hơn 0."*

**Trường hợp 5:** User tìm kiếm sân vào ngày 01/01/2024 (đã qua).
> ❌ Hệ thống không cho chọn ngày quá khứ trong date picker. Nếu nhập thủ công → hiện thông báo: *"Vui lòng chọn ngày từ hôm nay trở đi."*

**Trường hợp 6:** User tìm kiếm sân vào thứ 7 khung giờ 17:00–18:00 nhưng tất cả sân đều đã có người đặt.
> ⚠️ Không hiển thị lỗi đỏ, thay vào đó hiện thông báo thân thiện: *"Không tìm thấy sân trống trong khung giờ này. Hãy thử ngày hoặc giờ khác."*

**Trường hợp 7:** Upload ảnh sân file .docx sai định dạng.
> ❌ Hệ thống từ chối file, hiện thông báo: *"Chỉ hỗ trợ định dạng JPG, PNG, WebP."*

**Trường hợp 8:** Upload ảnh sân file 8MB (quá giới hạn 5MB).
> ❌ Hệ thống từ chối file, hiện thông báo: *"Ảnh quá lớn. Kích thước tối đa là 5MB."*

**Trường hợp 9:** Mất kết nối internet khi đang tải sơ đồ mặt bằng.
> ⚠️ Trang hiển thị skeleton loading (hiệu ứng chờ), sau 10 giây không có dữ liệu thì hiện thông báo: *"Không thể kết nối. Kiểm tra mạng và thử lại."*

**Trường hợp 10:** Giá sân nhập là 0 hoặc số âm.
> ❌ Hệ thống không lưu, hiện thông báo: *"Giá phải lớn hơn 0 VNĐ."*

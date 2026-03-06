# FE-02: Quản Lý Sân & Hạ Tầng - System Diagrams

Tài liệu này chứa các biểu đồ hệ thống cho module quản lý sân và hạ tầng (FE-02).

## 1. Use Case Diagram

Biểu đồ mô tả các chức năng chính của người dùng, nhân viên và quản trị viên đối với module quản lý sân.

```mermaid
flowchart LR
    Admin((Quản trị viên))
    Staff((Nhân viên))
    User((Khách hàng))

    subgraph FE02 ["FE-02: Quản lý Sân & Hạ tầng"]
        direction TB
        UC1([Quản lý phòng/sân])
        UC2([Upload ảnh & Phân loại sân])
        UC3([Cấu hình giá & Giờ vàng])
        UC4([Xem Sơ đồ mặt bằng Real-time])
        UC5([Quản lý lịch bảo trì])
        UC6([Xem lịch sử sử dụng sân])
        UC7([Quản lý thiết bị & Tồn kho])
        UC8([Tìm kiếm sân nâng cao])
        UC9([Xem thông tin sân])
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    
    Staff --> UC4
    Staff --> UC7
    Staff --> UC8
    Staff --> UC9

    User --> UC8
    User --> UC9
```

## 2. Activity Diagram: Quy trình Thêm và Bảo trì Sân

Quy trình mô tả chuỗi hành động khi Admin thêm sân mới hoặc tạo lịch bảo trì.

```mermaid
flowchart TD
    Start((Bắt đầu)) --> ActionType{Chọn hành động?}
    
    ActionType -->|Thêm Sân| Add1[Admin nhập thông tin sân]
    Add1 --> AddCheck{Sân đã tồn tại?}
    AddCheck -->|Có| AddErr[Báo lỗi trùng tên] --> End1(((Kết thúc)))
    AddCheck -->|Không| AddSave[Lưu thông tin & Upload ảnh]
    AddSave --> AddClass[Phân loại sân VIP/Standard]
    AddClass --> AddDB[Tạo dữ liệu vào hệ thống] --> End1
    
    ActionType -->|Lịch Bảo Trì| Maint1[Admin chọn Sân/Ngày/Giờ]
    Maint1 --> MaintCheck{Trùng lịch Booking?}
    MaintCheck -->|Có Booking| MaintWarn[Cảnh báo & Đổi trạng thái lịch đặt]
    MaintWarn --> MaintSave[Lưu lịch bảo trì]
    MaintCheck -->|Trống lịch| MaintSave
    MaintSave --> StatusChange[Đổi trạng thái sân 'Bảo Trì'] --> End1
```

## 3. User Flow: Quản lý Giá & Tồn Kho

Luồng thao tác của người dùng trên UI khi thay đổi giá năng động hoặc kiểm tra tồn kho.

```mermaid
flowchart TD
    A[Admin Dashboard] --> B[Vào trang Cấu hình Giá]
    B --> C{Chọn thao tác?}
    C -->|Bật/Tắt Giờ Vàng| D[Click Toggle Giờ Vàng]
    C -->|Chỉnh Giá Cơ Bản| E[Chỉnh sửa Tiers]
    D --> F[Matrix giá tự động tính +10%]
    E --> F
    F --> G[Lưu cấu hình]
    G --> H[Cập nhật UI báo giá]

    I[Staff Dashboard] --> J[Vào trang Thiết bị]
    J --> K{Kiểm tra tồn kho?}
    K -->|Số lượng ít hơn Tối thiểu| L[Hiển thị Alert Sắp hết hàng]
    K -->|Hư hỏng| M[Mở form báo hỏng]
    M --> N[Ghi nhận hư hỏng & Cập nhật kho]
    L --> O[Gửi yêu cầu nhập hàng mới cho Admin]
```

## 4. Screen Flow: Trải nghiệm Giao diện Sơ đồ mặt bằng & Lịch sử sử dụng

Sơ đồ luồng di chuyển giữa các màn hình trong module này.

```mermaid
flowchart LR
    subgraph Admin_Pages ["Trang Admin"]
        A1[Danh sách Sân] --> A2[Modal Thêm/Sửa Sân]
        A1 --> A3[Modal Upload Ảnh]
        
        B1[Sơ đồ mặt bằng] --> B2[Modal Chi tiết Sân]
        B2 --> B3[Hiển thị Thông tin Đặt sân]
        B2 --> B4[Form Đổi trạng thái Sân]
        
        C1[Lịch Bảo trì] --> C2[Thêm Bảo trì - Báo Cảnh báo Booking bị huỷ]
        
        D1[Lịch sử Sử dụng] --> D2[Lọc theo Sân/Thời gian/Loại]
    end

    subgraph User_Pages ["Trang Khách hàng"]
        U1[Trang chủ Khách hàng] --> U2[Form Tìm kiếm Sân nâng cao]
        U2 --> U3[Danh sách Kết quả Tìm kiếm]
        U3 --> U4[Luồng Đặt Sân]
    end
```

## 5. Class Diagram (Biểu đồ Lớp)

Cấu trúc dữ liệu các thực thể chính trong FE-02.

```mermaid
classDiagram
    class Court {
        +int id
        +String courtName
        +String type
        +String status
        +int pricePerHour
        +String location
        +String description
        +String[] extras
        +String[] images
    }

    class Booking {
        +int id
        +int courtId
        +String courtName
        +String customerName
        +String phone
        +String date
        +String startTime
        +String endTime
        +int totalPrice
        +String status
    }

    class MaintenanceSchedule {
        +int id
        +int courtId
        +String courtName
        +String date
        +String startTime
        +int durationHours
        +String assignee
        +int estimatedCost
        +String status
        +String notes
    }

    class PricingTier {
        +String name
        +int price
        +String color
    }

    class TimeSlot {
        +int id
        +String start
        +String end
        +String label
        +String tier
        +bool isGoldenHour
    }

    class EquipmentItem {
        +int id
        +String name
        +int quantity
        +int minQuantity
        +String unit
        +String location
        +String supplier
        +String lastUpdated
    }

    class UsageRecord {
        +int id
        +int courtId
        +String courtName
        +String date
        +String customer
        +String timeSlot
        +int duration
        +int price
    }

    Court "1" --> "*" Booking : có đặt sân
    Court "1" --> "*" MaintenanceSchedule : có bảo trì
    Court "1" --> "*" UsageRecord : ghi nhận lịch sử dụng
    TimeSlot "*" --> "1" PricingTier : thuộc mức giá
```


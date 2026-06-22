# 🧪 HƯỚNG DẪN KIỂM THỬ GIAO DIỆN (UI/UX TESTING GUIDE)

Tài liệu này hướng dẫn chi tiết các bước kiểm thử thủ công (Manual Testing) và kiểm thử nghiệp vụ cho hai phân hệ cốt lõi: **Quản lý suất chiếu (Showtime Management)** dành cho Admin và **Sơ đồ ghế tương tác (Interactive Seat Map)** dành cho khách hàng.

---

## 🔑 1. Tài khoản kiểm thử (Test Credentials)

Trước khi thực hiện kiểm thử, khởi chạy ứng dụng Frontend (Cổng 5173) và Backend (Cổng 8080) và đăng nhập bằng các tài khoản seed mặc định:

| Vai trò (Role) | Email đăng nhập | Mật khẩu | Mục tiêu kiểm thử |
|---|---|---|---|
| **ADMIN** | `admin@example.com` | `admin123` | Quản lý phòng, ghế, suất chiếu, lên lịch hàng loạt. |
| **CUSTOMER A** | `customer@example.com` | `customer123` | Đặt vé, chọn ghế, xem đếm ngược giữ ghế. |
| **CUSTOMER B** | `staff@example.com` | `staff123` | Trình duyệt ẩn danh để test khóa ghế song song. |

---

## 📺 2. Hướng dẫn test màn hình Quản lý suất chiếu (Showtime Management)

Màn hình này nằm ở đường dẫn dành cho quản trị: `http://localhost:5173/admin/showtimes`.

### Kịch bản 1: Xem danh sách và Lọc suất chiếu
* **Các bước thực hiện:**
  1. Đăng nhập với tài khoản **ADMIN**.
  2. Truy cập menu **Quản lý suất chiếu** ở sidebar (hoặc vào thẳng `http://localhost:5173/admin/showtimes`).
  3. Kiểm tra danh sách suất chiếu hiển thị theo ngày hiện tại dưới dạng lưới (Grid) hoặc danh sách (List).
  4. Chọn bộ lọc **Phim** hoặc bộ lọc **Phòng chiếu** ở thanh công cụ.
  5. Chọn các tab ngày khác nhau ở thanh lịch ngang phía trên.
* **Kết quả kỳ vọng:**
  * Danh sách lọc chính xác theo các tiêu chí đã chọn.
  * Suất chiếu hiển thị đầy đủ thông tin: Tên phim, phòng chiếu, giờ bắt đầu/kết thúc, giá vé STANDARD, và tag trạng thái.

### Kịch bản 2: Tạo suất chiếu thủ công
* **Các bước thực hiện:**
  1. Nhấn nút **+ Thêm suất chiếu** để mở Modal tạo mới.
  2. Chọn một bộ phim từ dropdown (ví dụ: *Kẻ Ẩn Danh*).
  3. Chọn rạp (`NASA Landmark 81`) và phòng chiếu (ví dụ: `Phòng chiếu IMAX`).
  4. Nhập thời gian bắt đầu chiếu (ví dụ: `19:30` ngày mai).
  5. Nhập giá vé:
     * Giá vé cơ bản (STANDARD): `85,000 VND`
     * Giá VIP: `120,000 VND`
     * Giá COUPLE: `160,000 VND`
  6. Bấm **Lưu suất chiếu**.
* **Kết quả kỳ vọng:**
  * Giờ kết thúc suất chiếu phải được tự động tính toán dựa trên thời lượng phim + 15 phút đệm dọn phòng.
  * Tạo thành công và hiển thị suất chiếu mới trong danh sách ở trạng thái Nháp (`DRAFT`).

### Kịch bản 3: Quy trình chuyển đổi trạng thái suất chiếu
* **Các bước thực hiện:**
  1. Tìm suất chiếu vừa tạo ở trạng thái **Nháp** (`DRAFT`).
  2. Bấm nút chuyển trạng thái sang **Sắp chiếu** (`SCHEDULED`).
  3. Tiếp tục bấm nút chuyển trạng thái sang **Mở bán** (`OPEN_FOR_BOOKING`).
  4. Thử bấm nút chuyển sang **Hủy suất** (`CANCELLED`).
* **Kết quả kỳ vọng:**
  * Hệ thống cập nhật trạng thái ngay lập tức trên UI.
  * Việc chuyển đổi trạng thái tuân thủ đúng quy tắc: `DRAFT` → `SCHEDULED` → `OPEN_FOR_BOOKING` → `SOLD_OUT` / `FINISHED` / `CANCELLED`.
  * Sau khi chuyển sang `CANCELLED` hoặc `FINISHED`, suất chiếu không thể chuyển ngược lại trạng thái mở bán.

### Kịch bản 4: Tự động lên lịch chiếu hàng loạt (Auto-generate Showtimes)
* **Các bước thực hiện:**
  1. Nhấn nút **Lên lịch tự động** ở góc trên bên phải màn hình quản lý.
  2. Điền thông tin cấu hình vào form:
     * Ngày bắt đầu & kết thúc: Chọn ngày mai.
     * Chọn phim: Tích chọn ít nhất 2 bộ phim.
     * Chọn phòng chiếu: Tích chọn cả phòng `IMAX` và `VIP`.
     * Khung giờ hoạt động: Từ `08:00` đến `23:30`.
     * Nhập giá vé mặc định (Base Price: `80,000`, VIP: `120,000`, Couple: `160,000`).
     * Thời gian dọn phòng (`intervalMinutes`): `15` phút.
  3. Bấm **Xem trước lịch chiếu** (Preview).
  4. Kiểm tra danh sách suất chiếu được hệ thống đề xuất chia ca thông minh.
  5. Nhấn **Lưu lịch chiếu chính thức**.
* **Kết quả kỳ vọng:**
  * Lịch chiếu đề xuất không bị xung đột thời gian (không đè lên nhau trong cùng một phòng).
  * Lưu thành công và toàn bộ các suất chiếu mới xuất hiện trong danh sách quản lý.

---

## 💺 3. Hướng dẫn test màn hình Sơ đồ ghế tương tác (Interactive Seat Map)

Màn hình này xuất hiện trong luồng mua vé của khách hàng: `http://localhost:5173/booking`.

### Kịch bản 1: Hiển thị sơ đồ ghế động
* **Các bước thực hiện:**
  1. Đăng nhập tài khoản **CUSTOMER A**.
  2. Tại trang chủ, chọn phim *Kẻ Ẩn Danh*, nhấn **Mua vé**.
  3. Chọn suất chiếu ngày hôm nay lúc **19:30 (Phòng IMAX)**.
  4. Quan sát giao diện sơ đồ ghế hiển thị trên màn hình.
* **Kết quả kỳ vọng:**
  * Sơ đồ hiển thị 8 hàng ghế (A đến H) chuẩn:
    * Hàng A-D: Ghế Standard (màu xanh dương nhạt).
    * Hàng E-F: Ghế VIP (màu vàng/tím).
    * Hàng G-H: Ghế đôi Couple (hiển thị dạng ghế đôi liền nhau màu hồng).
  * Màn hình có bảng chú thích rõ ràng về màu sắc và trạng thái ghế.

### Kịch bản 2: Khóa giữ ghế thời gian thực (Real-time Seat Locking)
* **Các bước thực hiện:**
  1. Trên trình duyệt 1 (đăng nhập **CUSTOMER A**), nhấn chọn ghế **E5** và **E6**.
  2. Mở trình duyệt 2 (ẩn danh, đăng nhập **CUSTOMER B**) hoặc dùng một thiết bị khác truy cập vào đúng suất chiếu IMAX đó.
  3. Quan sát trạng thái ghế **E5** và **E6** trên trình duyệt 2.
  4. Trở lại trình duyệt 1, bỏ chọn ghế **E5**. Quan sát thay đổi trên trình duyệt 2.
* **Kết quả kỳ vọng:**
  * Trên trình duyệt 1: Ghế E5 và E6 chuyển sang màu xanh lá cây (Đang chọn), hiển thị đồng hồ đếm ngược giữ ghế 5 phút.
  * Trên trình duyệt 2: Ghế E5 và E6 chuyển sang màu đỏ (Đang bị khóa bởi người khác) và không thể click chọn được.
  * Khi trình duyệt 1 bỏ chọn E5: Ghế E5 lập tức quay lại màu vàng (VIP - Available) trên cả hai trình duyệt (trong vòng tối đa 10 giây nhờ cơ chế polling tự động).

### Kịch bản 3: Giới hạn chọn tối đa 8 ghế
* **Các bước thực hiện:**
  1. Trên màn hình chọn ghế, liên tục click chọn các ghế: A1, A2, A3, A4, A5, A6, A7, A8.
  2. Thử click chọn tiếp ghế thứ 9 (A9).
* **Kết quả kỳ vọng:**
  * Hệ thống chặn không cho chọn ghế thứ 9.
  * Hiển thị thông báo Toast cảnh báo lỗi: *"Bạn chỉ được chọn tối đa 8 ghế trong một lần đặt."*

### Kịch bản 4: Hết thời gian đếm ngược giữ ghế (TTL Expiry)
* **Các bước thực hiện:**
  1. Click chọn ghế **F5** để bắt đầu đếm ngược từ `05:00`.
  2. Giữ nguyên màn hình đặt vé đó và chờ trong 5 phút cho đến khi bộ đếm giờ về `00:00`.
* **Kết quả kỳ vọng:**
  * Ngay khi đồng hồ về `00:00`, ghế F5 tự động được giải phóng (hủy chọn, quay lại màu vàng mặc định).
  * Hiển thị thông báo Toast lỗi: *"Hết thời gian giữ ghế. Vui lòng chọn lại."*
  * Trạng thái khóa ghế trong DB bị xóa bỏ, các khách hàng khác có thể chọn lại ghế F5 này.

### Kịch bản 5: Tính toán hóa đơn tạm tính và Tiến hành thanh toán
* **Các bước thực hiện:**
  1. Chọn 1 ghế STANDARD (hàng A) và 1 ghế VIP (hàng E).
  2. Quan sát bảng tóm tắt đặt vé (Ticket Summary) ở cột bên phải.
  3. Kiểm tra tổng số tiền tạm tính hiển thị.
  4. Bấm nút **Tiếp tục**.
* **Kết quả kỳ vọng:**
  * Hóa đơn hiển thị chính xác tên ghế (ví dụ: `A1`, `E1`), loại ghế, và giá tiền (STANDARD: 85,000, VIP: 120,000).
  * Tổng tiền tạm tính phải hiển thị chính xác: `85,000 + 120,000 = 205,000 VND`.
  * Sau khi bấm Tiếp tục, hệ thống chuyển sang trang chọn Đồ ăn/Nước uống (Concessions) và giữ nguyên thông tin vé.

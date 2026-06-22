# 📋 ĐẶC TẢ YÊU CẦU HỆ THỐNG (SYSTEM REQUIREMENTS) - THDPV Movie Theater

Tài liệu này xác định các yêu cầu chức năng (Functional Requirements) và yêu cầu phi chức năng (Non-functional Requirements) cho toàn bộ hệ thống đặt vé xem phim trực tuyến THDPV Movie Theater.

---

## 👥 1. Các Vai trò trong Hệ thống (Actors & Roles)

Hệ thống hỗ trợ 3 nhóm đối tượng người dùng chính với phân quyền truy cập khác nhau:

1. **Khách hàng (CUSTOMER):**
   * Người dùng đăng nhập để xem thông tin phim, đặt vé trực tuyến, chọn ghế, thanh toán và tích điểm thành viên.
   * Xem lịch sử đặt vé cá nhân và quản lý hồ sơ tài khoản.
2. **Nhân viên (STAFF):**
   * Quản lý hoạt động hàng ngày tại rạp: Hỗ trợ soát vé bằng mã QR, cập nhật nhanh tình trạng phòng chiếu/ghế hỏng.
   * Tra cứu thông tin vé của khách hàng khi cần hỗ trợ.
3. **Quản trị viên (ADMIN):**
   * Có toàn quyền quản trị hệ thống: Quản lý danh mục phim, suất chiếu (Showtimes), phòng chiếu (Halls), và cấu hình sơ đồ ghế.
   * Quản lý tài khoản nhân viên (Staff) và tài khoản khách hàng.
   * Thống kê báo cáo doanh thu theo ngày, theo phim, theo rạp.

---

## ⚙️ 2. Yêu cầu Chức năng (Functional Requirements)

### **A. Phân hệ Xác thực & Quản lý Tài khoản (Authentication & Account Management)**
* **Đăng nhập (Login):**
  * Hỗ trợ đăng nhập qua Email và Mật khẩu.
  * Hỗ trợ chức năng "Ghi nhớ tài khoản" (Remember Me) lưu email vào LocalStorage.
  * Định hướng tích hợp đăng nhập qua bên thứ ba (Google OAuth, Apple ID).
* **Đăng ký (Register):**
  * Đăng ký tài khoản khách hàng mới với các thông tin: Họ tên, Email, Số điện thoại, Mật khẩu.
  * Kiểm tra độ mạnh mật khẩu (Password Strength) tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.
* **Khôi phục mật khẩu (Forgot & Reset Password):**
  * Cho phép người dùng gửi yêu cầu cấp mã khôi phục qua Email khi quên mật khẩu.
  * Cho phép đặt lại mật khẩu mới thông qua Token bảo mật gửi kèm link reset.
* **Quản lý thông tin cá nhân:**
  * Xem thông tin cá nhân và cập nhật thông tin (Họ tên, SĐT).
  * Xem điểm tích lũy thành viên.

### **B. Phân hệ Quản lý Phim, Phòng chiếu & Suất chiếu (Movies, Rooms & Showtimes Management)**
* **Quản lý danh sách phim:**
  * Hiển thị danh sách phim Đang chiếu và Sắp chiếu ở trang chủ.
  * Xem thông tin chi tiết phim: Trailer, Poster, Thể loại, Quốc gia, Thời lượng, Ngày khởi chiếu, Giới hạn độ tuổi (P, T13, T16, T18), Đánh giá (Rating), và Giá vé Online cơ bản.
* **Quản lý Phòng chiếu & Ghế (Dành cho Admin/Staff):**
  * Quản lý thông tin phòng (Thêm/Sửa phòng chiếu: Mã phòng, Tên phòng, Loại phòng gồm `STANDARD`, `VIP`, `IMAX`, Sức chứa). Sức chứa của phòng được tự động tính toán dựa trên số lượng ghế đang hoạt động (Active).
  * Quản lý cấu hình sơ đồ ghế:
    * Chức năng **Sinh sơ đồ ghế tự động (Generate Seat Map)**: Admin/Staff có thể sinh nhanh sơ đồ ghế chuẩn cho phòng chiếu. Cấu hình mặc định sinh 8 hàng (từ A đến H): hàng A-D là ghế Thường (STANDARD, 12 ghế/hàng), hàng E-F là ghế VIP (12 ghế/hàng), hàng G-H là ghế Đôi (COUPLE, 6 ghế/hàng).
    * Cập nhật thông tin chi tiết từng ghế: Cho phép thay đổi loại ghế, số ghế, hoặc tắt/mở trạng thái hoạt động của ghế vật lý (Trạng thái gồm `ACTIVE`, `DISABLED`, `MAINTENANCE` để xử lý các ghế bị hỏng hóc thực tế).
* **Quản lý Suất chiếu (Dành cho Admin/Staff):**
  * Khởi tạo suất chiếu đơn lẻ: Chọn phim, chọn rạp, chọn phòng chiếu, thời gian bắt đầu chiếu, và nhập giá vé cơ bản (Base Price), giá VIP (Vip Price), giá ghế đôi (Couple Price). Thời gian kết thúc suất chiếu được hệ thống tự động gợi ý dựa trên thời lượng phim.
  * Chức năng **Lên lịch chiếu tự động hàng loạt (Auto-generate Showtimes)**: Cho phép Admin nhập khoảng thời gian hoạt động của rạp (ví dụ: từ 08:00 đến 23:30), thời gian dọn phòng (Clean-up time), danh sách phim và phòng chiếu để hệ thống tự động tính toán và chia ca chiếu tối ưu. Admin có thể xem trước (Preview) lịch biểu dự kiến trước khi lưu chính thức vào cơ sở dữ liệu.
  * Cập nhật trạng thái suất chiếu: Hỗ trợ chuyển đổi trạng thái suất chiếu theo quy trình vận hành của rạp (Các trạng thái gồm: `DRAFT`, `SCHEDULED`, `OPEN_FOR_BOOKING`, `SOLD_OUT`, `FINISHED`, `CANCELLED`).
  * Danh sách suất chiếu phía Admin hỗ trợ lọc theo phim, rạp, phòng chiếu, ngày chiếu, và nhóm theo trạng thái hoặc theo phòng để dễ quản trị.

### **C. Phân hệ Đặt vé & Chọn ghế (Booking & Seat Selection)**
* **Sơ đồ phòng chiếu tương tác trực quan:**
  * Hiển thị giao diện sơ đồ ghế động của suất chiếu tương ứng với thực tế phòng chiếu (IMAX, VIP, STANDARD).
  * Phân biệt rõ các loại ghế bằng màu sắc và biểu tượng đặc trưng: Ghế Thường (STANDARD), Ghế VIP, Ghế Đôi (COUPLE).
  * Hiển thị rõ trạng thái thời gian thực của từng ghế: Ghế trống (`AVAILABLE`), Ghế đang được chọn bởi bản thân (`SELECTED` / `LOCKED_BY_ME`), Ghế đang bị khóa bởi người khác (`LOCKED_BY_OTHER`), Ghế đã có người mua thành công (`SOLD` / `BOOKED`), và Ghế hỏng (`DISABLED`).
* **Cơ chế Khóa ghế tạm thời thời gian thực (Real-time Seat Locking):**
  * Hỗ trợ đồng bộ hóa trạng thái ghế ngay lập tức khi người dùng click chọn ghế. Ghế sẽ chuyển sang trạng thái `LOCKED_BY_ME` trên trình duyệt của người dùng hiện tại và trạng thái `LOCKED_BY_OTHER` trên màn hình của tất cả những người dùng khác đang xem cùng suất chiếu đó.
  * Thời gian giữ ghế tối đa là **5 phút (300 giây)**. Màn hình hiển thị đồng hồ đếm ngược trực quan. Nếu quá 5 phút mà khách hàng chưa hoàn tất thanh toán, hệ thống sẽ tự động giải phóng ghế về trạng thái trống (`AVAILABLE`).
* **Tích điểm & Khuyến mãi:**
  * Áp dụng mã giảm giá (Voucher) khi thanh toán (Hỗ trợ giảm theo tỷ lệ phần trăm hoặc số tiền cố định).
  * Tích lũy điểm thưởng thành viên tự động sau khi đặt vé thành công và cho phép sử dụng điểm để thanh toán.

### **D. Phân hệ Thanh toán (Payment System - Dự kiến)**
* **Tích hợp cổng thanh toán:**
  * Hỗ trợ thanh toán điện tử qua Ví điện tử (MOMO, VNPAY) hoặc Thẻ nội địa/quốc tế.
  * Xử lý callback trạng thái thanh toán từ bên thứ ba để xác nhận vé lập tức.

---

## 🔒 3. Yêu cầu Phi Chức năng (Non-functional Requirements)

### **A. Bảo mật (Security)**
* **Xác thực:** Sử dụng cơ chế stateless JWT (JSON Web Token) để duy trì phiên làm việc.
* **Lưu trữ:** Mật khẩu của người dùng bắt buộc phải được mã hóa một chiều bằng thuật toán mạnh (ví dụ: `BCryptPasswordEncoder` trong Spring Security) trước khi lưu vào PostgreSQL.
* **Giao tiếp:** Toàn bộ kênh truyền dẫn thông tin giữa Client và Server phải sử dụng giao thức bảo mật HTTPS/TLS.
* **Phân quyền APIs:** Áp dụng phân quyền chặt chẽ cấp Method/Endpoint trên Spring Security (`@PreAuthorize` hoặc `securityMatchers`).

### **B. Hiệu năng & Khả năng mở rộng (Performance & Scalability)**
* **Thời gian phản hồi (Response Time):** Các API thông thường như tải danh sách phim, thông tin suất chiếu phải trả về kết quả trong dưới 500ms.
* **Tốc độ tải trang (Vấn đề FE):**
  * First Contentful Paint (FCP) < 1.5 giây.
  * Largest Contentful Paint (LCP) < 2.5 giây.
  * Áp dụng kỹ thuật Lazy Loading và Code Splitting đối với các Route lớn để tối ưu dung lượng tải lần đầu.
* **Tương thích cơ sở dữ liệu:** Hỗ trợ cơ chế khóa dữ liệu (Optimistic Locking hoặc Pessimistic Locking) đối với thao tác chọn ghế của suất chiếu để ngăn hiện tượng Race Condition (hai người đặt trùng một ghế cùng một giây).

### **C. Trải nghiệm người dùng (UX/UI & Accessibility)**
* **Responsive:** Website phải tối ưu hóa giao diện hiển thị trên 3 lớp thiết bị chính: Điện thoại di động (width >= 375px), Máy tính bảng (width >= 768px), và Máy tính để bàn (width >= 1200px).
* **Đồng bộ hiệu ứng:** Sử dụng Framer Motion để tạo các hoạt cảnh mở trang (Page transition), hiệu ứng hover thẻ, và hiệu ứng tải (Skeleton Loading) mượt mà ở mức 60 FPS.
* **Khả năng tiếp cận:** Áp dụng đầy đủ thẻ HTML5 ngữ nghĩa, thuộc tính ARIA cho các thành phần điều hướng phức tạp, hỗ trợ di chuyển biểu mẫu bằng phím Tab.


--- ( Bổ sung bên dưới )

## ⚖️ 4. Các Quy tắc Nghiệp vụ Đặc thù & Ràng buộc Hệ thống (Business Rules & Edge Cases)

Để đảm bảo tính chính xác về mặt logic phần mềm và ngăn chặn các lỗi tranh chấp dữ liệu, hệ thống bắt buộc phải thực thi các quy tắc ràng buộc sau:

### **A. Cơ chế Giữ ghế Tạm thời (Seat Locking Rules)**
* **Kích hoạt khóa:** Ngay khi khách hàng nhấn chọn ghế trên màn hình sơ đồ ghế Frontend, hệ thống sẽ gửi yêu cầu khóa ghế thông qua API `PUT /api/showtimes/locks`. Bản ghi giữ ghế sẽ được ghi nhận vào bảng `seat_locked` với các thông tin: `showtime_uuid`, `seat_uuid`, `user_uuid`, thời gian khóa (`locked_at`) và thời gian hết hạn (`expired_at`).
* **Thời gian giới hạn (TTL):** Thời gian giữ ghế tối đa là **5 phút (300 giây)** (hiển thị đếm ngược thời gian thực trên màn hình đặt vé). Trong thời gian này, các khách hàng khác truy cập cùng suất chiếu sẽ thấy các ghế này hiển thị màu đỏ ở trạng thái Đang bị khóa bởi người khác (`LOCKED_BY_OTHER`) và không thể chọn hay thao tác trên các ghế đó.
* **Giải phóng ghế (Unlock):**
  * *Trường hợp hết hạn đếm ngược:* Phía Frontend sẽ tự động gọi API giải phóng khóa ghế khi đồng hồ đếm ngược về 0. Đồng thời ở phía Backend, một Background Job quét định kỳ các bản ghi hết hạn (`expired_at < NOW()`) để tự động xóa các bản ghi giữ ghế trong bảng `seat_locked`, đưa trạng thái ghế về lại trống (`AVAILABLE`).
  * *Trường hợp chủ động hủy:* Nếu khách hàng bỏ chọn ghế, nhấn nút quay lại hoặc thoát luồng đặt vé, Frontend sẽ lập tức gửi yêu cầu đồng bộ để giải phóng các ghế đó.

### **B. Quy tắc Tránh Trùng Lịch Suất Chiếu (Showtime Conflict Rules)**
* **Ràng buộc phòng chiếu độc quyền:** Tại một phòng chiếu (`cinema_room`), không được phép có hai suất chiếu nào bị trùng lặp hoặc giao cắt về mặt thời gian.
* **Thời gian tối thiểu giữa các suất chiếu (Clean-up Time):** Khi tính toán thời lượng suất chiếu (giờ kết thúc = giờ bắt đầu + thời lượng phim), hệ thống phải cộng thêm một khoảng thời gian đệm tối thiểu là **15 phút** dành cho việc dọn dẹp vệ sinh phòng chiếu và chuẩn bị thiết bị cho suất chiếu tiếp theo.
* **Kiểm tra xung đột lịch (Conflict Detection):** Khi Admin tạo suất chiếu thủ công hoặc khi chạy tính năng tự động sinh suất chiếu (Auto-generate Showtimes), hệ thống bắt buộc phải kiểm tra xung đột: Suất chiếu mới dự kiến `[Start_New, End_New]` không được chồng chéo với bất kỳ khoảng thời gian hoạt động của suất chiếu nào đã tồn tại `[Start_Exist, End_Exist + 15 phút]` trong cùng một phòng chiếu. Nếu phát hiện xung đột, hệ thống sẽ trả về lỗi và chặn thao tác lưu.

### **C. Quy tắc Đổi điểm thưởng & Tích lũy (Loyalty & Promotion Rules)**
* **Tỷ lệ tích điểm:** Mỗi giao dịch đặt vé thành công sẽ được trích một tỷ lệ phần trăm cố định dựa trên tổng tiền hóa đơn thực tế để chuyển thành điểm thưởng (Score) lưu vào hồ sơ user.
* **Tỷ lệ quy đổi điểm:** Điểm thưởng có thể dùng để khấu trừ trực tiếp vào giá trị hóa đơn tiếp theo (Ví dụ cấu hình mặc định: 1 điểm = 1.000 VNĐ).
* **Ràng buộc hệ thống (Constraints):**
  * Không cho phép số dư điểm thưởng bị âm (`score >= 0`).
  * Điểm thưởng chỉ được khấu trừ tối đa bằng giá trị tiền mặt của vé xem phim (không áp dụng khấu trừ âm hoặc trả lại tiền mặt thừa cho khách hàng).
  * Trong trường hợp đơn hàng bị hủy/hoàn, số điểm đã tiêu thụ phải được hoàn lại và số điểm dự kiến tích lũy của đơn đó phải bị khấu trừ.

### **D. Quy định Hủy vé và Hoàn tiền (Cancellation & Refund Rules)**
* **Điều kiện hủy vé:** Khách hàng chỉ có quyền tự hủy vé trực tuyến hoặc yêu cầu nhân viên quầy hỗ trợ hủy vé trước giờ phim chiếu tối thiểu **60 phút**. Các vé thuộc suất chiếu đã diễn ra hoặc sắp diễn ra trong vòng 60 phút sẽ không thể hoàn hủy dưới mọi hình thức.
* **Quy trình hoàn tiền:** Khi lệnh hủy được chấp nhận, hệ thống phải thực hiện đồng bộ một chuỗi hành động: Chuyển trạng thái hóa đơn thành `REFUNDED`, giải phóng các ghế đã đặt về trạng thái trống, thu hồi điểm thưởng đã cộng của đơn đó và tạo bản ghi lịch sử hoàn tiền trong dịch vụ thanh toán để đối soát.
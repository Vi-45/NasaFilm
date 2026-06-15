# 🧪 HƯỚNG DẪN KIỂM THỬ GIAO DIỆN AUTH & NÚT ĐĂNG NHẬP GMAIL - NASAFILM

Tài liệu này hướng dẫn chi tiết cách thực hiện kiểm thử (Test Cases & Test Steps) các chức năng Xác thực (Đăng nhập, Đăng ký, OTP, Quên mật khẩu) và chức năng liên kết Đăng nhập nhanh bằng tài khoản Google (Gmail SSO).

---

## 🔑 1. Kế hoạch Kiểm thử & Đối tượng
* **Trình duyệt kiểm thử:** Google Chrome (khuyên dùng vì hỗ trợ cơ chế Google One-Tap và OAuth Popup tốt nhất).
* **Base URL:** `http://localhost:5173` (Frontend) và `http://localhost:8080` (Backend).
* **Mục tiêu:** Đảm bảo toàn bộ luồng Auth chuẩn xác, xử lý các trường hợp lỗi dữ liệu đầu vào (Zod validation), xử lý đúng các phản hồi từ server và tích hợp OAuth2 Google mượt mà.

---

## 📝 2. Các Ca Kiểm thử Chi tiết (Test Cases)

### Phân hệ 2.1: Đăng nhập bằng Email/Password (Login Page)

#### TC-01: Kiểm tra tính hợp lệ dữ liệu đầu vào (Zod Validation)
* **Các bước thực hiện:**
  1. Truy cập `http://localhost:5173/login`.
  2. Bỏ trống cả Email và Mật khẩu rồi nhấn "Đăng Nhập".
  3. Nhập Email sai định dạng (ví dụ: `test@domain`) và mật khẩu ngắn hơn 6 ký tự rồi nhấn "Đăng Nhập".
* **Kết quả mong đợi:**
  * Bỏ trống: Giao diện hiển thị lỗi dưới trường nhập: *"Email không được bỏ trống"* và *"Mật khẩu không được bỏ trống"*.
  * Nhập sai định dạng/ngắn: Hiển thị lỗi *"Email không hợp lệ"* và *"Mật khẩu tối thiểu phải từ 6 ký tự"*.

#### TC-02: Đăng nhập thành công với tài khoản đã kích hoạt
* **Các bước thực hiện:**
  1. Nhập tài khoản hợp lệ đã có trong database (ví dụ tài khoản admin seed sẵn: `admin@nasafilm.com` / mật khẩu: `admin123`).
  2. Nhấn "Đăng Nhập".
* **Kết quả mong đợi:**
  * Hiển thị thông báo Toast thành công: *"Welcome to NASA FILM!"*.
  * Ẩn spinner đăng nhập, tự động lưu thông tin user và access token vào LocalStorage.
  * Chuyển hướng về trang Dashboard Admin (`/admin`) vì tài khoản có quyền `ADMIN`.

#### TC-03: Ghi nhớ tài khoản (Remember Me)
* **Các bước thực hiện:**
  1. Nhập email đăng nhập bất kỳ.
  2. Tích chọn ô "Ghi nhớ đăng nhập".
  3. Đăng nhập thành công, sau đó tiến hành Đăng xuất (Logout).
  4. Quay lại trang đăng nhập.
* **Kết quả mong đợi:**
  * Trường Email tự động được điền sẵn email cũ từ LocalStorage (`rememberEmail`), ô checkbox "Ghi nhớ đăng nhập" giữ trạng thái được chọn.

---

### Phân hệ 2.2: Đăng ký & Xác thực OTP (Register Page)

#### TC-04: Kiểm tra tính hợp lệ dữ liệu đăng ký (Zod Validation)
* **Các bước thực hiện:**
  1. Truy cập `http://localhost:5173/register`.
  2. Bỏ trống các trường hoặc điền sai định dạng:
     - Nhập số điện thoại chữ cái hoặc ít hơn 10 số.
     - Chọn ngày sinh ở tương lai, hoặc ngày sinh nhỏ hơn 12 tuổi.
     - Không chọn giới tính hoặc không tích chọn đồng ý điều khoản dịch vụ.
  3. Nhấn "Đăng Ký".
* **Kết quả mong đợi:**
  * Hiển thị các lỗi validation tương ứng bằng tiếng Việt:
     - *"Số điện thoại phải gồm 10 chữ số..."*
     - *"Ngày sinh phải ở quá khứ"* hoặc *"Bạn phải từ 12 tuổi trở lên"*.
     - *"Giới tính không hợp lệ"* hoặc *"Bạn phải đồng ý với điều khoản"*.

#### TC-05: Đăng ký tài khoản mới thành công
* **Các bước thực hiện:**
  1. Truy cập `/register`.
  2. Nhập đầy đủ thông tin hợp lệ (Họ tên, Email chưa tồn tại, SĐT, Ngày sinh, Giới tính, Mật khẩu khớp nhau, và tích đồng ý điều khoản).
  3. Nhấn "Đăng Ký".
* **Kết quả mong đợi:**
  * Hiển thị Toast thông báo: *"Mã xác thực đã được gửi qua email"*.
  * Giao diện không chuyển trang mà giữ nguyên tại `/register` nhưng ẩn form đăng ký và render màn hình nhập mã OTP 6 số (Bước 2).
  * Mã OTP được gửi thành công về email người dùng.

#### TC-06: Xác thực OTP đăng ký tài khoản
* **Các bước thực hiện:**
  1. Tại màn hình nhập OTP ở Bước 2, nhập đúng mã 6 chữ số nhận được từ email.
  2. Nhấn "Xác Minh & Kích Hoạt Tài Khoản".
* **Kết quả mong đợi:**
  * Hiển thị Toast thông báo: *"Xác thực đăng ký thành công"*.
  * Hệ thống tự động chuyển hướng người dùng về màn hình đăng nhập (`/login`).
  * Trạng thái user trong database chuyển từ `PENDING_VERIFICATION` sang `ACTIVE`.

---

### Phân hệ 2.3: Đăng nhập nhanh bằng Google (Gmail SSO)

> [!IMPORTANT]
> Đây là tính năng kiểm thử trọng tâm cho sự liên kết giữa Google SDK trên Frontend và API xác thực trên Backend.

#### TC-07: Kết xuất nút đăng nhập Google
* **Các bước thực hiện:**
  1. Truy cập trang `/login`.
  2. Quan sát phần "Đăng nhập nhanh".
* **Kết quả mong đợi:**
  * Nút đăng nhập của Google ("Continue with Google") được load trực tiếp từ SDK Google và kết xuất đúng kích thước, nằm ở cuối form đăng nhập.

#### TC-08: Luồng đăng nhập Google thành công (Gmail SSO)
* **Các bước thực hiện:**
  1. Nhấn nút "Continue with Google".
  2. Trình duyệt mở ra một cửa sổ popup của Google hiển thị danh sách các tài khoản Gmail đã đăng nhập trên trình duyệt của bạn (hoặc form đăng nhập Gmail).
  3. Nhấn chọn tài khoản Gmail muốn sử dụng.
* **Kết quả mong đợi:**
  * Cửa sổ popup tự đóng lại.
  * Màn hình đăng nhập hiển thị trạng thái loading ("Đang đăng nhập...").
  * Frontend nhận ID Token từ Google gửi qua API `POST /api/auth/google`.
  * Đăng nhập thành công: Hiện thông báo Toast *"Welcome to NASA FILM!"* và chuyển hướng về trang chủ `/` (do tài khoản Gmail mặc định được tạo với vai trò `CUSTOMER`).

#### TC-09: Hủy luồng đăng nhập Google
* **Các bước thực hiện:**
  1. Nhấn nút "Continue with Google".
  2. Khi cửa sổ popup chọn tài khoản Gmail xuất hiện, nhấn dấu `[x]` ở góc cửa sổ hoặc click ra ngoài để hủy bỏ.
* **Kết quả mong đợi:**
  * Cửa sổ popup biến mất.
  * Ứng dụng Frontend không bị treo, không phát sinh lỗi crash màn hình, trạng thái loading tắt và cho phép người dùng nhấp chọn lại để đăng nhập lại bất cứ lúc nào.

#### TC-10: Tài khoản Google đã tồn tại trong database
* **Các bước thực hiện:**
  1. Sử dụng một tài khoản Gmail đã đăng nhập thành công trước đó để đăng nhập lại lần 2.
* **Kết quả mong đợi:**
  * Hệ thống đăng nhập thành công ngay lập tức mà không tạo thêm dòng dữ liệu mới trong database (chỉ cập nhật profile và gia hạn session).

#### TC-11: Cố gắng đặt lại mật khẩu cho tài khoản Google SSO
* **Các bước thực hiện:**
  1. Truy cập `/auth/forgot-password`.
  2. Nhập Email của tài khoản đăng ký qua Google SSO.
  3. Nhấn gửi yêu cầu reset mật khẩu.
* **Kết quả mong đợi:**
  * Backend từ chối xử lý và trả về lỗi. Frontend hiển thị thông báo: *"Tài khoản của bạn đã được liên kết với Google. Vui lòng đăng nhập qua Google."* (Đảm bảo an toàn tài khoản).

---

### Phân hệ 2.4: Trang Hồ sơ Cá nhân & Ẩn Cài đặt Bảo mật (Profile Page)

#### TC-12: Kiểm tra ẩn chức năng thay đổi mật khẩu đối với tài khoản Google SSO
* **Các bước thực hiện:**
  1. Đăng nhập hệ thống bằng nút Google.
  2. Truy cập vào trang quản lý thông tin cá nhân `/profile`.
  3. Quan sát menu sidebar bên trái và phần chi tiết hiển thị.
* **Kết quả mong đợi:**
  * Sidebar bên trái **không hiển thị** nút "Cài đặt bảo mật" (Security settings).
  * Mục "Phương thức đăng nhập" hiển thị rõ ràng chuỗi: *"Google Sign-In"*.
  * Cố gắng truy cập trực tiếp hoặc nhập link đổi mật khẩu (nếu có): Hệ thống không cho phép đổi mật khẩu, bảo vệ an toàn cho tài khoản OAuth2.

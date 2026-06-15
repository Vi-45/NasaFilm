# 📋 TỔNG HỢP TÀI LIỆU SPRINT 1 - THDPV MOVIE THEATER (NASAFILM)

Tài liệu này tổng kết toàn bộ kết quả phát triển dự án trong **Sprint 1 (Phân hệ Xác thực & Phân quyền, Hồ sơ Cá nhân & Quản trị Thành viên)** ở cả Client và Server, đồng thời liên kết toàn bộ tài liệu đặc tả kỹ thuật của Sprint 1.

---

## 📅 1. Thông tin Sprint 1
* **Tên Sprint:** Sprint 1 - Xây dựng nền tảng Xác thực & Quản trị Người dùng.
* **Thời gian thực hiện:** 01/06/2026 - 10/06/2026.
* **Mục tiêu chính:** 
  1. Xây dựng khung bảo mật Spring Security 6 & JWT Token.
  2. Triển khai đầy đủ luồng Đăng nhập, Đăng ký (OTP Email), Quên mật khẩu, và Đăng nhập nhanh Google (Gmail SSO).
  3. Xây dựng trang Hồ sơ cá nhân (Profile) và trang Quản lý thành viên dành cho Admin.

---

## 🏆 2. Các Kết quả Đã Đạt Được (Deliverables)

### 2.1. Phía Server (Spring Boot Backend)
* **Khung bảo mật:** Cấu hình thành công [SecurityConfig.java](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-be/src/main/java/com/thdpv/movietheater/security/SecurityConfig.java) (CORS, Phân quyền API, mã hóa mật khẩu BCrypt).
* **Quản lý Token:** Triển khai bộ lọc [JwtAuthTokenFilter.java](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-be/src/main/java/com/thdpv/movietheater/security/JwtAuthTokenFilter.java) và lớp [JwtUtils.java](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-be/src/main/java/com/thdpv/movietheater/security/JwtUtils.java) để tạo, giải mã, kiểm tra thời hạn JWT Access Token và Refresh Token.
* **Đăng ký & Xác thực OTP:** API gửi mã OTP 6 số qua email bằng Spring Mail và API `/register/verify` để kích hoạt tài khoản. Bổ sung các trường Ngày sinh (`dayOfBirth`) và Giới tính (`gender`) vào thực thể User và DTO đăng ký.
* **OAuth2 Google:** Tích hợp `GoogleIdTokenVerifier` để giải mã ID Token nhận từ Frontend, tạo mới user tự động dạng `GOOGLE` và cấp quyền mặc định là `CUSTOMER`.
* **Quản lý User & Admin:** Triển khai API lấy/sửa Profile cá nhân (hỗ trợ cập nhật Ngày sinh, Giới tính) và API Admin cập nhật trạng thái User (Active/Locked), cập nhật vai trò (Admin/Staff/Customer). Chặn đổi mật khẩu đối với tài khoản Google.

### 2.2. Phía Client (React Frontend)
* **Khung định tuyến:** Cấu hình hệ thống Route chính tại [App.jsx](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-fe/src/App.jsx) có tích hợp Auth Guards ([ProtectedRoute.jsx](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-fe/src/features/auth/components/ProtectedRoute.jsx)) bảo vệ các trang Admin/Staff. Các đường dẫn được làm gọn thành `/login` và `/register` thay vì nằm dưới tiền tố `/auth/*`.
* **Quản lý Trạng thái:** Tạo [AuthContext.jsx](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-fe/src/features/auth/store/AuthContext.jsx) lưu thông tin trạng thái đăng nhập toàn cục.
* **Interceptor tự động:** Tích hợp bộ chặn trong [authService.js](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-fe/src/features/auth/api/authService.js) để tự gắn `Authorization: Bearer <token>` vào request và tự gọi API gia hạn token khi có lỗi 401 Unauthorized.
* **Giao diện Auth:** Hoàn thiện 100% giao diện Đăng nhập ([LoginPage.jsx](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-fe/src/features/auth/pages/LoginPage.jsx)) tích hợp nút Google SDK, Đăng ký (với các trường bổ sung SĐT, Ngày sinh, Giới tính, cùng Zod validation tiếng Việt), Nhập OTP (ở bước 2 của form đăng ký), Quên mật khẩu, Đặt lại mật khẩu.
* **Giao diện Profile & Admin:** Trang cá nhân cập nhật thông tin/ảnh đại diện (tự động ẩn tab "Cài đặt bảo mật" khi đăng nhập bằng Google) và trang quản trị thành viên ([UsersPage.jsx](file:///d:/IT/TEAMJAVA/java_06_team_03/movie-theater-fe/src/features/admin/pages/UsersPage.jsx)) thay đổi trực quan trạng thái/role của người dùng kết nối API thực tế.

---

## 📚 3. Danh mục Tài liệu Sprint 1 (Sprint 1 Artifacts)

Dưới đây là liên kết trực tiếp đến các tài liệu được tổng hợp và xuất bản trong Sprint 1 này:

1. **[00_PROJECT_OVERVIEW.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/00_PROJECT_OVERVIEW.md) - Tổng quan dự án:** Kiến trúc tổng thể Client-Server, công nghệ sử dụng, cấu trúc thư mục và quy chuẩn thiết kế.
2. **[01_REQUIREMENTS.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/01_REQUIREMENTS.md) - Đặc tả yêu cầu:** Chi tiết các vai trò (Admin, Staff, Customer), yêu cầu chức năng xác thực, phi chức năng (bảo mật, hiệu năng) và các quy tắc nghiệp vụ rạp phim (giữ ghế, đổi điểm, hoàn vé).
3. **[02_DATABASE_DESIGN.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/02_DATABASE_DESIGN.md) - Thiết kế Cơ sở dữ liệu:** Sơ đồ ERD quan hệ thực thể PostgreSQL, mô tả chi tiết tất cả các bảng hiện tại (Xác thực) và các bảng mở rộng (Phim, Suất chiếu, Ghế, Combo, Đặt vé, Thanh toán).
4. **[03_API_DESIGN.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/03_API_DESIGN.md) - Thiết kế APIs:** Đặc tả cấu trúc Request/Response của các API Authentication, User Profile và đề xuất hệ thống API rạp phim cho Giai đoạn tiếp theo.
5. **[04_PROGRESS.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/04_PROGRESS.md) - Bảng tiến độ:** Theo dõi chi tiết danh sách công việc đã làm, đang làm và cần làm của các giai đoạn.
6. **[05_FRONTEND_RUN_GUIDE_GMAIL.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/05_FRONTEND_RUN_GUIDE_GMAIL.md) - Hướng dẫn chạy Frontend & Google Login:** Các bước thiết lập Node.js, file `.env.local`, cơ chế hoạt động của Google Identity SDK trên Client.
7. **[06_TEST_GUIDE_AUTH_GMAIL.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/06_TEST_GUIDE_AUTH_GMAIL.md) - Hướng dẫn Kiểm thử:** Kịch bản kiểm thử (Test Cases) chi tiết cho giao diện Auth, các thông báo lỗi Zod validation, và quy trình bấm nút Google SSO.
8. **[07_DATABASE_SAMPLE_DATA_GMAIL.md](file:///d:/IT/TEAMJAVA/java_06_team_03/docs/07_DATABASE_SAMPLE_DATA_GMAIL.md) - Tài liệu Database & Seed Gmail User:** Cách lưu dữ liệu của Google SSO User, cách seed dữ liệu mặc định và nâng quyền ADMIN/STAFF cho tài khoản Gmail phục vụ test.

---

## 🔮 4. Định hướng Phát triển Sprint 2 (Next Steps)
Sau khi hoàn thành xuất sắc phân hệ Xác thực làm nền tảng, Sprint 2 sẽ tập trung phát triển các nghiệp vụ Rạp chiếu phim cốt lõi:
* **Database & Entities:** Triển khai các thực thể JPA cho `MOVIE`, `SHOWTIME`, `CINEMA`, `CINEMAROOM`, `SEAT`, `SEAT_TYPE` trên Backend.
* **API CRUD (Quản trị):** Xây dựng các đầu API để Admin/Staff quản lý phim (thêm phim, trailer), tạo phòng chiếu và thiết lập suất chiếu (Showtime).
* **Frontend UI (Giao diện hiển thị):** Xây dựng trang chủ hiển thị danh sách phim Đang chiếu / Sắp chiếu (Carousel + Grid View) lấy dữ liệu thực tế từ Backend.
* **Sơ đồ ghế:** Xây dựng màn hình chọn ghế trong phòng chiếu tương tác trực quan (Standard, VIP, Couple) để chuẩn bị cho luồng Booking.

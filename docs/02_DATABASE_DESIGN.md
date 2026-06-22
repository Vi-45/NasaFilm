# THIET KE CO SO DU LIEU (DATABASE DESIGN) - NASAFILM

Tai lieu nay mo ta thiet ke co so du lieu cho he thong NasaFilm su dung PostgreSQL.
No duoc chia thanh 2 phan ro rang:

- `Current schema`: cac bang da ton tai va dang duoc backend Spring Boot mapping.
- `Target schema`: mo hinh du kien cho he thong dat ve rap phim day du.

Muc tieu cua tai lieu:

- giup team nhin nhanh duoc pham vi da lam va chua lam,
- tranh nham lan giua schema dang chay va schema de xuat,
- lam co so cho viec thiet ke API, entity va migration sau nay.

---

## 1. Tong quan thiet ke

### 1.1. He quan tri co so du lieu

- Database: `PostgreSQL`
- ORM hien tai: `Spring Data JPA` + `Hibernate`
- Kieu khoa chinh uu tien: `UUID`
- Quy uoc timestamp: `created_at`, `updated_at`

### 1.2. Nguyen tac mo hinh du lieu

- Tach bang trung gian cho quan he nhieu-nhieu.
- Uu tien luu `snapshot data` cho giao dich quan trong nhu gia ve, gia combo.
- Cac bang nghiep vu giao dich can co cot `status`.
- Co the truy vet nguoi tao/cap nhat voi `created_by`, `updated_by` khi can.

---

## 2. Current Schema

Backend hien tai moi implement nhom xac thuc, nguoi dung va session.
4 bang da duoc mapping trong code:

- `users`
- `roles`
- `user_roles`
- `user_sessions`

### 2.1. ERD hien tai

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar password
        varchar full_name
        varchar avatar_url
        varchar phone_number
        varchar auth_provider
        varchar status
        integer score
        varchar verification_code
        timestamp verification_code_expiry
        timestamp created_at
        timestamp updated_at
    }

    roles {
        uuid id PK
        varchar name
        varchar description
        timestamp created_at
        timestamp updated_at
    }

    user_roles {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
        timestamp created_at
    }

    user_sessions {
        uuid id PK
        uuid user_id FK
        varchar refresh_token UK
        timestamp expiry_date
        boolean revoked
        varchar ip_address
        varchar user_agent
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ user_roles : has
    roles ||--o{ user_roles : assigned_to
    users ||--o{ user_sessions : owns
```

### 2.2. Data dictionary hien tai

#### `users`

Luu thong tin tai khoan va thong tin co ban cua nguoi dung.

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `id` | UUID | PK | Dinh danh nguoi dung |
| `email` | VARCHAR | unique, not null | Email dang nhap |
| `password` | VARCHAR | nullable | Mat khau da bam; co the null voi tai khoan Google |
| `full_name` | VARCHAR | not null | Ho ten hien thi |
| `avatar_url` | VARCHAR | nullable | Anh dai dien |
| `phone_number` | VARCHAR | nullable | So dien thoai |
| `auth_provider` | VARCHAR | nullable | `LOCAL`, `GOOGLE` |
| `status` | VARCHAR | nullable | `ACTIVE`, `INACTIVE`, `SUSPENDED`, `BANNED`, `DELETED`, `PENDING_VERIFICATION` |
| `score` | INTEGER | default `0` | Diem tich luy |
| `verification_code` | VARCHAR | nullable | Ma xac minh tai khoan |
| `verification_code_expiry` | TIMESTAMP | nullable | Han het cua ma xac minh |
| `created_at` | TIMESTAMP | auto | Thoi gian tao |
| `updated_at` | TIMESTAMP | auto | Thoi gian cap nhat |

#### `roles`

Danh muc vai tro he thong.

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `id` | UUID | PK | Dinh danh vai tro |
| `name` | VARCHAR | enum | `ADMIN`, `STAFF`, `CUSTOMER` |
| `description` | VARCHAR | nullable | Mo ta vai tro |
| `created_at` | TIMESTAMP | auto | Thoi gian tao |
| `updated_at` | TIMESTAMP | auto | Thoi gian cap nhat |

#### `user_roles`

Bang trung gian mapping nguoi dung voi vai tro.

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `id` | UUID | PK | Dinh danh ban ghi |
| `user_id` | UUID | FK -> `users.id` | Nguoi dung |
| `role_id` | UUID | FK -> `roles.id` | Vai tro |
| `created_at` | TIMESTAMP | auto | Thoi gian gan role |

#### `user_sessions`

Luu refresh token va phien dang nhap.

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `id` | UUID | PK | Dinh danh phien |
| `user_id` | UUID | FK -> `users.id`, not null | Chu so huu phien |
| `refresh_token` | VARCHAR(128) | unique, not null | Refresh token |
| `expiry_date` | TIMESTAMP | not null | Thoi diem het han |
| `revoked` | BOOLEAN | not null | Danh dau token da bi thu hoi |
| `ip_address` | VARCHAR | nullable | IP dang nhap |
| `user_agent` | VARCHAR | nullable | Thong tin thiet bi/trinh duyet |
| `created_at` | TIMESTAMP | auto | Thoi gian tao |
| `updated_at` | TIMESTAMP | auto | Thoi gian cap nhat |

### 2.3. Nhan xet hien trang

- Schema hien tai du cho `register`, `login`, `refresh token`, `role assignment`.
- Chua co cac bang nghiep vu cho phim, rap, suat chieu, dat ve, thanh toan.
- `Current schema` can duoc giu on dinh, con `Target schema` ben duoi la de mo rong.

---

## 3. Target Schema

Schema muc tieu mo ta he thong dat ve rap phim day du, gom 6 nhom nghiep vu:

- User & Access
- Movie Catalog
- Cinema & Seat
- Showtime
- Booking & Payment
- Promotion & Loyalty

### 3.1. ERD muc tieu

```mermaid
erDiagram
    USERS {
        uuid id PK
    }
    ROLES {
        uuid id PK
    }
    USER_ROLES {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
    }
    USER_SESSIONS {
        uuid id PK
        uuid user_id FK
    }
    SCORE_HISTORY {
        uuid id PK
        uuid user_id FK
    }

    MOVIES {
        uuid id PK
        uuid created_by FK
        uuid updated_by FK
    }
    GENRES {
        uuid id PK
    }
    MOVIE_GENRES {
        uuid id PK
        uuid movie_id FK
        uuid genre_id FK
    }
    COUNTRIES {
        uuid id PK
    }
    MOVIE_COUNTRIES {
        uuid id PK
        uuid movie_id FK
        uuid country_id FK
    }
    ACTORS {
        uuid id PK
        uuid country_id FK
    }
    MOVIE_ACTORS {
        uuid id PK
        uuid movie_id FK
        uuid actor_id FK
    }
    MOVIE_MEDIA {
        uuid id PK
        uuid movie_id FK
    }

    CINEMAS {
        uuid id PK
    }
    CINEMA_ROOMS {
        uuid id PK
        uuid cinema_id FK
    }
    SEAT_TYPES {
        uuid id PK
    }
    SEATS {
        uuid id PK
        uuid cinema_room_id FK
        uuid seat_type_id FK
    }

    SHOWTIMES {
        uuid id PK
        uuid movie_id FK
        uuid cinema_room_id FK
        uuid created_by FK
        uuid updated_by FK
    }
    SEAT_LOCKS {
        uuid id PK
        uuid showtime_id FK
        uuid seat_id FK
        uuid user_id FK
    }

    PROMOTIONS {
        uuid id PK
        uuid created_by FK
        uuid updated_by FK
    }
    BOOKINGS {
        uuid id PK
        uuid user_id FK
        uuid promotion_id FK
        uuid showtime_id FK
    }
    BOOKING_SEATS {
        uuid id PK
        uuid booking_id FK
        uuid seat_id FK
    }
    COMBOS {
        uuid id PK
    }
    BOOKING_COMBOS {
        uuid id PK
        uuid booking_id FK
        uuid combo_id FK
    }
    TICKETS {
        uuid id PK
        uuid booking_seat_id FK
    }
    PAYMENTS {
        uuid id PK
        uuid booking_id FK
    }
    TRANSACTIONS {
        uuid id PK
        uuid payment_id FK
    }
    WATCH_ACCESS {
        uuid id PK
        uuid user_id FK
        uuid booking_id FK
        uuid movie_id FK
        uuid payment_id FK
    }

    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : grants
    USERS ||--o{ USER_SESSIONS : owns
    USERS ||--o{ SCORE_HISTORY : earns

    MOVIES ||--o{ MOVIE_GENRES : classified
    GENRES ||--o{ MOVIE_GENRES : maps
    MOVIES ||--o{ MOVIE_COUNTRIES : produced_in
    COUNTRIES ||--o{ MOVIE_COUNTRIES : maps
    COUNTRIES ||--o{ ACTORS : belongs_to
    MOVIES ||--o{ MOVIE_ACTORS : casts
    ACTORS ||--o{ MOVIE_ACTORS : appears_in
    MOVIES ||--o{ MOVIE_MEDIA : has

    CINEMAS ||--o{ CINEMA_ROOMS : contains
    CINEMA_ROOMS ||--o{ SEATS : has
    SEAT_TYPES ||--o{ SEATS : classifies

    MOVIES ||--o{ SHOWTIMES : schedules
    CINEMA_ROOMS ||--o{ SHOWTIMES : hosts
    SHOWTIMES ||--o{ SEAT_LOCKS : locks
    SEATS ||--o{ SEAT_LOCKS : locked
    USERS ||--o{ SEAT_LOCKS : created

    USERS ||--o{ BOOKINGS : makes
    PROMOTIONS ||--o{ BOOKINGS : applies
    SHOWTIMES ||--o{ BOOKINGS : receives
    BOOKINGS ||--o{ BOOKING_SEATS : contains
    SEATS ||--o{ BOOKING_SEATS : selected
    BOOKINGS ||--o{ BOOKING_COMBOS : contains
    COMBOS ||--o{ BOOKING_COMBOS : selected
    BOOKING_SEATS ||--|| TICKETS : issues
    BOOKINGS ||--o{ PAYMENTS : paid_by
    PAYMENTS ||--o{ TRANSACTIONS : records
    USERS ||--o{ WATCH_ACCESS : owns
    BOOKINGS ||--o{ WATCH_ACCESS : grants
    MOVIES ||--o{ WATCH_ACCESS : unlocks
    PAYMENTS ||--o{ WATCH_ACCESS : paid_by
```

---

## 4. Data dictionary theo module

Chi liet ke cac bang muc tieu o muc nghiep vu. Nhom `users`, `roles`, `user_roles`, `user_sessions` da duoc mo ta o phan current schema.

### 4.1. User & Loyalty

#### `score_history`

Luu lich su cong tru diem tich luy cua thanh vien.

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK -> `users.id` |
| `score_amount` | INTEGER | So diem thay doi |
| `type` | VARCHAR | `BOOKING`, `REWARD`, `REDEEM`, ... |
| `description` | VARCHAR | Ly do thay doi diem |
| `created_at` | TIMESTAMP | Thoi gian ghi nhan |

### 4.2. Movie Catalog

#### `movies`

Thong tin phim trung tam cua he thong.

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `title` | VARCHAR | Ten phim |
| `description` | TEXT | Mo ta noi dung |
| `duration_minutes` | INTEGER | Thoi luong |
| `release_date` | DATE | Ngay khoi chieu |
| `status` | VARCHAR | `COMING_SOON`, `NOW_SHOWING`, `ENDED` |
| `created_at` | TIMESTAMP | Thoi gian tao |
| `updated_at` | TIMESTAMP | Thoi gian cap nhat |
| `created_by` | UUID | FK -> `users.id` |
| `updated_by` | UUID | FK -> `users.id` |

#### `genres`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `name` | VARCHAR | Ten the loai |

#### `movie_genres`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `movie_id` | UUID | FK -> `movies.id` |
| `genre_id` | UUID | FK -> `genres.id` |

#### `countries`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `code` | VARCHAR | Ma quoc gia |
| `name` | VARCHAR | Ten quoc gia |
| `created_at` | TIMESTAMP | Thoi gian tao |
| `updated_at` | TIMESTAMP | Thoi gian cap nhat |

#### `movie_countries`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `movie_id` | UUID | FK -> `movies.id` |
| `country_id` | UUID | FK -> `countries.id` |

#### `actors`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `full_name` | VARCHAR | Ten dien vien |
| `avatar_url` | VARCHAR | Anh chan dung |
| `country_id` | UUID | FK -> `countries.id` |

#### `movie_actors`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `movie_id` | UUID | FK -> `movies.id` |
| `actor_id` | UUID | FK -> `actors.id` |
| `character_name` | VARCHAR | Ten nhan vat |
| `cast_order` | INTEGER | Thu tu xuat hien |
| `is_main` | BOOLEAN | Danh dau vai chinh |

#### `movie_media`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `movie_id` | UUID | FK -> `movies.id` |
| `media_url` | VARCHAR | Link anh/video |
| `media_type` | VARCHAR | `POSTER`, `TRAILER`, `STILL` |
| `is_primary` | BOOLEAN | Anh/video dai dien |
| `created_at` | TIMESTAMP | Thoi gian tao |
| `sort_order` | INTEGER | Thu tu hien thi |
| `title` | VARCHAR | Tieu de media |

### 4.3. Cinema & Seat

#### `cinema`

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `uuid` | UUID | PK | Dinh danh rap chieu |
| `name` | VARCHAR | not null | Ten chi nhanh rap |
| `address` | VARCHAR | nullable | Dia chi rap |
| `phone_number` | VARCHAR | nullable | So lien he |

#### `cinema_room`

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `uuid` | UUID | PK | Dinh danh phong chieu |
| `room_code` | VARCHAR | not null, uk: (cinema_uuid, room_code) | Ma viet tat cua phong chieu |
| `name` | VARCHAR | not null | Ten phong chieu |
| `capacity` | INTEGER | nullable | Suc chua (tinh bang tong so ghe hoat dong) |
| `room_type` | VARCHAR | enum: `STANDARD`, `VIP`, `IMAX` | Loai phong chieu |
| `status` | VARCHAR | enum: `ACTIVE`, `MAINTENANCE` | Trang thai phong chieu |
| `cinema_uuid` | UUID | FK -> `cinema.uuid` | Rap chieu chua phong nay |

#### `seat_type`

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `uuid` | UUID | PK | Dinh danh loai ghe |
| `name` | VARCHAR | not null, unique | `STANDARD`, `VIP`, `COUPLE` |
| `description` | VARCHAR | nullable | Mo ta loai ghe |
| `base_price` | NUMERIC(10, 2) | not null | Gia co ban cua loai ghe nay |
| `price_modifier` | NUMERIC(10, 2) | default 1.00 | He so phu thu (phu tro them) |

#### `seat`

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `uuid` | UUID | PK | Dinh danh ghe |
| `cinema_room_uuid` | UUID | FK -> `cinema_room.uuid` | Thuoc phong chieu nao |
| `seat_type_uuid` | UUID | FK -> `seat_type.uuid` | Loai ghe (Thuyen, VIP, Doi) |
| `row_name` | VARCHAR(5) | not null, uk: (cinema_room_uuid, row_name, seat_number) | Ten hang (A, B, C...) |
| `seat_number` | INTEGER | not null, uk: (cinema_room_uuid, row_name, seat_number) | So thu tu ghe |
| `status` | VARCHAR(50) | enum: `ACTIVE`, `DISABLED`, `MAINTENANCE` | Trang thai vat ly cua ghe |
| `is_active` | BOOLEAN | default TRUE | Danh dau ghe co dang phuc vu hay khong |

### 4.4. Showtime

#### `showtime`

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `uuid` | UUID | PK | Dinh danh suat chieu |
| `movie_uuid` | UUID | FK -> `movie.uuid` | Phim duoc chieu |
| `cinema_room_uuid` | UUID | FK -> `cinema_room.uuid` | Phong chieu phuc vu |
| `start_time` | TIMESTAMPTZ | not null | Bat dau chieu |
| `end_time` | TIMESTAMPTZ | nullable | Tu dong tinh dua tren thoi luong phim |
| `base_price` | NUMERIC(21, 2) | not null | Gia ve cho ghe STANDARD |
| `vip_price` | NUMERIC(21, 2) | nullable | Gia ve cho ghe VIP |
| `couple_price` | NUMERIC(21, 2) | nullable | Gia ve cho ghe COUPLE |
| `status` | VARCHAR(50) | enum: `DRAFT`, `SCHEDULED`, `OPEN_FOR_BOOKING`, `SOLD_OUT`, `FINISHED`, `CANCELLED` | Trang thai suat chieu |
| `created_at` | TIMESTAMPTZ | auto | Thoi gian khoi tao |
| `updated_at` | TIMESTAMPTZ | auto | Thoi gian cap nhat |

#### `seat_locked`

Giu ghe tam thoi trong luc nguoi dung dang dat ve.

| Column | Type | Rang buoc | Mo ta |
|---|---|---|---|
| `uuid` | UUID | PK, nullable | Dinh danh ban ghi giu ghe |
| `showtime_uuid` | UUID | FK -> `showtime.uuid`, uk: (showtime_uuid, seat_uuid) | Suat chieu giu ghe |
| `seat_uuid` | UUID | FK -> `seat.uuid`, uk: (showtime_uuid, seat_uuid) | Ghe bi giu |
| `user_uuid` | UUID | FK -> `users.id` | Nguoi dung thuc hien giu |
| `locked_at` | TIMESTAMPTZ | not null | Thoi diem bat dau khoa |
| `expired_at` | TIMESTAMPTZ | not null | Thoi diem het han giu ghe (5 phut) |

### 4.5. Booking & Payment

#### `promotions`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `code` | VARCHAR | Ma khuyen mai |
| `discount_value` | DECIMAL | Gia tri giam |
| `start_date` | TIMESTAMP | Bat dau ap dung |
| `end_date` | TIMESTAMP | Ket thuc ap dung |
| `status` | VARCHAR | `ACTIVE`, `EXPIRED` |
| `discount_type` | VARCHAR | `PERCENTAGE`, `FIXED_AMOUNT` |
| `created_at` | TIMESTAMP | Thoi gian tao |
| `updated_at` | TIMESTAMP | Thoi gian cap nhat |
| `created_by` | UUID | FK -> `users.id` |
| `updated_by` | UUID | FK -> `users.id` |

#### `bookings`

Ban ghi dat ve tong.

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK -> `users.id` |
| `promotion_id` | UUID | FK -> `promotions.id`, nullable |
| `showtime_id` | UUID | FK -> `showtimes.id` |
| `total_price` | DECIMAL | Tong tien cuoi cung |
| `status` | VARCHAR | `PENDING`, `CONFIRMED`, `CANCELLED` |
| `created_at` | TIMESTAMP | Thoi gian tao |
| `updated_at` | TIMESTAMP | Thoi gian cap nhat |
| `expired_at` | TIMESTAMP | Han thanh toan |
| `confirmed_at` | TIMESTAMP | Thoi diem xac nhan |
| `cancelled_at` | TIMESTAMP | Thoi diem huy |

#### `booking_seats`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `booking_id` | UUID | FK -> `bookings.id` |
| `seat_id` | UUID | FK -> `seats.id` |
| `price` | DECIMAL | Gia ghe tai thoi diem dat |

#### `combos`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `name` | VARCHAR | Ten combo |
| `description` | VARCHAR | Mo ta |
| `price` | DECIMAL | Gia combo |
| `image_url` | VARCHAR | Hinh minh hoa |
| `status` | VARCHAR | `ACTIVE`, `OUT_OF_STOCK`, `DISABLED` |

#### `booking_combos`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `booking_id` | UUID | FK -> `bookings.id` |
| `combo_id` | UUID | FK -> `combos.id` |
| `quantity` | INTEGER | So luong |
| `price` | DECIMAL | Gia ghi nhan tai luc dat |

#### `tickets`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `booking_seat_id` | UUID | FK -> `booking_seats.id`, unique |
| `ticket_code` | VARCHAR | Ma ve |
| `status` | VARCHAR | `ACTIVE`, `USED`, `REFUNDED` |
| `checked_in_at` | TIMESTAMP | Thoi diem soat ve |
| `qr_code` | VARCHAR | Du lieu QR |
| `issued_at` | TIMESTAMP | Thoi gian phat hanh |

#### `payments`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `booking_id` | UUID | FK -> `bookings.id` |
| `payment_method` | VARCHAR | `MOMO`, `VNPAY`, `CASH`, `CARD` |
| `amount` | DECIMAL | So tien giao dich |
| `payment_time` | TIMESTAMP | Thoi gian thanh toan |
| `status` | VARCHAR | `COMPLETED`, `FAILED`, `PENDING` |

#### `transactions`

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `code` | VARCHAR | Ma giao dich cong thanh toan |
| `description` | VARCHAR | Noi dung giao dich |
| `payment_id` | UUID | FK -> `payments.id` |

### 4.6. Watch Access

#### `watch_access`

Dung cho mo hinh xem phim online hoac quyen truy cap noi dung so.

| Column | Type | Mo ta |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK -> `users.id` |
| `booking_id` | UUID | FK -> `bookings.id`, nullable |
| `access_type` | VARCHAR | `SINGLE_MOVIE_RENTAL`, `SYSTEM_SUBSCRIPTION`, ... |
| `start_at` | TIMESTAMP | Bat dau co quyen xem |
| `expired_at` | TIMESTAMP | Het han |
| `status` | VARCHAR | `ACTIVE`, `EXPIRED` |
| `movie_id` | UUID | FK -> `movies.id` |
| `payment_id` | UUID | FK -> `payments.id` |

---

## 5. Luong du lieu nghiep vu chinh

### 5.1. Luong dat ve

1. User chon `showtime`.
2. He thong tao ban ghi `seat_locks` de giu ghe tam thoi.
3. User tao `booking`.
4. He thong luu `booking_seats` va `booking_combos` neu co.
5. Sau khi thanh toan thanh cong, tao `payments`, `transactions`, `tickets`.
6. Neu thanh toan that bai hoac het han, huy `booking` va giai phong `seat_locks`.

### 5.2. Luong quan ly phim

1. Staff/Admin tao `movies`.
2. He thong gan `movie_genres`, `movie_countries`, `movie_actors`, `movie_media`.
3. Sau do moi tao `showtimes` cho phim o tung `cinema_room`.

---

## 6. Quy uoc va khuyen nghi khi implement

- Dat ten bang theo `snake_case`, dang so nhieu.
- Dat ten khoa ngoai theo mau `xxx_id`.
- Tao index cho cac cot tim kiem/loc nhieu:
  - `users.email`
  - `user_sessions.refresh_token`
  - `showtimes.movie_id`
  - `showtimes.start_time`
  - `bookings.user_id`
  - `seat_locks.showtime_id`
- Can unique constraint cho cac cap de tranh trung du lieu:
  - `user_roles(user_id, role_id)`
  - `movie_genres(movie_id, genre_id)`
  - `movie_countries(movie_id, country_id)`
  - `booking_seats(booking_id, seat_id)`
  - `seats(cinema_room_id, row_name, seat_number)`
- Cac bang giao dich nen dung enum hoac check constraint cho `status`.

---

## 7. Pham vi implementation hien tai

Tinh den thoi diem cap nhat tai lieu nay:

- **Da co va mapping day du trong backend:**
  - Nhom nguoi dung va xac thuc: `users`, `roles`, `user_roles`, `user_sessions`
  - Nhom rap va phong chieu: `cinema`, `cinema_room`
  - Nhom ghe: `seat`, `seat_type`
  - Nhom suat chieu & dat ve: `showtime`, `seat_locked`, `booking`, `booking_seat`, `booking_combo`, `combo`, `promotions`, `ticket`
- Cac bang tren da duoc cau hinh Entity JPA, Repository, Service va seeding du lieu day du thong qua `DataSeeder.java`.

---

## 8. Du lieu mau va Seeding Data (Seed & Sample Data)

He thong da cau hinh seed san du lieu mau trong `DataSeeder.java` khi khoi dong du an. Duoi day la thong tin chi tiet du lieu mau da duoc nap vao co so du lieu PostgreSQL:

### 8.1. Rap va Phong chieu (Cinemas & Rooms)
* **Cinema:** `NASA Landmark 81`
  * `uuid`: `77777777-7777-7777-7777-777777777777`
  * Dia chi: Toa nha Landmark 81, Vinhomes Central Park, Binh Thanh, TP.HCM
  * So dien thoai: `19001080`
* **Rooms:**
  1. **Phong chieu IMAX** (`ROOM-IMAX`):
     * `uuid`: `88888888-8888-8888-8888-888888888888`
     * Loai phong: `IMAX`
     * Suc chua: `84` ghe (tu dong tinh dua tren so luong ghe dang hoat dong)
     * Trang thai: `ACTIVE`
  2. **Phong chieu VIP** (`ROOM-VIP`):
     * `uuid`: `99999999-9999-9999-9999-999999999999`
     * Loai phong: `VIP`
     * Suc chua: `84` ghe
     * Trang thai: `ACTIVE`

### 8.2. Loai ghe va Gia ve (Seat Types & Pricing)
* **STANDARD (Ghe Thuong):**
  * `uuid`: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`
  * Gia co ban: `85,000 VND`
  * He so phu thu (`price_modifier`): `1.0`
* **VIP (Ghe VIP):**
  * `uuid`: `bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb`
  * Gia co ban: `120,000 VND`
  * He so phu thu (`price_modifier`): `1.0`
* **COUPLE (Ghe Doi):**
  * `uuid`: `cccccccc-cccc-cccc-cccc-cccccccccccc`
  * Gia co ban: `160,000 VND`
  * He so phu thu (`price_modifier`): `1.0`

### 8.3. So do ghe mac dinh (Default Seating Layout)
Voi moi phong chieu (IMAX va VIP), so do ghe gom 8 hang (tu A den H) voi tong cong 84 ghe duoc sinh tu dong nhu sau:
* **Hang A - D (STANDARD):** Moi hang gom 12 ghe (A1 den A12, B1 den B12, C1 den C12, D1 den D12).
* **Hang E - F (VIP):** Moi hang gom 12 ghe (E1 den E12, F1 den F12).
* **Hang G - H (COUPLE):** Moi hang gom 6 ghe doi (G1 den G6, H1 den H6).

### 8.4. Combos Bap Nuoc (Concession Combos)
* **Combo Bap Nuoc** (`55555555-5555-5555-5555-555555555555`): Gia `90,000 VND`, trang thai `ACTIVE`.
* **Combo Solo (1 Bap + 1 Nuoc)** (`55555555-5555-5555-5555-666666666666`): Gia `70,000 VND`, trang thai `ACTIVE`.
* **Combo Gia Dinh (2 Bap + 4 Nuoc)** (`55555555-5555-5555-5555-777777777777`): Gia `160,000 VND`, trang thai `ACTIVE`.

### 8.5. Suat chieu mau (Sample Showtimes)
Cac suat chieu duoc tu dong tao cho ngay hien tai:
* **Suat chieu 1 (IMAX - Ke An Danh):**
  * `uuid`: `11111111-1111-1111-1111-111111111111`
  * Thoi gian: `19:30` - `21:30`
  * Gia co ban: `80,000 VND`
  * Trang thai: `OPEN_FOR_BOOKING`
* **Suat chieu 2 (IMAX - Mortal Kombat 2):**
  * `uuid`: `22222222-2222-2222-2222-222222222222`
  * Thoi gian: `21:00` - `23:00`
  * Gia co ban: `80,000 VND`
  * Trang thai: `OPEN_FOR_BOOKING`
* **Suat chieu 3 (VIP - Mua Do):**
  * `uuid`: `33333333-3333-3333-3333-333333333333`
  * Thoi gian: `18:00` - `20:00`
  * Gia co ban: `80,000 VND`
  * Trang thai: `OPEN_FOR_BOOKING`
* **Suat chieu 4 (VIP - Thanh Guom Diet Quy):**
  * `uuid`: `44444444-4444-4444-4444-444444444444`
  * Thoi gian: `20:45` - `22:45`
  * Gia co ban: `80,000 VND`
  * Trang thai: `OPEN_FOR_BOOKING`

### 8.6. Ma khuyen mai (Voucher Codes)
* **THDPV50:** Giam gia 50% (`PERCENTAGE` / `0.50`), so luong 100 luot, trang thai `ACTIVE`.
* **CINELUXE:** Giam gia `30,000 VND` (`FIXED_AMOUNT`), so luong 200 luot, trang thai `ACTIVE`.
* **NASAFIRST:** Giam gia `50,000 VND` (`FIXED_AMOUNT`), gioi han 1 lan su dung/user, so luong 500 luot, trang thai `ACTIVE`.

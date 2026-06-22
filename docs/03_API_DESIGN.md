# THIET KE RESTFUL APIs (API DESIGN) - THDPV Movie Theater

Tai lieu nay mo ta cac API endpoint hien tai cua he thong va de xuat contract cho cac module nghiep vu tiep theo. Noi dung duoi day uu tien bam sat backend convention hien co: public API duoi `/api/...`, admin API duoi `/api/admin/...`, va response wrapper dung `ApiResponse<T>`.

---

## 1. Authentication API

Base URL: `/api`

### 1.1. Dang nhap

- Endpoint: `POST /api/login`
- Mo ta: Dang nhap bang email va mat khau, tra ve access token va refresh token.
- Quyen truy cap: Public

Body request:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response success:

```json
{
  "success": true,
  "code": 200,
  "message": "Thanh cong",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-value",
    "userId": "e4a2d592-3a5f-4a0b-9cf9-79860b29ff5e",
    "fullName": "System Administrator",
    "email": "admin@example.com",
    "roles": [
      "ADMIN"
    ],
    "tokenType": "Bearer"
  },
  "timestamp": "2026-06-11T09:00:00Z"
}
```

### 1.2. Gia han access token

- Endpoint: `POST /api/refresh`
- Mo ta: Cap moi access token khi refresh token van con hieu luc.
- Quyen truy cap: Public

Body request:

```json
{
  "refreshToken": "refresh-token-value"
}
```

### 1.3. Dang ky

- Endpoint: `POST /api/register`
- Mo ta: Tao moi tai khoan khach hang.
- Quyen truy cap: Public

Body request:

```json
{
  "fullName": "Nguyen Van A",
  "email": "nva@example.com",
  "phoneNumber": "0987654321",
  "password": "SecurePassword123!"
}
```

### 1.4. Quen mat khau

- Endpoint: `POST /api/forgot-password`
- Mo ta: Gui email chua reset token.
- Quyen truy cap: Public

### 1.5. Dat lai mat khau

- Endpoint: `POST /api/reset-password`
- Mo ta: Dat lai mat khau bang token nhan qua email.
- Quyen truy cap: Public

---

## 2. Proposed Core APIs

### 2.0. User Profile API

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `GET` | `/api/users/me` | User da dang nhap | Lay thong tin ho so ca nhan |
| `PUT` | `/api/users/me` | User da dang nhap | Cap nhat thong tin ca nhan |
| `GET` | `/api/admin/users` | Admin | Danh sach tai khoan nguoi dung |
| `GET` | `/api/admin/users/{id}` | Admin | Xem chi tiet tai khoan |
| `PUT` | `/api/admin/users/{id}/status` | Admin | Khoa/mo khoa tai khoan |
| `PUT` | `/api/admin/users/{id}/roles` | Admin | Cap nhat vai tro nguoi dung |

### 2.1. Movies API

Module phim duoc thiet ke theo huong `Movie` la aggregate root:
- `MOVIE` la du lieu chinh cua phim.
- `MOVIE_MEDIA` la danh sach poster, banner, trailer, gallery cua phim.
- `MOVIE_GENRE`, `MOVIE_COUNTRY`, `MOVIE_ACTOR` la cac quan he con cua phim.
- `GENRE`, `COUNTRY`, `ACTOR` la master data dung lai.

Base URL:
- Public: `/api/movies`
- Admin: `/api/admin/movies`

Movie status:
- `DRAFT`
- `COMING_SOON`
- `NOW_SHOWING`
- `ENDED`
- `HIDDEN`

Movie media type:
- `POSTER`
- `BANNER`
- `TRAILER`
- `GALLERY`
- `THUMBNAIL`

#### 2.1.1. Response wrapper

Tat ca API module phim nen bam chuan `ApiResponse<T>`:

```json
{
  "success": true,
  "code": 200,
  "message": "Thanh cong",
  "data": {},
  "timestamp": "2026-06-11T09:00:00Z"
}
```

Neu co phan trang, `data` nen co cau truc:

```json
{
  "items": [],
  "page": 0,
  "size": 10,
  "totalItems": 100,
  "totalPages": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

#### 2.1.2. DTO tra ve

`MovieListItemResponse`

```json
{
  "uuid": "uuid",
  "title": "Interstellar",
  "description": "string",
  "durationMinutes": 169,
  "releaseDate": "2014-11-07",
  "status": "COMING_SOON",
  "primaryPosterUrl": "https://...",
  "genres": [
    { "uuid": "uuid", "name": "Sci-Fi" }
  ],
  "countries": [
    { "uuid": "uuid", "code": "US", "name": "United States" }
  ]
}
```

`MovieDetailResponse`

```json
{
  "uuid": "uuid",
  "title": "Interstellar",
  "description": "string",
  "durationMinutes": 169,
  "releaseDate": "2014-11-07",
  "status": "COMING_SOON",
  "createdAt": "2026-06-11T09:00:00Z",
  "updatedAt": "2026-06-11T09:00:00Z",
  "genres": [
    { "uuid": "uuid", "name": "Sci-Fi" }
  ],
  "countries": [
    { "uuid": "uuid", "code": "US", "name": "United States" }
  ],
  "actors": [
    {
      "actorUuid": "uuid",
      "fullName": "Matthew McConaughey",
      "avatarUrl": "https://...",
      "country": {
        "uuid": "uuid",
        "code": "US",
        "name": "United States"
      },
      "characterName": "Cooper",
      "castOrder": 1,
      "isMain": true
    }
  ],
  "media": [
    {
      "uuid": "uuid",
      "mediaUrl": "https://...",
      "mediaType": "POSTER",
      "title": "Official Poster",
      "isPrimary": true,
      "sortOrder": 1
    }
  ]
}
```

#### 2.1.3. Public Movies API

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `GET` | `/api/movies` | Public | Lay danh sach phim public co filter, paging, sort |
| `GET` | `/api/movies/{movieUuid}` | Public | Lay chi tiet phim kem genre, country, cast, media |
| `GET` | `/api/movies/{movieUuid}/media` | Public | Lay media cua phim |
| `GET` | `/api/movies/{movieUuid}/cast` | Public | Lay cast cua phim |

Query params cua `GET /api/movies`:
- `keyword`
- `status`
- `genreUuid`
- `countryUuid`
- `actorUuid`
- `releaseFrom`
- `releaseTo`
- `page` mac dinh `0`
- `size` mac dinh `10`
- `sortBy` mac dinh `releaseDate`
- `sortDir` mac dinh `desc`

Rule public:
- Chi tra ve phim co `status` thuoc `COMING_SOON`, `NOW_SHOWING`, `ENDED`.
- `GET /api/movies/{movieUuid}` tra `404` neu phim khong ton tai hoac khong con public.

#### 2.1.4. Admin Movies API

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `GET` | `/api/admin/movies` | Admin / Staff | Lay danh sach phim bao gom ca `DRAFT`, `HIDDEN` |
| `GET` | `/api/admin/movies/{movieUuid}` | Admin / Staff | Lay chi tiet phim cho CMS |
| `POST` | `/api/admin/movies` | Admin / Staff | Tao phim cung genre, country, actor, media |
| `PUT` | `/api/admin/movies/{movieUuid}` | Admin / Staff | Cap nhat toan bo aggregate phim |
| `PATCH` | `/api/admin/movies/{movieUuid}/status` | Admin / Staff | Cap nhat rieng trang thai phim |
| `DELETE` | `/api/admin/movies/{movieUuid}` | Admin | Xoa mem hoac an phim khoi public |

Query params cua `GET /api/admin/movies`:
- `keyword`
- `status`
- `genreUuid`
- `countryUuid`
- `actorUuid`
- `releaseFrom`
- `releaseTo`
- `createdFrom`
- `createdTo`
- `page`
- `size`
- `sortBy`
- `sortDir`

`POST /api/admin/movies` va `PUT /api/admin/movies/{movieUuid}` dung body aggregate:

```json
{
  "title": "Interstellar",
  "description": "string",
  "durationMinutes": 169,
  "releaseDate": "2014-11-07",
  "status": "DRAFT",
  "genreUuids": ["uuid1", "uuid2"],
  "countryUuids": ["uuid1"],
  "actors": [
    {
      "actorUuid": "uuid",
      "characterName": "Cooper",
      "castOrder": 1,
      "isMain": true
    }
  ],
  "media": [
    {
      "uuid": "optional-existing-uuid",
      "mediaUrl": "https://...",
      "mediaType": "POSTER",
      "title": "Official Poster",
      "isPrimary": true,
      "sortOrder": 1
    }
  ]
}
```

Validation chinh:
- `title`: bat buoc, khong rong.
- `durationMinutes`: phai `> 0`.
- `status`: bat buoc.
- `genreUuids`, `countryUuids`: khong chua phan tu trung.
- `actors.actorUuid`: bat buoc.
- `actors.castOrder`: phai `>= 1`.
- `media.mediaUrl`: bat buoc.
- `media.mediaType`: bat buoc.
- Moi phim nen chi co 1 poster chinh.

`PATCH /api/admin/movies/{movieUuid}/status`

```json
{
  "status": "NOW_SHOWING"
}
```

#### 2.1.5. Admin sub-resource APIs

Chi dung nhom API nay khi frontend CMS can luu tung tab rieng. Neu khong, uu tien submit full aggregate bang `POST/PUT /api/admin/movies`.

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `PUT` | `/api/admin/movies/{movieUuid}/genres` | Admin / Staff | Thay toan bo danh sach genre cua phim |
| `PUT` | `/api/admin/movies/{movieUuid}/countries` | Admin / Staff | Thay toan bo danh sach country cua phim |
| `PUT` | `/api/admin/movies/{movieUuid}/actors` | Admin / Staff | Thay toan bo danh sach actor/character cua phim |
| `PUT` | `/api/admin/movies/{movieUuid}/media` | Admin / Staff | Thay toan bo danh sach media cua phim |

#### 2.1.6. Master data APIs phuc vu module phim

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `GET` | `/api/genres` | Public | Lay danh muc the loai de filter |
| `GET` | `/api/countries` | Public | Lay danh muc quoc gia de filter |
| `GET` | `/api/actors` | Public | Lay danh sach dien vien co filter |
| `GET` | `/api/admin/genres` | Admin / Staff | Danh sach genre cho CMS |
| `POST` | `/api/admin/genres` | Admin / Staff | Tao genre |
| `PUT` | `/api/admin/genres/{genreUuid}` | Admin / Staff | Cap nhat genre |
| `DELETE` | `/api/admin/genres/{genreUuid}` | Admin | Xoa genre |
| `GET` | `/api/admin/countries` | Admin / Staff | Danh sach country cho CMS |
| `POST` | `/api/admin/countries` | Admin / Staff | Tao country |
| `PUT` | `/api/admin/countries/{countryUuid}` | Admin / Staff | Cap nhat country |
| `DELETE` | `/api/admin/countries/{countryUuid}` | Admin | Xoa country |
| `GET` | `/api/admin/actors` | Admin / Staff | Danh sach actor cho CMS |
| `POST` | `/api/admin/actors` | Admin / Staff | Tao actor |
| `PUT` | `/api/admin/actors/{actorUuid}` | Admin / Staff | Cap nhat actor |
| `DELETE` | `/api/admin/actors/{actorUuid}` | Admin | Xoa actor |

#### 2.1.7. Rule nghiep vu nen chot

- `movie_genres(movie_uuid, genre_uuid)` la unique.
- `movie_countries(movie_uuid, country_uuid)` la unique.
- `movie_actors` nen chan trung theo `movieUuid + actorUuid + characterName` tai service layer.
- Khong cho chuyen sang `NOW_SHOWING` neu chua co poster chinh.
- Khong cho xoa phim neu phim da co `showtime`.
- Public API khong tra ve phim `DRAFT` hoac `HIDDEN`.

### 2.2. Room, Seat and Showtimes APIs

Các API quản lý phòng chiếu, ghế vật lý, lên lịch chiếu phim và khóa ghế thời gian thực.

#### 2.2.1. Room & Seat Management (Quản lý Phòng chiếu & Ghế)

##### 1. Thêm phòng chiếu mới
* **Endpoint:** `POST /api/admin/cinemas/{cinemaUuid}/rooms`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body (`CinemaRoomRequest`):**
  ```json
  {
    "roomCode": "ROOM-IMAX",
    "name": "Phòng chiếu IMAX",
    "capacity": 0,
    "roomType": "IMAX",
    "status": "ACTIVE"
  }
  ```
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 201,
    "message": "Created",
    "data": {
      "uuid": "88888888-8888-8888-8888-888888888888",
      "roomCode": "ROOM-IMAX",
      "name": "Phòng chiếu IMAX",
      "capacity": 0,
      "roomType": "IMAX",
      "status": "ACTIVE"
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 2. Cập nhật phòng chiếu
* **Endpoint:** `PUT /api/admin/rooms/{roomUuid}`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body (`CinemaRoomRequest`):**
  ```json
  {
    "roomCode": "ROOM-IMAX-NEW",
    "name": "Phòng IMAX Thượng Hạng",
    "capacity": 84,
    "roomType": "IMAX",
    "status": "ACTIVE"
  }
  ```
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": {
      "uuid": "88888888-8888-8888-8888-888888888888",
      "roomCode": "ROOM-IMAX-NEW",
      "name": "Phòng IMAX Thượng Hạng",
      "capacity": 84,
      "roomType": "IMAX",
      "status": "ACTIVE"
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 3. Lấy danh sách phòng chiếu của rạp
* **Endpoint:** `GET /api/cinemas/{cinemaUuid}/rooms`
* **Quyền truy cập:** `Public`
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": [
      {
        "uuid": "88888888-8888-8888-8888-888888888888",
        "roomCode": "ROOM-IMAX",
        "name": "Phòng chiếu IMAX",
        "capacity": 84,
        "roomType": "IMAX",
        "status": "ACTIVE"
      }
    ],
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 4. Sinh sơ đồ ghế tự động cho phòng chiếu
* **Endpoint:** `POST /api/admin/rooms/{roomUuid}/seats/generate`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body (`GenerateSeatMapRequest` - Gửi null hoặc trống để dùng cấu hình NASA mặc định):**
  ```json
  {
    "rowCount": 8,
    "seatsPerRow": 12
  }
  ```
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Sinh sơ đồ ghế thành công",
    "data": null,
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 5. Cập nhật thuộc tính/trạng thái ghế vật lý
* **Endpoint:** `PUT /api/admin/seats/{seatUuid}`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body (`UpdateSeatRequest`):**
  ```json
  {
    "seatTypeUuid": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "status": "MAINTENANCE"
  }
  ```
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": {
      "uuid": "77777777-1234-5678-90ab-cdef12345678",
      "rowName": "A",
      "seatNumber": 5,
      "status": "MAINTENANCE",
      "seatTypeName": "VIP",
      "isActive": true
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 6. Lấy danh sách ghế vật lý của phòng chiếu
* **Endpoint:** `GET /api/rooms/{roomUuid}/seats`
* **Quyền truy cập:** `Public`
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": [
      {
        "uuid": "77777777-1234-5678-90ab-cdef12345678",
        "rowName": "A",
        "seatNumber": 1,
        "status": "ACTIVE",
        "seatTypeName": "STANDARD",
        "isActive": true
      }
    ],
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

---

#### 2.2.2. Showtime Management (Quản lý Suất chiếu)

##### 1. Khởi tạo suất chiếu đơn lẻ
* **Endpoint:** `POST /api/admin/showtimes`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body (`ShowtimeRequest`):**
  ```json
  {
    "movieUuid": "55555555-4444-3333-2222-111111111111",
    "cinemaRoomUuid": "88888888-8888-8888-8888-888888888888",
    "startTime": "2026-06-22T19:30:00+07:00",
    "basePrice": 85000,
    "vipPrice": 120000,
    "couplePrice": 160000
  }
  ```
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 201,
    "message": "Created",
    "data": {
      "uuid": "11111111-1111-1111-1111-111111111111",
      "movieUuid": "55555555-4444-3333-2222-111111111111",
      "movieTitle": "Kẻ Ẩn Danh",
      "cinemaRoomUuid": "88888888-8888-8888-8888-888888888888",
      "cinemaRoomName": "Phòng chiếu IMAX",
      "startTime": "2026-06-22T19:30:00+07:00",
      "endTime": "2026-06-22T21:20:00+07:00",
      "basePrice": 85000,
      "vipPrice": 120000,
      "couplePrice": 160000,
      "status": "DRAFT"
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 2. Cập nhật trạng thái suất chiếu
* **Endpoint:** `PUT /api/admin/showtimes/{id}/status?status=OPEN_FOR_BOOKING`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": {
      "uuid": "11111111-1111-1111-1111-111111111111",
      "status": "OPEN_FOR_BOOKING"
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 3. Lấy toàn bộ suất chiếu (Dành cho quản lý)
* **Endpoint:** `GET /api/admin/showtimes`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": [
      {
        "uuid": "11111111-1111-1111-1111-111111111111",
        "movieTitle": "Kẻ Ẩn Danh",
        "cinemaRoomName": "Phòng chiếu IMAX",
        "startTime": "2026-06-22T19:30:00+07:00",
        "endTime": "2026-06-22T21:20:00+07:00",
        "basePrice": 85000,
        "status": "OPEN_FOR_BOOKING"
      }
    ],
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 4. Lấy danh sách suất chiếu công khai (Cho khách hàng)
* **Endpoint:** `GET /api/showtimes`
* **Quyền truy cập:** `Public`
* **Response Success:**
  *(Giống API admin nhưng chỉ trả ra các suất có trạng thái công khai: `OPEN_FOR_BOOKING`, `SOLD_OUT`, `SCHEDULED` và đã được lọc bỏ các bản ghi nháp/hủy)*

##### 5. Xem trước lịch chiếu tự sinh hàng loạt
* **Endpoint:** `POST /api/admin/showtimes/auto-generate/preview`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body (`AutoShowtimeRequest`):**
  ```json
  {
    "startDate": "2026-06-23",
    "endDate": "2026-06-23",
    "cinemaUuid": "77777777-7777-7777-7777-777777777777",
    "roomUuids": ["88888888-8888-8888-8888-888888888888"],
    "movieUuids": ["55555555-4444-3333-2222-111111111111"],
    "startTime": "08:00:00",
    "endTime": "23:30:00",
    "basePrice": 85000,
    "vipPrice": 120000,
    "couplePrice": 160000,
    "intervalMinutes": 15,
    "trailerBuffer": 10
  }
  ```
* **Response Success:**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": [
      {
        "movieUuid": "55555555-4444-3333-2222-111111111111",
        "movieTitle": "Kẻ Ẩn Danh",
        "cinemaRoomUuid": "88888888-8888-8888-8888-888888888888",
        "startTime": "2026-06-23T08:00:00+07:00",
        "endTime": "2026-06-23T09:50:00+07:00",
        "basePrice": 85000,
        "vipPrice": 120000,
        "couplePrice": 160000
      }
    ],
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 6. Lưu lịch chiếu tự sinh hàng loạt
* **Endpoint:** `POST /api/admin/showtimes/auto-generate/save`
* **Quyền truy cập:** `ADMIN`, `STAFF`
* **Request Body:** `List<ShowtimeRequest>` (Mảng kết quả đã chọn từ bước preview)
* **Response Success:** Danh sách các `ShowtimeResponse` đã lưu thành công vào Database.

---

#### 2.2.3. Showtime Seat Map & Locks (Sơ đồ ghế & Khóa giữ ghế)

##### 1. Lấy sơ đồ ghế chi tiết của suất chiếu
* **Endpoint:** `GET /api/showtimes/{showtimeUuid}/seat-map`
* **Quyền truy cập:** `Public / Authenticated` (Nếu đã đăng nhập, gửi kèm JWT token)
* **Query Parameters:**
  * `selectedSeatUuids` (Không bắt buộc): Danh sách UUID các ghế đang chọn hiện tại của user để giữ trạng thái.
* **Response Success (`ShowtimeSeatMapResponse`):**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": {
      "showtimeUuid": "11111111-1111-1111-1111-111111111111",
      "cinemaRoomName": "Phòng chiếu IMAX",
      "rows": [
        {
          "rowName": "A",
          "seats": [
            {
              "seatUuid": "77777777-1234-5678-90ab-cdef12345678",
              "seatNumber": 1,
              "price": 85000.0,
              "seatTypeName": "STANDARD",
              "availabilityStatus": "AVAILABLE",
              "lockedUntil": null,
              "selected": false,
              "blocked": false
            },
            {
              "seatUuid": "77777777-1234-5678-90ab-cdef87654321",
              "seatNumber": 2,
              "price": 85000.0,
              "seatTypeName": "STANDARD",
              "availabilityStatus": "LOCKED_BY_OTHER",
              "lockedUntil": "2026-06-22T10:55:00+07:00",
              "selected": false,
              "blocked": true
            }
          ]
        }
      ],
      "serverTime": "2026-06-22T10:50:00+07:00",
      "_serverTimeOffset": 0
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

##### 2. Đồng bộ hóa khóa giữ ghế tạm thời
* **Endpoint:** `PUT /api/showtimes/locks`
* **Quyền truy cập:** `Customer / Authenticated` (Bắt buộc đăng nhập)
* **Request Body (`SyncSeatLockRequest`):**
  ```json
  {
    "showtimeUuid": "11111111-1111-1111-1111-111111111111",
    "seatUuids": [
      "77777777-1234-5678-90ab-cdef12345678"
    ]
  }
  ```
* **Response Success (`SeatLockSyncResponse`):**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Thành công",
    "data": {
      "showtimeUuid": "11111111-1111-1111-1111-111111111111",
      "lockedSeatUuids": [
        "77777777-1234-5678-90ab-cdef12345678"
      ],
      "expiredAt": "2026-06-22T10:55:00+07:00"
    },
    "timestamp": "2026-06-22T10:50:00Z"
  }
  ```

---

### 2.3. Bookings API

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `POST` | `/api/bookings` | Customer (JWT) | Chon ghe va tao hoa don tam |
| `GET` | `/api/bookings/{id}` | Customer so huu / Staff | Xem chi tiet thong tin ve va QR |
| `GET` | `/api/bookings/my-history` | Customer (JWT) | Xem lich su mua ve ca nhan |
| `PUT` | `/api/bookings/{id}/cancel` | Staff / Admin | Huy ve hoac doi tra theo yeu cau |

### 2.4. Payment API

| Method | Endpoint | Quyen truy cap | Mo ta |
|---|---|---|---|
| `POST` | `/api/payments/create-url` | Customer (JWT) | Tao lien ket thanh toan sang MOMO/VNPAY |
| `GET/POST` | `/api/payments/callback` | Public | Nhan callback tu cong thanh toan de cap nhat booking |

---

## 3. Error Handling Format

De client de bat loi va xu ly thong bao, server nen tra ve response loi thong nhat. Hien tai backend dang dung `ApiResponse<T>` nen loi nghiep vu module phim nen follow dang:

```json
{
  "success": false,
  "code": 404,
  "message": "Phim khong ton tai",
  "timestamp": "2026-06-11T09:00:00Z"
}
```

Mot so error code nen co them cho module phim:
- `MOVIE_NOT_FOUND`
- `GENRE_NOT_FOUND`
- `COUNTRY_NOT_FOUND`
- `ACTOR_NOT_FOUND`
- `MOVIE_STATUS_INVALID`
- `MOVIE_MEDIA_INVALID`
- `MOVIE_HAS_SHOWTIME`
- `MOVIE_DUPLICATE_GENRE`
- `MOVIE_DUPLICATE_COUNTRY`
- `MOVIE_DUPLICATE_ACTOR`

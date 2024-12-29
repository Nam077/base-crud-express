# STI EXPRESS BOILERPLATE

Boilerplate cho dự án Express + TypeScript với các tính năng hiện đại, tập trung vào type-safety và khả năng mở rộng.

## Project Structure

```
src/
├── configs/           # Application configurations
│   ├── env.config.ts      # Environment config
│   ├── database.config.ts # Database config
│   └── routing.config.ts  # Routing config
├── constants/         # Constants
│   └── http.constant.ts   # HTTP status codes & messages
├── controllers/       # Request handlers
│   └── v1/               # API version 1
├── decorators/       # Custom decorators
│   └── inject-repository.decorator.ts
├── dtos/             # Data Transfer Objects
│   └── user/             # User-related DTOs
├── entities/         # Database entities
│   └── user.entity.ts
├── exceptions/       # Exception handling
│   └── http.exception.ts
├── interfaces/       # Interfaces & types
│   └── crud.interface.ts
├── middlewares/      # Middleware
│   ├── error.middleware.ts
│   ├── validation.middleware.ts
│   └── response-logger.middleware.ts
├── services/         # Business logic
│   ├── user.service.ts
│   └── logger.service.ts
└── app.ts           # Express application setup
```

## Features

### 1. TypeScript + Express
- Kiểm tra kiểu dữ liệu nghiêm ngặt
- Bí danh đường dẫn (@entity, @service, v.v.)
- Tự động tải lại khi phát triển

### 2. Tiêm Phụ Thuộc
- Container TypeDI
- Trang trí Service
- Tiêm Repository

### 3. Cơ Sở Dữ Liệu (TypeORM)
- Mô hình dựa trên Entity
- Mẫu Repository
- Hỗ trợ Migration
- Xóa mềm
- Hỗ trợ quan hệ

### 4. Xác Thực & Chuyển Đổi
- Trang trí class-validator
- Xác thực dữ liệu đầu vào
- Chuyển đổi DTO
- Quy tắc xác thực tùy chỉnh

### 5. Định Tuyến & Điều Khiển
- Định tuyến dựa trên Decorator
- Kiểm soát phiên bản (/v1/*)
- Xử lý dữ liệu yêu cầu
- Chuẩn hóa phản hồi

### 6. Hệ Thống Ghi Log
- Sử dụng Winston
- Tự động xoay vòng theo ngày
- Log màu trong console
- Ghi log yêu cầu/phản hồi
- Ghi log lỗi
- Sẵn sàng cho môi trường sản xuất

### 7. Xử Lý Lỗi
- Xử lý lỗi tập trung
- Ngoại lệ HTTP tùy chỉnh
- Định dạng lỗi xác thực
- Thông tin gỡ lỗi trong môi trường phát triển
- Phản hồi lỗi chuẩn hóa

### 8. Môi Trường & Cấu Hình
- Nhiều môi trường (phát triển/sản xuất)
- Xác thực môi trường
- Cấu hình an toàn kiểu
- Bảo mật thông tin nhạy cảm

## Cài Đặt & Khởi Động

1. Tải về:

```bash
git clone [đường-dẫn-repository]
cd sti-express
```

2. Cài đặt thư viện:

```bash
pnpm install
```

3. Cấu hình môi trường:

```bash
cp .env.example .env
```

Chỉnh sửa file .env theo nhu cầu

4. Chế độ phát triển:

```bash
pnpm dev
```

5. Triển khai:

```bash
pnpm build
pnpm start
```

## Kiểm Thử API

### Kiểm Thử Qua Trình Duyệt

- Truy cập http://localhost:3000/test.html
- Giao diện form để test các API

### Kiểm Thử Qua Script

```bash
node scripts/test-create-user.js
```

### Các Điểm Cuối API

- `POST   /api/v1/users` - Tạo người dùng
- `GET    /api/v1/users` - Lấy danh sách người dùng
- `GET    /api/v1/users/:id` - Lấy thông tin người dùng
- `PUT    /api/v1/users/:id` - Cập nhật người dùng
- `DELETE /api/v1/users/:id` - Xóa người dùng

## Định Dạng Phản Hồi

### Phản Hồi Thành Công

```json
{
  "success": true,
  "data": {
    // dữ liệu phản hồi
  },
  "meta": {
    // thông tin phân trang (nếu có)
  }
}
```

### Phản Hồi Lỗi

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": 400,
    "message": "Thông báo lỗi",
    "details": [
      // chi tiết lỗi xác thực hoặc thông tin bổ sung
    ]
  }
}
```

## Yêu Cầu Môi Trường

- Node.js >= 16
- TypeScript >= 4.5
- SQLite (cơ sở dữ liệu mặc định)
- pnpm (quản lý gói)

## Các Lệnh Có Sẵn

- `pnpm dev`: Chạy môi trường phát triển với tự động tải lại
- `pnpm build`: Đóng gói cho môi trường sản xuất
- `pnpm start`: Chạy phiên bản đóng gói
- `pnpm lint`: Kiểm tra chuẩn mã nguồn
- `pnpm lint:fix`: Tự động sửa chuẩn mã nguồn

## Lưu Ý Quan Trọng

### 1. Bảo Mật

- Luôn xác thực dữ liệu đầu vào
- Sử dụng helmet middleware
- Cấu hình CORS phù hợp
- Không đưa file .env lên git

### 2. Phát Triển

- Tuân thủ chuẩn mã nguồn
- Chạy lint trước khi commit
- Kiểm tra kiểu dữ liệu đầy đủ

### 3. Triển Khai

- Kiểm tra biến môi trường
- Cấu hình ghi log phù hợp
- Thiết lập giám sát
- Sao lưu cơ sở dữ liệu

### 4. Hiệu Suất

- Bật nén dữ liệu
- Sử dụng bộ nhớ đệm khi cần
- Tối ưu truy vấn cơ sở dữ liệu

## Đóng Góp

Mọi đóng góp đều được chào đón. Vui lòng:

1. Fork repository
2. Tạo nhánh tính năng
3. Commit thay đổi
4. Push lên nhánh
5. Tạo Pull Request

## Tác Giả

[NamUndefined](https://github.com/Nam077)

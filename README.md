# 🚀 BFD Company Website & News CMS

> **Website giới thiệu công ty & Hệ thống quản trị tin tức (Full-Stack JS)**

Dự án xây dựng website public cho công ty công nghệ BFD và hệ thống CMS quản trị nội dung mạnh mẽ. Ứng dụng được xây dựng theo kiến trúc **Monorepo**, áp dụng các công nghệ hiện đại nhất hiện nay như **Next.js App Router, NestJS, Redis Caching, Background Queue (BullMQ)** và **Real-time Socket.io**.

## 🛠 Tech Stack

### Frontend (Client)

  * **Core:** Next.js 14 (App Router), TypeScript.
  * **UI/UX:** Ant Design v5, Tailwind CSS.
  * **State Management:** TanStack Query (React Query).
  * **Form Handling:** React Hook Form + Zod Validation.
  * **Rendering:** SSR (Server-Side Rendering) & ISR (Incremental Static Regeneration).

### Backend (Server)

  * **Framework:** NestJS (Module-based Architecture).
  * **Database:** MongoDB + Mongoose ODM.
  * **Caching:** Redis (Smart Caching Strategy).
  * **Queue:** BullMQ (Xử lý tác vụ gửi Email nền).
  * **Security:** JWT Auth, Helmet, Rate Limiting, BCrypt.
  * **Real-time:** Socket.io.

### Infrastructure & DevOps

  * **Storage:** MinIO (S3 Compatible Object Storage).
  * **Containerization:** Docker, Docker Compose.

-----

## ✨ Tính Năng Nổi Bật

### 1\. Phân hệ Public (Khách truy cập)

  * **Trang chủ:** Giao diện hiện đại, Banner động, Tin nổi bật (ISR Revalidate 60s).
  * **Tin tức:**
      * Danh sách tin phân trang, lọc theo danh mục.
      * Tìm kiếm bài viết.
      * Chi tiết bài viết với giao diện Rich Text.
      * **Tin liên quan:** Gợi ý bài viết cùng chuyên mục.
  * **Liên hệ:** Form liên hệ tích hợp API gửi vào hàng đợi xử lý (Queue).
  * **Giới thiệu:** Trang tĩnh giới thiệu lịch sử và sứ mệnh công ty.

### 2\. Phân hệ Admin CMS (Quản trị viên)

  * **Dashboard:** Thống kê tổng quan, biểu đồ Real-time cập nhật khi có bài mới.
  * **Quản lý Bài viết (Article):**
      * Trình soạn thảo văn bản (TinyMCE) tích hợp upload ảnh.
      * Quản lý trạng thái: Nháp (Draft) / Công khai (Published).
      * Upload ảnh Thumbnail (MinIO).
  * **Quản lý Chuyên mục (Category):** CRUD đầy đủ, tự động tạo Slug.
  * **Quản lý Người dùng (User):** Phân quyền quản trị.
  * **Hệ thống:** Seed data tự động tài khoản Admin mặc định.

-----

## ⚙️ Cài Đặt & Chạy Dự Án

### Yêu cầu tiên quyết (Prerequisites)

  * Node.js \>= 18
  * Docker & Docker Compose

### Cách 1: Chạy bằng Docker Compose (Khuyên dùng)

Đây là cách nhanh nhất để dựng toàn bộ hạ tầng (Mongo, Redis, MinIO) và ứng dụng.

1.  **Clone dự án:**

    ```bash
    git clone https://github.com/your-username/bfd-project.git
    cd bfd-project
    ```

2.  **Khởi chạy hệ thống:**

    ```bash
    docker-compose up -d --build
    ```

3.  **Truy cập ứng dụng:**

      * **Frontend (Public):** `http://localhost:3000`
      * **Admin CMS:** `http://localhost:3000/admin`
      * **Backend API:** `http://localhost:8080`
      * **MinIO Console:** `http://localhost:9001`

### Cách 2: Chạy Thủ Công (Development)

Nếu bạn muốn chạy code dev mà không dùng Docker cho App (chỉ dùng Docker cho DB).

1.  **Khởi tạo Database & Services (Bắt buộc):**

    ```bash
    docker-compose up -d mongo redis minio
    ```

2.  **Setup Backend (Server):**

    ```bash
    cd server
    npm install
    npm run start:dev
    ```

    *Server sẽ chạy tại: `http://localhost:8080`*

3.  **Setup Frontend (Client):**

    ```bash
    cd client
    npm install
    npm run dev
    ```

    *Client sẽ chạy tại: `http://localhost:3000`*

-----

## 🔐 Tài Khoản Mặc Định (Seed Data)

Hệ thống sẽ tự động tạo tài khoản Admin khi khởi động lần đầu (nếu chưa có).

  * **URL Đăng nhập:** `http://localhost:3000/admin/login`
  * **Username:** `admin`
  * **Password:** `admin123`

-----

## 📡 API Documentation (Ví dụ Endpoint)

Backend cung cấp API RESTful chuẩn. Dưới đây là một số endpoint chính:

### Health Check

  * `GET /healthz`: Kiểm tra trạng thái server (200 OK).

### Authentication

  * `POST /auth/login`: Đăng nhập lấy Access Token.
  * `GET /auth/profile`: Lấy thông tin user hiện tại (Yêu cầu Bearer Token).

### Articles (Tin tức)

  * `GET /articles`: Lấy danh sách bài viết (Hỗ trợ query: `page`, `limit`, `q`, `category`).
      * *Có Redis Caching (TTL 3 phút).*
  * `GET /articles/public/:slug`: Lấy chi tiết bài viết theo Slug.
      * *Có Redis Caching (TTL 1 giờ) + Active Invalidation.*
  * `POST /articles`: Tạo bài viết mới (Yêu cầu Token).
  * `PATCH /articles/:id`: Cập nhật bài viết (Yêu cầu Token).

### Contacts (Liên hệ)

  * `POST /contacts`: Gửi thông tin liên hệ.
      * *Xử lý bất đồng bộ qua BullMQ Worker.*

-----

## 📁 Cấu Trúc Thư Mục

Dự án được tổ chức theo mô hình Monorepo:

```bash
.
├── client/                 # Next.js Application
│   ├── src/app/            # App Router (Pages)
│   ├── src/components/     # UI Components (Antd + Tailwind)
│   ├── src/services/       # API Integration
│   └── public/             # Static Assets
├── server/                 # NestJS Application
│   ├── src/modules/        # Feature Modules (Articles, Users...)
│   ├── src/auth/           # Authentication Logic
│   └── src/events/         # Socket.io Gateway
├── docker-compose.yml      # Container Orchestration
└── README.md               # Project Documentation
```

-----

## 🛡️ Bảo Mật & Hiệu Năng

1.  **Rate Limiting:** Giới hạn 20 requests/phút để chống Spam/DDoS.
2.  **Helmet:** Bảo vệ HTTP Headers.
3.  **Active Caching:** Dữ liệu Public được cache để tăng tốc độ, nhưng tự động xóa cache khi Admin cập nhật dữ liệu (đảm bảo tính nhất quán).
4.  **File Management:** Cơ chế Upload vào thư mục `Temp`, chỉ di chuyển sang `Official` khi bài viết được lưu thành công. Có Cronjob dọn dẹp file rác.

-----

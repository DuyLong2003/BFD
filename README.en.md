# 🚀 BFD Corporate Website & News CMS

> **Enterprise-grade Corporate Website & Content Management System (Full-Stack JS)**

A comprehensive Full-Stack web application designed with a **Monorepo** architecture. This project demonstrates advanced proficiency in modern web development, featuring **Next.js App Router** for the frontend and **NestJS** for a scalable backend API. It integrates high-performance solutions such as **Redis Caching**, **Asynchronous Queue Processing (BullMQ)**, and **Real-time WebSockets**.

-----

## 🛠 Tech Stack & Architecture

### Frontend (Client)

  * **Framework:** Next.js 14 (App Router) with **TypeScript**.
  * **UI/UX:** Ant Design v5, Tailwind CSS, Responsive Design.
  * **Data Fetching:** TanStack Query (React Query) for server state management.
  * **Validation:** React Hook Form combined with Zod schemas.
  * **Rendering Strategy:** Hybrid approach using **SSR** (Server-Side Rendering) for dynamic content and **ISR** (Incremental Static Regeneration) for high-traffic static pages.

### Backend (Server)

  * **Framework:** NestJS (Modular Architecture, Dependency Injection).
  * **Database:** MongoDB via Mongoose ODM (NoSQL).
  * **Caching Strategy:** **Redis** implementation with an "Active Invalidation" pattern to ensure data consistency between Admin updates and Public views.
  * **Message Queue:** **BullMQ** (Redis-based) for handling background jobs (e.g., asynchronous email processing).
  * **Real-time:** **Socket.io** for live dashboard updates.
  * **Security:** Helmet (HTTP Headers), Throttler (Rate Limiting), BCrypt, JWT Authentication (Guards & Decorators).

### Infrastructure

  * **Object Storage:** **MinIO** (S3-compatible) for secure file/image storage.
  * **Containerization:** Docker & Docker Compose for orchestration.

-----

## ✨ Key Features

### 1\. Public Portal (Client-Facing)

  * **High-Performance Landing Page:** Optimized with ISR (60s revalidation) for blazing-fast load times.
  * **News Hub:**
      * Advanced pagination and filtering by category.
      * **Debounced Search** for optimal user experience.
      * **Related Articles:** Intelligent content suggestion engine.
  * **Article Detail:** Secure HTML rendering (Sanitized Rich Text) with optimized SEO metadata.
  * **Contact System:** Asynchronous form submission handled via message queues to ensure reliability.

### 2\. Admin CMS (Internal Tool)

  * **Interactive Dashboard:** Real-time statistics visualization using WebSockets.
  * **Content Management (CRUD):**
      * Rich Text Editor (TinyMCE) integration.
      * Media Management: Drag-and-drop image upload to MinIO.
      * Workflow Management: Draft vs. Published status.
  * **Category & User Management:** Full CRUD capabilities with Role-Based Access Control (RBAC).
  * **Automated Seeding:** Auto-generation of default Super Admin credentials upon initial deployment.

-----

## ⚙️ Installation & Setup

### Prerequisites

  * Node.js (v18 or higher)
  * Docker & Docker Compose

### Option 1: Docker Compose (Recommended)

Rapidly provision the entire infrastructure (Database, Cache, Object Storage, API, and Frontend).

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/bfd-project.git
    cd bfd-project
    ```

2.  **Start services:**

    ```bash
    docker-compose up -d --build
    ```

3.  **Access the application:**

      * **Public Site:** `http://localhost:3000`
      * **CMS Admin:** `http://localhost:3000/admin`
      * **API Server:** `http://localhost:8080`
      * **MinIO Console:** `http://localhost:9001`

### Option 2: Manual Setup (Development Mode)

If you prefer running the Node.js applications locally while keeping databases in Docker.

1.  **Initialize Infrastructure:**

    ```bash
    docker-compose up -d mongo redis minio
    ```

2.  **Setup Backend:**

    ```bash
    cd server
    npm install
    npm run start:dev
    ```

    *Server is listening on: `http://localhost:8080`*

3.  **Setup Frontend:**

    ```bash
    cd client
    npm install
    npm run dev
    ```

    *Client is running on: `http://localhost:3000`*

-----

## 🔐 Default Credentials (Seed Data)

Upon the first launch, the system automatically seeds a Super Admin account if the database is empty.

  * **Login URL:** `http://localhost:3000/admin/login`
  * **Username:** `admin`
  * **Password:** `admin123`

-----

## 📡 API Documentation Highlights

The Backend adheres to RESTful API standards. Key endpoints include:

### System Health

  * `GET /healthz`: Health check endpoint for container orchestrators (Render/K8s).

### Authentication

  * `POST /auth/login`: Issue JWT Access Token.
  * `GET /auth/profile`: Retrieve authenticated user profile (Bearer Token required).

### Articles Management

  * `GET /articles`: Retrieve list with pagination, filtering, and sorting.
      * *Performance:* Cached via Redis (TTL: 3 mins).
  * `GET /articles/public/:slug`: Retrieve single article details.
      * *Performance:* Cached via Redis (TTL: 1 hour) with immediate invalidation on update.
  * `GET /articles/public/related/:slug`: Fetch related content based on category taxonomy.

### Asynchronous Operations

  * `POST /contacts`: Submit contact inquiry.
      * *Mechanism:* Request is validated -\> Saved to DB (Pending) -\> Pushed to BullMQ -\> Worker processes email -\> Status updated to Processed.

-----

## 📁 Project Structure

The project follows a strict Monorepo structure for better code sharing and maintenance.

```bash
.
├── client/                 # Next.js Frontend Application
│   ├── src/app/            # App Router (Pages & Layouts)
│   ├── src/components/     # Reusable UI Components (Atomic Design)
│   ├── src/services/       # API Integration Layer (Axios)
│   └── public/             # Static Assets
├── server/                 # NestJS Backend Application
│   ├── src/modules/        # Feature Modules (Articles, Users, Contacts...)
│   ├── src/auth/           # Authentication & Guard Logic
│   └── src/events/         # WebSocket Gateway
├── docker-compose.yml      # Infrastructure Orchestration
└── README.md               # Project Documentation
```

-----

## 🛡️ Security & Performance

1.  **Rate Limiting:** Global Guard configured to limit 20 requests/minute to prevent Brute-force and DDoS attacks.
2.  **Secure Headers:** Implemented **Helmet** to set secure HTTP headers (XSS Filter, HSTS, etc.).
3.  **Smart Caching:** High-performance data retrieval using Redis with a robust invalidation strategy to ensure data integrity.
4.  **Optimized File Handling:** "Temp-to-Permanent" file lifecycle management to prevent storage bloat from abandoned uploads.

-----

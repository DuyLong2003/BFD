Cấu trúc dự án:
client/src/
├── app/                  # Next.js App Router (Pages)
│   ├── admin/            # Các trang Admin
│   ├── (public)/         # Các trang Public (Home, News...)
│   ├── layout.tsx        # Root Layout
│   └── page.tsx          # Home Page
├── components/           # UI Components
│   ├── core/             # Các component gốc (Button, Input...) đã được bọc lại
│   ├── layout/           # Header, Footer, Sidebar
│   └── modules/          # Component nghiệp vụ (LoginForm, ArticleCard...)
├── lib/                  # Cấu hình thư viện (Axios, React Query)
├── providers/            # Các Context Providers
├── theme/                # Cấu hình màu sắc, design token
├── types/                # TypeScript Interfaces/Types
├── utils/                # Hàm tiện ích (Format date, currency...)
└── hooks/                # Custom React Hooks
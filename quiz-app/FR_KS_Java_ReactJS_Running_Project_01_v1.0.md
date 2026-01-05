# **React With Spring Boot Web API**
**Training Assignments**

**CODE: FR.KS.JAVA.REACTJS.P.L001**

**TYPE: MEDIUM**

**DURATION: 900 MINUTES**

## **REACTJS WITH SPRING BOOT WEB API: QUIZ APPLICATION**

### **Objectives:**
* **Master React 19 Fundamentals:** Hiểu sâu về Functional Components, Hooks, và các tính năng mới của React 19 (Actions, `use` hook, Compiler).
* **Component & Hook Design:** Tư duy thiết kế "Atomic Design", tách biệt logic (Hooks) và giao diện (UI Components).
* **Advanced Routing:** Xây dựng SPA với Nested Routes, Protected Routes và Dynamic Routing.
* **Modern Form Handling:** Quản lý form phức tạp, validation schema (Zod/Yup) và tối ưu re-render.
* **Data Management & API:** Tích hợp **Spring Boot REST API**, xử lý bất đồng bộ, caching và state management.
* **Security:** Implement JWT Authentication (Access Token & Refresh Token flow).
* **Code Quality & Testing:** Viết Unit Test, đảm bảo Clean Code và Performance tối ưu.
* **DevOps Mindset:** Containerization ứng dụng với Docker.

### **Prerequisites:**
* **IDE:** Visual Studio Code (Recommend installing extensions: ES7+, Tailwind CSS IntelliSense, Prettier).
* **Runtime:** Node.js (LTS version).
* **Backend:** Đã chạy thành công Project Backend **Spring Boot Web API** (cung cấp kèm theo hoặc học viên đã làm ở module trước).
* **Tools:** Docker Desktop (cho phần Bonus).

### **Problem Requirements:**
Bạn sẽ xây dựng một ứng dụng Frontend React hiện đại để tương tác với hệ thống Backend Quiz Management viết bằng Spring Boot.
* **Design Compliance:** Học viên **BẮT BUỘC** tuân thủ UI Wireframe được cung cấp trong file `REACT.P.L001.Design.zip`. Mọi sự thay đổi về bố cục (layout), màu sắc (color palette) và dòng chảy người dùng (user flow) cần phải có lý do hợp lý về UX hoặc được Mentor chấp thuận.
* **Tech Stack:** React 19 (Vite), Tailwind CSS, React Router v6/v7, Axios/Fetch.

---

### **Task 1: React Fundamentals & Project Architecture**
**Description:**
Thiết lập dự án chuẩn mực (Scaffolding), định nghĩa cấu trúc thư mục và xây dựng các UI component cơ bản.

**Function Requirements:**
* **Setup:** Khởi tạo project với Vite (`npm create vite@latest`). Cấu hình Tailwind CSS.
* **Directory Structure:** Tổ chức theo feature hoặc domain (e.g., `src/features/auth`, `src/features/quiz`) hoặc theo atomic (atoms, molecules, organisms).
* **Common Components:**
    * `Header`, `Footer` (Dynamic Year).
    * `QuizCard`: Hiển thị thông tin quiz (Title, Thumbnail, Description, Difficulty).
* **Static Pages:** `HomePage` (Mock data), `AboutPage`.

**Optional & Best Practices (Bonus Points):**
* **TypeScript:** Sử dụng TypeScript thay vì JavaScript thuần để đảm bảo Type Safety.
* **Absolute Imports:** Cấu hình `vite.config.js` để sử dụng alias (`@/components/...`) thay vì relative path (`../../components/...`).
* **Prop Validation:** Sử dụng `PropTypes` (nếu dùng JS) hoặc Interface (nếu dùng TS) cho tất cả components.
* **Dark Mode:** Cấu hình Tailwind để hỗ trợ Dark/Light theme toggle ngay từ đầu.

**Estimated Time:** 150 minutes.

---

### **Task 2: Routing, Layouts & Form Strategy**
**Description:**
Xây dựng hệ thống điều hướng (Navigation) và các Form quan trọng.

**Function Requirements:**
* **Routing:**
    * Cấu hình `react-router-dom`.
    * Path: `/`, `/quizzes`, `/auth/login`, `/admin/dashboard`,...
* **Layout Pattern:**
    * `MainLayout`: Navbar, Content, Footer (User views).
    * `AuthLayout`: Center-aligned form, Background image (Login/Register).
    * `AdminLayout`: Sidebar, Topbar, Content (Management views).
* **Forms:**
    * **Auth:** Login & Register Form (Validation: required, email format, password strength).
    * **Feedback:** Contact form.
    * **Action:** Sử dụng thư viện `react-hook-form` để quản lý state.

**Optional & Best Practices (Bonus Points):**
* **Schema Validation:** Tích hợp thư viện **Zod** hoặc **Yup** vào `react-hook-form` để validate dữ liệu một cách chặt chẽ.
* **Dynamic Breadcrumbs:** Tạo component Breadcrumb tự động cập nhật theo route hiện tại.
* **Lazy Loading:** Sử dụng `React.lazy()` và `<Suspense>` để tải code (Code Splitting) cho các trang Admin hoặc trang ít truy cập.

**Estimated Time:** 180 minutes.

---

### **Task 3: Integration with Spring Boot API**
**Description:**
Kết nối Frontend với Backend Spring Boot, thay thế Mock Data bằng dữ liệu thực.

**Function Requirements:**
* **API Client:**
    * Cấu hình `axios` instance (BaseURL, Timeout).
    * Xử lý global error handling (ví dụ: Toast notification khi lỗi 500/400).
* **Custom Hooks:**
    * `useAuth()`: Login/Register call.
    * `useQuiz()`: Fetch list, get detail.
    * Thay thế Class Service bằng Functional Hooks.
* **Data Integration:**
    * Hiển thị danh sách Quiz từ API `/api/v1/quizzes`.
    * Hiển thị danh sách câu hỏi.
    * Xử lý trạng thái `isLoading`, `isError`.

**Optional & Best Practices (Bonus Points):**
* **React Query (TanStack Query):** Sử dụng thư viện này để quản lý Server State (Caching, Auto-refetching, Synchronization) thay vì dùng `useEffect` thủ công. Đây là tiêu chuẩn ngành hiện nay.
* **Skeleton Loading:** Thay thế Spinner đơn giản bằng Skeleton UI (Content placeholder) để tăng trải nghiệm UX.
* **Error Boundary:** Implement React Error Boundary để bắt lỗi render component mà không làm crash toàn bộ app.

**Estimated Time:** 200 minutes.

---

### **Task 4: Security & Advanced State Management**
**Description:**
Bảo mật ứng dụng, phân quyền người dùng và quản lý trạng thái toàn cục.

**Function Requirements:**
* **Authentication Flow:**
    * Lưu trữ JWT (Access Token) an toàn (LocalStorage hoặc In-Memory).
    * **Axios Interceptor:** Tự động đính kèm header `Authorization: Bearer <token>` vào request.
* **Authorization:**
    * **Protected Route:** Chặn truy cập vào `/admin/*` nếu user không có role `ADMIN` (Lấy role từ Payload JWT hoặc User Profile API).
    * Redirect user chưa login về trang Login, lưu lại `returnUrl`.
* **Context API:**
    * `AuthContext`: Cung cấp thông tin user (`user`, `isAuthenticated`, `login`, `logout`) cho toàn bộ app.

**Optional & Best Practices (Bonus Points):**
* **Refresh Token Rotation:** Xử lý logic tự động lấy Access Token mới khi token cũ hết hạn (dùng Axios Interceptor `response.use`).
* **RBAC Directives:** Tạo custom component `<Authorize role="ADMIN">...</Authorize>` để ẩn/hiện nút bấm dựa trên quyền hạn.
* **Unit Testing:** Viết test cho `AuthContext` hoặc các ultility functions bằng **Vitest**.

**Estimated Time:** 180 minutes.

---

### **Task 5: Deployment & Integration**
**Description:**
Hoàn thiện luồng nghiệp vụ, build production và chuẩn bị deploy.

**Function Requirements:**
* **Full Flow:**
    * User: Login -> Chọn Quiz -> Làm bài -> Submit -> Xem kết quả.
    * Admin: CRUD Quiz/Question (Tuân thủ business rule: Không sửa câu hỏi khi Quiz đang active).
* **Environment:**
    * Cấu hình `.env.development` (API localhost) và `.env.production` (API server thật).
* **Build:**
    * Chạy `npm run build`. Đảm bảo không có lỗi linting.

**Optional & Best Practices (Bonus Points):**
* **Performance Audit:** Chạy Lighthouse và đạt điểm Performance > 90 (Tối ưu ảnh, script).
* **PWA:** Cấu hình để App có thể cài đặt (Installable) như một ứng dụng native (Manifest.json, Service Worker cơ bản).

**Estimated Time:** 120 minutes.

---

### **Bonus Task: Containerization (DevOps)**
**Description:**
Đóng gói Frontend và cấu hình chạy cùng Backend Spring Boot bằng Docker.

**Requirements:**
1.  **Dockerfile:**
    * **Stage 1 (Builder):** Node image, build source -> `dist`.
    * **Stage 2 (Runner):** Nginx Alpine image, copy `dist` folder vào `/usr/share/nginx/html`.
    * Custom `nginx.conf` để handle React Router (redirect 404 về index.html).
2.  **Docker Compose:**
    * Viết file `docker-compose.yml` khởi chạy cả Frontend và Backend (nếu có image backend) hoặc chỉ Frontend.
    * Frontend chạy port `3000` hoặc `80`.

**Enhancement:**
* Cấu hình Nginx để làm Reverse Proxy (chuyển `/api` call sang container backend) để tránh lỗi CORS.

---

### **Mark Scale & Detailed Notes**

| Hạng mục (Category) | Trọng số | Yêu cầu Đạt (Pass) | Yêu cầu Xuất sắc (High Distinction - Bonus) | Note chi tiết (Dành cho Trainer audit) |
| :--- | :--- | :--- | :--- | :--- |
| **UI/UX & Design Compliance** | 10% | Tuân thủ 80% wireframe. Bố cục không bị vỡ trên màn hình chuẩn. | Pixel-perfect so với design. Responsive tốt trên Mobile. Có Dark Mode. | Kiểm tra kỹ padding, margin, font-size so với design. |
| **React Fundamentals (Components/Props)** | 15% | Chia nhỏ component. Code chạy không lỗi console cơ bản. | Sử dụng TypeScript/PropTypes chặt chẽ. Cấu trúc thư mục clean, scalable (Atomic/Feature-based). | Soi kỹ việc hard-code dữ liệu trong component. |
| **Routing & Forms** | 15% | Điều hướng đúng. Form submit được dữ liệu. Validate cơ bản (required). | Sử dụng Zod/Yup validation. Lazy loading routes. Custom Hook Form components. | Kiểm tra UX khi submit form (disable button, loading state). |
| **API Integration (Spring Boot)** | 20% | Gọi được API Spring Boot. Hiển thị dữ liệu đúng. Xử lý loading state. | Sử dụng **React Query**. Xử lý Error Boundary. Cấu hình Axios Interceptor chuẩn. | API URL không được hardcode, phải dùng ENV. |
| **Security (Auth/Authz)** | 15% | Login/Logout hoạt động. Chặn được route Admin cơ bản. | Implement **Refresh Token** flow. RBAC granular (ẩn hiện nút theo quyền). | Thử truy cập trực tiếp link `/admin` khi chưa login xem có bị đá ra không. |
| **Code Quality & Performance** | 15% | Code format gọn gàng. Không có unused vars. | Lighthouse score cao (>90). Không có re-render thừa thãi (dùng `useMemo`, `useCallback` hợp lý). | Review code xem có lạm dụng `useEffect` không. |
| **Docker & Deployment** | 10% | Có Dockerfile build thành công image. | Docker Multi-stage build tối ưu size. Nginx config chuẩn SPA. | Chạy thử `docker run` xem app có lên hình không. |
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import ManagementLayout from './components/layout/ManagementLayout';
import { Home, Quizzes, About, Contact } from './pages';
import { Login, Register } from './pages/auth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Lazy load management pages
const Management = lazy(() => import('./pages/management/Management'));
const QuestionManagement = lazy(() => import('./pages/management/QuestionManagement'));
const QuizManagement = lazy(() => import('./pages/management/QuizManagement'));
const RoleManagement = lazy(() => import('./pages/management/RoleManagement'));
const UserManagement = lazy(() => import('./pages/management/UserManagement'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            theme="colored"
          />
          <Router>
      <Routes>
        {/* Routes with MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/quizzes" element={<MainLayout><Quizzes /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

        {/* Auth routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Management routes with ManagementLayout and lazy loading */}
        <Route 
          path="/management" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ManagementLayout><Management /></ManagementLayout>
            </Suspense>
          } 
        />
        <Route 
          path="/management/quiz" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ManagementLayout><QuizManagement /></ManagementLayout>
            </Suspense>
          } 
        />
        <Route 
          path="/management/question" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ManagementLayout><QuestionManagement /></ManagementLayout>
            </Suspense>
          } 
        />
        <Route 
          path="/management/user" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ManagementLayout><UserManagement /></ManagementLayout>
            </Suspense>
          } 
        />
        <Route 
          path="/management/role" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ManagementLayout><RoleManagement /></ManagementLayout>
            </Suspense>
          } 
        />
      </Routes>
    </Router>
        </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

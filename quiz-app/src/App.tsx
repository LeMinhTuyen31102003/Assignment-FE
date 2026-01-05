import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import ManagementLayout from './components/layout/ManagementLayout';
import { Home, Quizzes, About, Contact } from './pages';
import { Management, QuestionManagement, QuizManagement, RoleManagement, UserManagement } from './pages/management';
import { Login, Register } from './pages/auth';

function App() {
  return (
    <ThemeProvider>
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

        {/* Management routes with ManagementLayout */}
        <Route path="/management" element={<ManagementLayout><Management /></ManagementLayout>} />
        <Route path="/management/quiz" element={<ManagementLayout><QuizManagement /></ManagementLayout>} />
        <Route path="/management/question" element={<ManagementLayout><QuestionManagement /></ManagementLayout>} />
        <Route path="/management/user" element={<ManagementLayout><UserManagement /></ManagementLayout>} />
        <Route path="/management/role" element={<ManagementLayout><RoleManagement /></ManagementLayout>} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/common';
import { useAuthContext } from '@/contexts/useAuthContext';
import Authorize from '@/components/auth/Authorize';
import logo from '../../assets/images/home/logo.png';
import adminAvatar from '../../assets/images/user/admin.png';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-5 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-semibold text-gray-800 dark:text-white">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <span>Quizzes</span>
          </Link>
          
          <nav className="flex gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/quizzes" 
              className={`font-medium transition-colors ${
                isActive('/quizzes') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              Quizzes
            </Link>
            <Authorize role="ADMIN">
              <Link 
                to="/management" 
                className={`font-medium transition-colors ${
                  isActive('/management') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
                }`}
              >
                Management
              </Link>
            </Authorize>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                isActive('/about') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${
                isActive('/contact') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer hover:border-blue-600 hover:scale-105 transition-all overflow-hidden p-0 bg-transparent"
              >
                <img 
                  src={adminAvatar} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute top-full mt-2.5 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[180px] opacity-100 visible translate-y-0 transition-all z-50">
                  <div className="absolute top-[-8px] right-[15px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white dark:border-b-gray-800"></div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2.5 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-500 transition-all"
                  >
                    {user?.fullName || 'User'}
                  </Link>
                  <Link 
                    to="/change-password" 
                    className="block px-4 py-2.5 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-500 transition-all"
                  >
                    Change Password
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left block px-4 py-2.5 text-red-500 text-sm border-t border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>          ) : (
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-blue-500 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

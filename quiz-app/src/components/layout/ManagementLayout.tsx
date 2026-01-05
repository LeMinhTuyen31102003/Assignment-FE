import { type ReactNode } from 'react';
import Header from './Header';
import ManagementSidebar from './ManagementSidebar';
import logo from '../../assets/images/home/logo.png';
import mailIcon from '../../assets/images/home/mail.png';
import phoneIcon from '../../assets/images/home/phone.png';
import mapIcon from '../../assets/images/home/map.png';
import { Link } from 'react-router-dom';

interface ManagementLayoutProps {
  children: ReactNode;
}

const ManagementLayout = ({ children }: ManagementLayoutProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 pt-[80px]">
        <ManagementSidebar />
        <main className="ml-[250px] flex-1 p-8 pb-8">
          {children}
        </main>
      </div>
      
      {/* Footer with margin-left for sidebar */}
      <footer className="ml-[250px] bg-white dark:bg-gray-800 pt-16 pb-5 border-t border-gray-200 dark:border-gray-700">
        <div className="px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-10">
            <div className="max-w-[350px]">
              <Link to="/" className="flex items-center gap-2.5 text-xl font-semibold text-gray-800 dark:text-white mb-4">
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                <span>Quizzes</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-5">Menu</h4>
              <ul className="list-none">
                <li className="mb-3">
                  <Link to="/" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/quizzes" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                    Quizzes
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/about" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                    About
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/contact" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-5">Contact</h4>
              <ul className="list-none">
                <li className="flex items-start gap-2.5 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <img src={mailIcon} alt="Email Icon" width="16" height="16" className="flex-shrink-0" />
                  <a href="mailto:company123@gmail.com" className="text-blue-500 hover:text-blue-600 transition-colors">
                    company123@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <img src={phoneIcon} alt="Phone Icon" width="16" height="16" className="flex-shrink-0" />
                  <a href="tel:+84643931378" className="text-blue-500 hover:text-blue-600 transition-colors">
                    +84 643 931 3786
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <img src={mapIcon} alt="Location Icon" width="16" height="16" className="flex-shrink-0" />
                  <a
                    href="https://maps.google.com/?q=123+Xuan+Thuy+Street,+Cau+Giay,+Ha+Noi+Viet+Nam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    123 Xuan Thuy Street, Cau Giay, Ha Noi Viet Nam
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-5 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {currentYear} {' '} Quizzes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ManagementLayout;

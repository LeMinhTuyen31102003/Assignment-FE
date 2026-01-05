import { Link, useLocation } from 'react-router-dom';
import quizIcon from '../../assets/images/user-management/Frame_1482_1952.png';
import questionIcon from '../../assets/images/user-management/Frame_1482_1956.png';
import userIcon from '../../assets/images/user-management/Frame_1482_1960.png';
import roleIcon from '../../assets/images/user-management/Frame_1482_1964.png';

const ManagementSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/management/quiz',
      label: 'Quiz Management',
      icon: quizIcon
    },
    {
      path: '/management/question',
      label: 'Question Management',
      icon: questionIcon
    },
    {
      path: '/management/user',
      label: 'User Management',
      icon: userIcon
    },
    {
      path: '/management/role',
      label: 'Role Management',
      icon: roleIcon
    }
  ];

  return (
    <aside className="fixed left-0 top-[80px] bottom-0 w-[250px] bg-white dark:bg-gray-800 shadow-[2px_0_8px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_8px_rgba(0,0,0,0.3)] overflow-y-auto z-10 p-8 px-5">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-5 pl-2.5">Menu</h3>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              location.pathname === item.path
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
          >
            <img src={item.icon} alt={item.label} width="20" height="20" className="flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default ManagementSidebar;

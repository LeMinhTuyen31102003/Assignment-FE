import quizIcon from '../../assets/images/user-management/Frame_1482_1952.png';
import questionIcon from '../../assets/images/user-management/Frame_1482_1956.png';
import userIcon from '../../assets/images/user-management/Frame_1482_1960.png';
import roleIcon from '../../assets/images/user-management/Frame_1482_1964.png';

const Management = () => {
  const managementCards = [
    {
      icon: quizIcon,
      title: 'Quiz Management',
      description: 'Create and manage quizzes'
    },
    {
      icon: questionIcon,
      title: 'Question Management',
      description: 'Manage questions and answers'
    },
    {
      icon: userIcon,
      title: 'User Management',
      description: 'Manage system users'
    },
    {
      icon: roleIcon,
      title: 'Role Management',
      description: 'Permissions and roles'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-5">Welcome to Management Page</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-[600px] leading-relaxed mb-12">
        This is a comprehensive management system for the Quiz application. 
        Please select an item from the left menu to start managing.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[900px]">
        {managementCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 p-8 px-5 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(77,166,255,0.2)] transition-all"
          >
            <img src={card.icon} alt={card.title} width="32" height="32" className="mb-4" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Management;

import logo from '../../assets/images/home/logo.png';
import quizIllustration from '../../assets/images/home/quiz.png';
import mailIcon from '../../assets/images/home/mail.png';
import phoneIcon from '../../assets/images/home/phone.png';
import mapIcon from '../../assets/images/home/map.png';
import avatar1 from '../../assets/images/user/avatar1.png';
import avatar2 from '../../assets/images/user/avatar2.png';
import avatar3 from '../../assets/images/user/avatar3.png';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* About Section */}
      <section className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-start justify-between gap-20 flex-col lg:flex-row">
            <div className="flex-1 max-w-[500px]">
              <div className="flex items-center gap-3 mb-8">
                <img src={logo} alt="Logo" className="w-12 h-12" />
                <span className="text-3xl font-bold text-gray-800 dark:text-white">Quizzes</span>
              </div>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-10">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">Contact</h3>
                <ul className="list-none p-0 m-0">
                  <li className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <img src={mailIcon} alt="Email Icon" width="16" height="16" className="flex-shrink-0" />
                    <span>company123@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <img src={phoneIcon} alt="Phone Icon" width="16" height="16" className="flex-shrink-0" />
                    <span>+84 643 931 3786</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <img src={mapIcon} alt="Location Icon" width="16" height="16" className="flex-shrink-0" />
                    <span>123 Xuan Thuy Street, Cau Giay, Ha Noi Viet Nam</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <img src={quizIllustration} alt="Quiz Illustration" className="max-w-full h-auto w-[450px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-16">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1000px] mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="w-[150px] h-[150px] mx-auto mb-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <img src={avatar1} alt="John Doe" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">John Doe</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Front End Developer</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="w-[150px] h-[150px] mx-auto mb-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <img src={avatar2} alt="Jane Doe" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Jane Doe</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Back End Developer</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="w-[150px] h-[150px] mx-auto mb-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <img src={avatar3} alt="John Smith" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">John Smith</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

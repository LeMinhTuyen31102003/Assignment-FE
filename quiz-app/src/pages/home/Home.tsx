import { QuizCard } from '@/components/common';
import quizIllustration from '../../assets/images/home/quiz.png';
import quiz1 from '../../assets/images/home/quiz1.png';
import quiz2 from '../../assets/images/home/quiz2.png';
import quiz3 from '../../assets/images/home/quiz3.png';

const Home = () => {
  const quizzes = [
    {
      id: 1,
      thumbnail: quiz1,
      title: 'Capitals of Country',
      description: 'Test your knowledge of country capitals',
      duration: '15m',
      difficulty: 'Easy' as const,
    },
    {
      id: 2,
      thumbnail: quiz2,
      title: 'Inventors and Inventions',
      description: 'Test your knowledge of inventors and their inventions',
      duration: '20m',
      difficulty: 'Medium' as const,
    },
    {
      id: 3,
      thumbnail: quiz3,
      title: 'Countries of the World',
      description: 'Test your knowledge of countries',
      duration: '15m',
      difficulty: 'Hard' as const,
    },
  ];

  const handleStartQuiz = (quizId: number) => {
    console.log('Starting quiz:', quizId);
    // Navigate to quiz page
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-20 pb-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between gap-16 flex-col lg:flex-row">
            <div className="flex-1 max-w-[500px]">
              <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-5 leading-tight">
                Welcome to Quiz App
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada nunc non lacus tincidunt, 
                nunc egestas ultrices semper, nec tincidunt nunc nunc nec libero. Nullam nec sollicitudin nunc. 
                Nullam nec sollicitudin nunc.
              </p>
              <button className="px-8 py-3.5 bg-blue-500 dark:bg-blue-600 text-white rounded text-base font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all shadow-[0_4px_12px_rgba(77,166,255,0.3)]">
                Take a Quiz
              </button>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <img src={quizIllustration} alt="Quiz Illustration" className="max-w-full h-auto w-[500px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-12 tracking-[2px]">
            QUIZZES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                thumbnail={quiz.thumbnail}
                title={quiz.title}
                description={quiz.description}
                duration={quiz.duration}
                difficulty={quiz.difficulty}
                onStart={() => handleStartQuiz(quiz.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useState } from 'react';
import { QuizCard } from '@/components/common';
import quiz1 from '../../assets/images/home/quiz1.png';
import quiz2 from '../../assets/images/home/quiz2.png';
import quiz3 from '../../assets/images/home/quiz3.png';

const Quizzes = () => {
  const [quizCode, setQuizCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTakeQuiz = () => {
    if (!quizCode.trim()) {
      alert('Please enter a quiz code');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Taking quiz with code:', quizCode);
      // Navigate to quiz page
    }, 1500);
  };

  const handleStartQuiz = (quizId: number) => {
    console.log('Starting quiz:', quizId);
    // Navigate to quiz page
  };

  return (
    <div>
      {/* Take a Quiz Section */}
      <section className="pt-16 pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-10">Take a Quiz</h1>
          <div className="max-w-3xl mx-auto flex gap-3 items-center flex-col md:flex-row">
            <input
              type="text"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTakeQuiz()}
              className="flex-1 w-full px-5 py-3.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md text-base outline-none transition-all placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]"
              placeholder="Enter quiz code to take a quiz"
            />
            <button
              onClick={handleTakeQuiz}
              disabled={isLoading}
              className={`px-8 py-3.5 bg-blue-500 dark:bg-blue-600 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all whitespace-nowrap hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(77,166,255,0.4)] active:translate-y-0 w-full md:w-auto ${
                isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              {isLoading ? 'Loading...' : 'Take Quiz'}
            </button>
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      <section className="py-16 pb-20 bg-white dark:bg-gray-900">
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

export default Quizzes;

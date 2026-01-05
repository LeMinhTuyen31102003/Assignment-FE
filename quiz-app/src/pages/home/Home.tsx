import { useNavigate } from 'react-router-dom';
import { QuizCard } from '@/components/common';
import { QuizCardSkeleton } from '@/components/common/Skeleton';
import { useQuizzes } from '@/hooks/useQuiz';
import { useAuthContext } from '@/contexts/useAuthContext';
import { toast } from 'react-toastify';
import quizIllustration from '../../assets/images/home/quiz.png';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { data: quizzes, isLoading, isError, error } = useQuizzes({
    enabled: isAuthenticated,
  });

  const handleStartQuiz = (quizId: string) => {
    if (!isAuthenticated) {
      toast.info('Please login to start the quiz');
      navigate('/login', { state: { from: `/quiz/${quizId}` } });
      return;
    }
    
    // Navigate to quiz taking page
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-20 pb-20">
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
              <button 
                onClick={() => navigate('/quizzes')}
                className="px-8 py-3.5 bg-blue-500 dark:bg-blue-600 text-white rounded text-base font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all shadow-[0_4px_12px_rgba(77,166,255,0.3)]"
              >
                Take a Quiz
              </button>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <img src={quizIllustration} alt="Quiz Illustration" className="max-w-full h-auto w-[500px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Quizzes Section - Only show when logged in */}
      {isAuthenticated && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-12 tracking-[2px]">
              QUIZZES
            </h2>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <QuizCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            )}

            {isError && (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 text-lg">
                  {error instanceof Error ? error.message : 'Failed to load quizzes'}
                </p>
              </div>
            )}

            {!isLoading && !isError && quizzes && quizzes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    thumbnail={quiz.thumbnail}
                    title={quiz.title}
                    description={quiz.description}
                    duration={quiz.durationMinutes}
                    difficulty={quiz.difficulty}
                    onStart={() => handleStartQuiz(quiz.id)}
                  />
                ))}
              </div>
            )}

            {!isLoading && !isError && quizzes?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No quizzes available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizCard } from '@/components/common';
import { QuizCardSkeleton } from '@/components/common/Skeleton';
import { useQuizzes } from '@/hooks/useQuiz';
import { useAuthContext } from '@/contexts/useAuthContext';
import { toast } from 'react-toastify';

const Quizzes = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [quizCode, setQuizCode] = useState('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const { data: quizzes = [], isLoading, isError, error } = useQuizzes({
    enabled: isAuthenticated,
  });

  const handleTakeQuiz = () => {
    if (!quizCode.trim()) {
      toast.warning('Please enter a quiz code');
      return;
    }
    
    if (!isAuthenticated) {
      toast.info('Please login to take the quiz');
      navigate('/login', { state: { from: `/quiz-code/${quizCode}` } });
      return;
    }
    
    setIsLoadingCode(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoadingCode(false);
      // Navigate to quiz page with code
      navigate(`/quiz-code/${quizCode}`);
    }, 1500);
  };

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
      {/* Take a Quiz Section */}
      <section className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-10">Take a Quiz</h1>
          <div className="max-w-3xl mx-auto flex gap-3 items-center flex-col md:flex-row">
            <input
              type="text"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTakeQuiz()}
              className="flex-1 w-full px-5 py-3.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md text-base outline-none transition-all placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]"
              placeholder="Enter quiz code to take a quiz"
            />
            <button
              onClick={handleTakeQuiz}
              disabled={isLoadingCode}
              className={`px-8 py-3.5 bg-blue-500 dark:bg-blue-600 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all whitespace-nowrap hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(77,166,255,0.4)] active:translate-y-0 w-full md:w-auto ${
                isLoadingCode ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              {isLoadingCode ? 'Loading...' : 'Take Quiz'}
            </button>
          </div>
        </div>
      </section>

      {/* Quizzes Section - Only show when logged in */}
      <section className="py-16 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-12 tracking-[2px]">
            QUIZZES
          </h2>

          {!isAuthenticated ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Login Required
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please login to view and take quizzes
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-base font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  Login Now
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Quizzes;

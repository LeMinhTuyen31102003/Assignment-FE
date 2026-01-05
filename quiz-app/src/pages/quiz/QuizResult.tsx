import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/useAuthContext';

interface ResultState {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  quizTitle: string;
}

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const state = location.state as ResultState;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!state) {
      navigate('/quizzes');
    }
  }, [isAuthenticated, state, navigate]);

  if (!state) {
    return null;
  }

  const { score, totalQuestions, correctAnswers, quizTitle } = state;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const isPassed = score >= 70;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-5">
        {/* Result Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {isPassed ? (
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {isPassed ? 'Congratulations!' : 'Keep Trying!'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{quizTitle}</p>

          {/* Score Display */}
          <div className="mb-8">
            <div className="inline-block relative">
              <svg className="w-48 h-48" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${(score / 100) * 565.48} 565.48`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  className={isPassed ? 'text-green-500' : 'text-red-500'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-5xl font-bold text-gray-800 dark:text-white">{score}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Your Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-500">{totalQuestions}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-500">{correctAnswers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-500">{incorrectAnswers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
            </div>
          </div>

          {/* Pass/Fail Message */}
          <div
            className={`p-4 rounded-lg mb-8 ${
              isPassed
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                : 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
            }`}
          >
            <p
              className={`font-semibold ${
                isPassed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
              }`}
            >
              {isPassed
                ? '✓ You have passed this quiz! Great job!'
                : '✗ You need at least 70% to pass. Try again!'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/quizzes')}
              className="px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold transition-colors"
            >
              Back to Quizzes
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 font-semibold transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Want to improve your score?{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Retake Quiz
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;

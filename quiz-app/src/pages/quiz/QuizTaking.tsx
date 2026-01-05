import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/useAuthContext';
import { toast } from 'react-toastify';
import { useQuizForExam, useSubmitExam } from '@/hooks/useExam';

const QuizTaking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(() => Date.now());

  const { data: quiz, isLoading, error } = useQuizForExam(id || '');
  const submitExam = useSubmitExam();
  
  const [timeRemaining, setTimeRemaining] = useState(() => quiz?.durationMinutes ? quiz.durationMinutes * 60 : 0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to take the quiz');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz || !user) return;

    const unansweredCount = quiz.questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirm = globalThis.confirm(
        `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        questionId,
        selectedAnswerId: answerId,
      }));

      const result = await submitExam.mutateAsync({
        userId: user.id,
        quizId: quiz.id,
        answers,
        timeSpent,
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/${id}/result`, {
        state: {
          score: result.score,
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctAnswers,
          incorrectAnswers: result.incorrectAnswers,
          quizTitle: result.quizTitle,
          submittedAt: result.submittedAt,
        },
      });
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast.error('Failed to submit quiz. Please try again.');
    }
  }, [quiz, user, selectedAnswers, id, navigate, submitExam, startTime]);

  useEffect(() => {
    if (timeRemaining <= 0 && quiz) {
      void handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit, quiz]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error ? 'Error loading quiz' : 'Quiz not found'}
          </h2>
          <button
            onClick={() => navigate('/quizzes')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-5">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{quiz.title}</h1>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-xl font-bold ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {currentQuestion.content}
          </h2>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => (
              <label
                key={answer.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswers[currentQuestion.id] === answer.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={answer.id}
                  checked={selectedAnswers[currentQuestion.id] === answer.id}
                  onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                  className="w-5 h-5 text-blue-500"
                />
                <span className="ml-3 text-gray-800 dark:text-white">{answer.content}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitExam.isPending}
                className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold disabled:opacity-50"
              >
                {submitExam.isPending ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Question Navigator
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.questions.map((question, index) => {
              const isActive = index === currentQuestionIndex;
              const isAnswered = selectedAnswers[question.id];
              
              let buttonClass = 'w-10 h-10 rounded-md font-semibold transition-all ';
              if (isActive) {
                buttonClass += 'bg-blue-500 text-white';
              } else if (isAnswered) {
                buttonClass += 'bg-green-500 text-white';
              } else {
                buttonClass += 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600';
              }

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={buttonClass}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;

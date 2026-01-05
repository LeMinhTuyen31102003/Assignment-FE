import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/useAuthContext';
import { toast } from 'react-toastify';
import { useQuizForExam, useSubmitExam } from '@/hooks/useExam';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const QuizTaking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [startTime] = useState(() => Date.now());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const hasSubmittedRef = useRef(false);

  const { data: quiz, isLoading, error } = useQuizForExam(id || '');
  const submitExam = useSubmitExam();
  
  const [timeRemaining, setTimeRemaining] = useState(() => quiz?.durationMinutes ? quiz.durationMinutes * 60 : 0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to take the quiz');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Scroll to top when quiz loads
  useEffect(() => {
    if (quiz) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Update location state with quiz title for breadcrumbs
      window.history.replaceState(
        { ...window.history.state, quizTitle: quiz.title },
        ''
      );
    }
  }, [quiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: [answerId], // Single select - wrap in array
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isSubmitting || showSubmitConfirm || showNavigator) return;
      
      if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && quiz && currentQuestionIndex < quiz.questions.length - 1) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex, quiz, isSubmitting, showSubmitConfirm, showNavigator]);

  const handleSubmit = useCallback(async (force = false) => {
    if (!quiz || !user || hasSubmittedRef.current) return;

    const unansweredCount = quiz.questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0 && !force) {
      setShowSubmitConfirm(true);
      return;
    }

    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const answers = Object.entries(selectedAnswers).map(([questionId, answerIds]) => ({
        questionId,
        selectedAnswerIds: answerIds,
      }));

      const result = await submitExam.mutateAsync({
        userId: user.id,
        quizId: quiz.id,
        answers,
        timeSpent,
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/${id}/result`, {
        state: result,
      });
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast.error('Failed to submit quiz. Please try again.');
      hasSubmittedRef.current = false;
      setIsSubmitting(false);
    }
  }, [quiz, user, selectedAnswers, id, navigate, submitExam, startTime]);

  // Separate effect for timer countdown
  useEffect(() => {
    if (!quiz || hasSubmittedRef.current || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, quiz]);

  // Separate effect for auto-submit when time runs out
  useEffect(() => {
    if (!quiz || hasSubmittedRef.current || timeRemaining > 0) return;
    
    // Use timeout to avoid setState in effect body
    const timeout = setTimeout(() => {
      handleSubmit(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, [timeRemaining, quiz, handleSubmit]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="flex max-w-7xl mx-auto px-5 gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Header Card with Timer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-2xl font-bold tabular-nums ${timeRemaining < 60 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                {timeRemaining < 60 && (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium animate-pulse">
                    Time is running out!
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {Object.keys(selectedAnswers).length} answered
                </span>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {Math.round(progress)}% complete
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed flex-1">
                {currentQuestion.content}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer, index) => (
                <label
                  key={answer.id}
                  className={`group flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedAnswers[currentQuestion.id]?.includes(answer.id)
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md scale-[1.02]'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:scale-[1.01]'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={answer.id}
                      checked={selectedAnswers[currentQuestion.id]?.includes(answer.id)}
                      onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                      className="w-5 h-5 text-blue-600 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex items-center justify-between">
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{answer.content}</span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 ml-2">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="group px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-400">
              Use ← → arrow keys to navigate
            </div>

            <div className="flex gap-3">
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="group px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  Next
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Questions</h3>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-sm">
                {Object.keys(selectedAnswers).length}/{quiz.questions.length}
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Current</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Answered</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Not Answered</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-450px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {quiz.questions.map((question, index) => {
                const isActive = index === currentQuestionIndex;
                const isAnswered = selectedAnswers[question.id];
                
                let buttonClass = 'w-full aspect-square rounded-lg font-bold transition-all text-base flex items-center justify-center leading-none ';
                if (isActive) {
                  buttonClass += 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg';
                } else if (isAnswered) {
                  buttonClass += 'bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:brightness-110 shadow-md';
                } else {
                  buttonClass += 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-sm';
                }

                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={buttonClass}
                    title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Navigator Button - Mobile */}
      <button
        onClick={() => setShowNavigator(!showNavigator)}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white dark:border-gray-900">
          {Object.keys(selectedAnswers).length}
        </div>
        <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Navigator Overlay */}
      {showNavigator && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setShowNavigator(false)}
          ></div>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl p-6 z-50 max-h-[85vh] overflow-y-auto animate-slideUp border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Questions</h3>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-md">
                  {Object.keys(selectedAnswers).length}/{quiz.questions.length}
                </div>
                <button
                  onClick={() => setShowNavigator(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Current</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Answered</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Not Answered</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-3">
              {quiz.questions.map((question, index) => {
                const isActive = index === currentQuestionIndex;
                const isAnswered = selectedAnswers[question.id];
                
                let buttonClass = 'w-full aspect-square rounded-lg font-bold transition-colors shadow-md active:opacity-80 flex items-center justify-center text-base leading-none ';
                if (isActive) {
                  buttonClass += 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
                } else if (isAnswered) {
                  buttonClass += 'bg-gradient-to-br from-green-500 to-emerald-600 text-white';
                } else {
                  buttonClass += 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white';
                }

                return (
                  <button
                    key={question.id}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setShowNavigator(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={buttonClass}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        title="Submit Quiz"
        message={`You have ${quiz ? quiz.questions.length - Object.keys(selectedAnswers).length : 0} unanswered question(s). Do you want to submit anyway?`}
        onConfirm={() => handleSubmit(true)}
        onClose={() => setShowSubmitConfirm(false)}
        confirmText="Submit"
        cancelText="Cancel"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default QuizTaking;

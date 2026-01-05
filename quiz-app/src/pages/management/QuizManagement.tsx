import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import createIcon from '../../assets/images/user-management/Frame_1482_3473.png';
import clearIcon from '../../assets/images/user-management/Frame_1482_3362.png';
import searchIcon from '../../assets/images/user-management/Frame_1482_3486.png';
import saveIcon from '../../assets/images/user-management/Frame_1482_3368.png';
import editIcon from '../../assets/images/user-management/Frame_1482_5074.png';
import deleteIcon from '../../assets/images/user-management/Frame_1482_5077.png';
import firstIcon from '../../assets/images/user-management/Frame_1482_5089.png';
import prevIcon from '../../assets/images/user-management/Frame_1482_5093.png';
import nextIcon from '../../assets/images/user-management/Frame_1482_5109.png';
import lastIcon from '../../assets/images/user-management/Frame_1482_5113.png';
import {
  useQuizzes,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useAddQuestionToQuiz,
  useRemoveQuestionFromQuiz,
} from '@/hooks/useQuiz';
import { useQuestions } from '@/hooks/useQuestion';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const QuizManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState('');
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<string | null>(null);

  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [questionOrder, setQuestionOrder] = useState('');

  const [showQuestions, setShowQuestions] = useState(false);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // API Hooks
  const { data: quizzesResponse, isLoading: isLoadingQuizzes, error: quizzesError, refetch } = useQuizzes({
    page: currentPage,
    size: itemsPerPage,
    title: searchName || undefined,
  });
  const quizzes = quizzesResponse?.content || [];
  const totalPages = quizzesResponse?.totalPages || 0;
  const totalElements = quizzesResponse?.totalElements || 0;

  const { data: questionsResponse, isLoading: isLoadingQuestions } = useQuestions();
  const allQuestions = questionsResponse?.content || [];
  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();
  const addQuestionMutation = useAddQuestionToQuiz();
  const removeQuestionMutation = useRemoveQuestionFromQuiz();

  // Get questions for selected quiz
  const selectedQuiz = quizzes.find(q => q.id === selectedQuizForQuestions);
  const quizQuestions = selectedQuiz?.questions || [];

  useEffect(() => {
    if (quizzesError) {
      toast.error('Failed to load quizzes');
    }
  }, [quizzesError]);

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleClear = () => {
    setSearchName('');
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setEditingQuizId(null);
    setQuizTitle('');
    setQuizDescription('');
    setQuizDuration('');
    setSelectedQuizForQuestions(null);
    setShowQuestions(false);
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    const durationMinutes = Number.parseInt(quizDuration, 10);
    if (Number.isNaN(durationMinutes) || durationMinutes <= 0) {
      toast.error('Please enter a valid duration in minutes');
      return;
    }

    const quizData = {
      title: quizTitle,
      description: quizDescription,
      durationMinutes,
    };

    try {
      if (editingQuizId) {
        await updateQuizMutation.mutateAsync({
          id: editingQuizId,
          data: quizData,
        });
        toast.success('Quiz updated successfully');
        // Close modal after update
        setIsQuizModalOpen(false);
        handleCancelQuiz();
      } else {
        const newQuiz = await createQuizMutation.mutateAsync(quizData);
        toast.success('Quiz created successfully! You can now add questions to this quiz.');
        // Set the quiz ID from response and keep modal open
        setEditingQuizId(newQuiz.id);
        setSelectedQuizForQuestions(newQuiz.id);
        setShowQuestions(true); // Automatically show questions section
        // Refetch to update the list
        refetch();
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(editingQuizId ? 'Failed to update quiz' : 'Failed to create quiz');
    }
  };

  const handleCancelQuiz = () => {
    setEditingQuizId(null);
    setQuizTitle('');
    setQuizDescription('');
    setQuizDuration('');
    setSelectedQuizForQuestions(null);
    setShowQuestions(false);
    setIsQuizModalOpen(false);
  };

  const handleAddQuestionToQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedQuizForQuestions) {
      toast.error('Please save the quiz first');
      return;
    }

    if (!selectedQuestion) {
      toast.error('Please select a question');
      return;
    }

    try {
      await addQuestionMutation.mutateAsync({
        quizId: selectedQuizForQuestions,
        questionId: selectedQuestion,
      });
      toast.success('Question added to quiz successfully');
      setSelectedQuestion('');
      setQuestionOrder('');
    } catch (error) {
      console.error('Error adding question to quiz:', error);
      toast.error('Failed to add question to quiz');
    }
  };

  const handleEdit = (id: string) => {
    const quiz = quizzes.find(q => q.id === id);
    if (quiz) {
      setEditingQuizId(quiz.id);
      setQuizTitle(quiz.title);
      setQuizDescription(quiz.description);
      setQuizDuration(quiz.durationMinutes.toString());
      setSelectedQuizForQuestions(quiz.id);
      setShowQuestions(true);
      setIsQuizModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Quiz',
      message: 'Are you sure you want to delete this quiz? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteQuizMutation.mutateAsync(id);
          toast.success('Quiz deleted successfully');
        } catch (error) {
          console.error('Error deleting quiz:', error);
          toast.error('Failed to delete quiz');
        }
      },
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedQuizForQuestions) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Remove Question',
      message: 'Are you sure you want to remove this question from the quiz?',
      onConfirm: async () => {
        try {
          await removeQuestionMutation.mutateAsync({
            quizId: selectedQuizForQuestions,
            questionId,
          });
          toast.success('Question removed from quiz successfully');
        } catch (error) {
          console.error('Error removing question:', error);
          toast.error('Failed to remove question from quiz');
        }
      },
    });
  };

  const handleSaveQuestions = () => {
    toast.success('Questions saved successfully');
  };

  const handleAddQuestion = () => {
    // Navigate to question management or open a modal
    console.log('Navigate to add new question');
    toast.info('Please use Question Management to create new questions');
  };

  // Loading state
  if (isLoadingQuizzes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Quiz Management</h1>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="searchName" className="text-sm font-semibold text-gray-800 dark:text-white">
              Title
            </label>
            <input
              id="searchName"
              type="text"
              placeholder="Enter quiz title to search"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <img src={createIcon} alt="Create" width="16" height="16" />
              {' '}Create
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <img src={clearIcon} alt="Clear" width="16" height="16" />
                {' '}Clear
              </button>
              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
              >
                <img src={searchIcon} alt="Search" width="16" height="16" />
                {' '}Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Quiz List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Title
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Duration
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Questions
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.title}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.description}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.durationMinutes}m</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.questions?.length || 0}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => handleEdit(quiz.id)}
                        className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="flex items-center justify-center w-9 h-9 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 hover:scale-110 transition-all p-0 border-none"
                        title="Delete"
                      >
                        <img src={deleteIcon} alt="Delete" width="16" height="16" className="block brightness-0 invert" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="ml-4">Total: {totalElements} items</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={firstIcon} alt="First" width="16" height="16" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={prevIcon} alt="Previous" width="16" height="16" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded text-sm font-semibold cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-500 dark:bg-blue-600 text-white border border-blue-500'
                      : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={nextIcon} alt="Next" width="16" height="16" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={lastIcon} alt="Last" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Form Modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={handleCancelQuiz}
        title={editingQuizId ? 'Edit Quiz' : 'Add Quiz'}
        size="lg"
      >
        <form onSubmit={handleSaveQuiz}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="quizTitle" className="text-sm font-semibold text-gray-800 dark:text-white">
                Title
              </label>
              <input
                id="quizTitle"
                type="text"
                placeholder="Enter quiz title"
                required
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="quizDuration" className="text-sm font-semibold text-gray-800 dark:text-white">
                Duration (minutes)
              </label>
              <input
                id="quizDuration"
                type="number"
                placeholder="Enter quiz duration in minutes"
                required
                min="1"
                value={quizDuration}
                onChange={(e) => setQuizDuration(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="quizDescription" className="text-sm font-semibold text-gray-800 dark:text-white">
              Description
            </label>
            <textarea
              id="quizDescription"
              placeholder="Enter quiz description"
              required
              rows={3}
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowQuestions(!showQuestions)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <img src={createIcon} alt="Show" width="16" height="16" />
              {' '}
              {showQuestions ? 'Hide Questions' : 'Show Questions'}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelQuiz}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <img src={clearIcon} alt="Cancel" width="16" height="16" />
                {' '}Cancel
              </button>
              <button
                type="submit"
                disabled={createQuizMutation.isPending || updateQuizMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src={saveIcon} alt="Save" width="16" height="16" />
                {' '}
                {createQuizMutation.isPending || updateQuizMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>

        {/* Question List Table */}
        {showQuestions && (
          <>
            {/* Add Question to Quiz Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mt-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Add Question to Quiz</h2>
              <form onSubmit={handleAddQuestionToQuiz}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="selectedQuestion" className="text-sm font-semibold text-gray-800 dark:text-white">
                      Question
                    </label>
                    {isLoadingQuestions ? (
                      <div className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm">
                        Loading questions...
                      </div>
                    ) : (
                      <select
                        id="selectedQuestion"
                        value={selectedQuestion}
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                        className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        required
                      >
                        <option value="">Select a Question</option>
                        {allQuestions.map((question) => (
                          <option key={question.id} value={question.id}>
                            {question.content}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="questionOrder" className="text-sm font-semibold text-gray-800 dark:text-white">
                      Order
                    </label>
                    <input
                      id="questionOrder"
                      type="number"
                      placeholder="Enter order of question in quiz"
                      value={questionOrder}
                      onChange={(e) => setQuestionOrder(e.target.value)}
                      className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuestion('');
                      setQuestionOrder('');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                  >
                    <img src={clearIcon} alt="Cancel" width="16" height="16" />
                    {' '}Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addQuestionMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img src={createIcon} alt="Add" width="16" height="16" />
                    {' '}
                    {addQuestionMutation.isPending ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mt-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Question List</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Content
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Score
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.content}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.score}</td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            disabled={removeQuestionMutation.isPending}
                            className="flex items-center justify-center w-9 h-9 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 hover:scale-110 transition-all p-0 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <img src={deleteIcon} alt="Delete" width="16" height="16" className="block brightness-0 invert" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <img src={createIcon} alt="Add" width="16" height="16" />
                {' '}Add
              </button>
              <button
                type="button"
                onClick={handleSaveQuestions}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
              >
                <img src={saveIcon} alt="Save" width="16" height="16" />
                {' '}Save
              </button>
            </div>
          </div>
          </>
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default QuizManagement;

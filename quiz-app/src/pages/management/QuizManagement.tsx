import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import quiz1 from '../../assets/images/home/quiz1.png';
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

const QuizManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [statusActive, setStatusActive] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState('');
  const [quizThumbnail, setQuizThumbnail] = useState('');
  const [quizStatusActive, setQuizStatusActive] = useState(false);
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<string | null>(null);

  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [questionOrder, setQuestionOrder] = useState('');

  const [showQuestions, setShowQuestions] = useState(false);

  // API Hooks
  const { data: quizzes = [], isLoading: isLoadingQuizzes, error: quizzesError } = useQuizzes();
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
    console.log('Searching...', { searchName, statusActive });
    // TODO: Implement search/filter logic with API
  };

  const handleClear = () => {
    setSearchName('');
    setStatusActive(false);
  };

  const handleCreate = () => {
    setEditingQuizId(null);
    setQuizTitle('');
    setQuizDescription('');
    setQuizDuration('');
    setQuizThumbnail('');
    setQuizStatusActive(false);
    setSelectedQuizForQuestions(null);
    setShowQuestions(false);
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
      thumbnail: quizThumbnail || undefined,
    };

    try {
      if (editingQuizId) {
        await updateQuizMutation.mutateAsync({
          id: editingQuizId,
          data: quizData,
        });
        toast.success('Quiz updated successfully');
      } else {
        const newQuiz = await createQuizMutation.mutateAsync(quizData);
        toast.success('Quiz created successfully');
        setSelectedQuizForQuestions(newQuiz.id);
      }
      
      // Don't clear form if showing questions section
      if (!showQuestions) {
        handleCancelQuiz();
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
    setQuizThumbnail('');
    setQuizStatusActive(false);
    setSelectedQuizForQuestions(null);
    setShowQuestions(false);
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
      setQuizThumbnail(quiz.thumbnail || '');
      setQuizStatusActive(true);
      setSelectedQuizForQuestions(quiz.id);
      setShowQuestions(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (globalThis.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuizMutation.mutateAsync(id);
        toast.success('Quiz deleted successfully');
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error('Failed to delete quiz');
      }
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedQuizForQuestions) return;

    if (globalThis.confirm('Are you sure you want to remove this question from the quiz?')) {
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
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="searchName" className="text-sm font-semibold text-gray-800 dark:text-white">
                Name
              </label>
              <input
                id="searchName"
                type="text"
                placeholder="Enter role name to search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="statusActive" className="text-sm font-semibold text-gray-800 dark:text-white">
                Status
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
                <input
                  type="checkbox"
                  id="statusActive"
                  checked={statusActive}
                  onChange={(e) => setStatusActive(e.target.checked)}
                  className="w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="statusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                  Active
                </label>
              </div>
            </div>
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
                  Header
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 align-middle">
                    <img 
                      src={quiz.thumbnail || quiz1} 
                      alt="Quiz" 
                      width="80" 
                      height="60" 
                      className="rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = quiz1;
                      }}
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.title}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.description}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.durationMinutes}m</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{quiz.totalQuestions || quiz.questions?.length || 0}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">Yes</td>
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
        <div className="flex justify-between items-center mt-5 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all bg-white dark:bg-gray-700 dark:text-white">
              <img src={firstIcon} alt="First" width="16" height="16" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all bg-white dark:bg-gray-700 dark:text-white">
              <img src={prevIcon} alt="Previous" width="16" height="16" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 bg-blue-500 dark:bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-all border-none font-semibold text-sm">
              1
            </button>
            <button className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all bg-white dark:bg-gray-700 font-semibold text-sm text-gray-800 dark:text-white">
              2
            </button>
            <button className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all bg-white dark:bg-gray-700 font-semibold text-sm text-gray-800 dark:text-white">
              3
            </button>
            <button className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all bg-white dark:bg-gray-700 dark:text-white">
              <img src={nextIcon} alt="Next" width="16" height="16" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all bg-white dark:bg-gray-700 dark:text-white">
              <img src={lastIcon} alt="Last" width="16" height="16" />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">1-10 of 32</div>
        </div>
      </div>

      {/* Add Quiz Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Add Quiz</h2>
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
              <label htmlFor="quizDescription" className="text-sm font-semibold text-gray-800 dark:text-white">
                Description
              </label>
              <input
                id="quizDescription"
                type="text"
                placeholder="Enter quiz description"
                required
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="quizDuration" className="text-sm font-semibold text-gray-800 dark:text-white">
                Duration
              </label>
              <input
                id="quizDuration"
                type="text"
                placeholder="Enter quiz duration"
                required
                value={quizDuration}
                onChange={(e) => setQuizDuration(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="quizThumbnail" className="text-sm font-semibold text-gray-800 dark:text-white">
                Thumbnail URL
              </label>
              <input
                id="quizThumbnail"
                type="text"
                placeholder="Enter quiz thumbnail URL"
                required
                value={quizThumbnail}
                onChange={(e) => setQuizThumbnail(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="quizStatusActive" className="text-sm font-semibold text-gray-800 dark:text-white">
              Status
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
              <input
                type="checkbox"
                id="quizStatusActive"
                checked={quizStatusActive}
                onChange={(e) => setQuizStatusActive(e.target.checked)}
                className="w-4.5 h-4.5 cursor-pointer"
              />
              <label htmlFor="quizStatusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                Active
              </label>
            </div>
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
      </div>

      {/* Question List Table */}
      {showQuestions && (
        <>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Question List</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Content
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Type
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Answers
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Order
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.content}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.type}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.answers?.length || 0}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.order || '-'}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.status || 'Active'}</td>
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

          {/* Add Question to Quiz Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
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
        </>
      )}
    </div>
  );
};

export default QuizManagement;

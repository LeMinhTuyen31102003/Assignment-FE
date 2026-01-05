import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  useQuestions, 
  useCreateQuestion, 
  useUpdateQuestion, 
  useDeleteQuestion
} from '@/hooks/useQuestion';
import Modal from '@/components/common/Modal';
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

interface Answer {
  id?: string;
  content: string;
  isCorrect: boolean;
  status?: string;
}

interface Question {
  id: string;
  content: string;
  type: string;
  score?: number;
  order?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  answers?: Answer[];
}

const QuestionManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [questionType, setQuestionType] = useState(''); 
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [questionContent, setQuestionContent] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [questionScore, setQuestionScore] = useState<number>(10);

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerDescription, setAnswerDescription] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

  // API hooks
  const { data: questionsResponse, isLoading, error, refetch } = useQuestions({
    page: currentPage,
    size: itemsPerPage,
    content: searchName || undefined,
    type: questionType || undefined,
  });
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const questions = questionsResponse?.content || [];
  const totalPages = questionsResponse?.totalPages || 0;
  const totalElements = questionsResponse?.totalElements || 0;

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleClear = () => {
    setSearchName('');
    setQuestionType('');
    setCurrentPage(0);
  };

  const handleCreateQuestion = () => {
    setSelectedQuestionId(null);
    setQuestionContent('');
    setSelectedQuestionType('');
    setQuestionScore(10);
    setAnswers([]);
    setShowAnswers(false);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionContent.trim() || !selectedQuestionType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (selectedQuestionId) {
        const updateData: {
          content: string;
          type: string;
          score: number;
          answers?: { content: string; isCorrect: boolean }[];
        } = {
          content: questionContent,
          type: selectedQuestionType,
          score: questionScore,
        };
        
        if (answers.length > 0) {
          updateData.answers = answers.map(ans => ({
            content: ans.content,
            isCorrect: ans.isCorrect
          }));
        }
        
        await updateQuestion.mutateAsync({ id: selectedQuestionId, data: updateData });
        toast.success('Question updated successfully!');
      } else {
        const createData: {
          content: string;
          type: string;
          score: number;
          answers?: { content: string; isCorrect: boolean }[];
        } = {
          content: questionContent,
          type: selectedQuestionType,
          score: questionScore,
        };
        
        if (answers.length > 0) {
          createData.answers = answers.map(ans => ({
            content: ans.content,
            isCorrect: ans.isCorrect
          }));
        }
        
        await createQuestion.mutateAsync(createData);
        toast.success('Question created successfully!');
      }

      handleCancelQuestion();
      setIsQuestionModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Save question error:', error);
      toast.error(`Failed to ${selectedQuestionId ? 'update' : 'create'} question`);
    }
  };

  const handleCancelQuestion = () => {
    setSelectedQuestionId(null);
    setQuestionContent('');
    setSelectedQuestionType('');
    setQuestionScore(10);
    setAnswers([]);
    setShowAnswers(false);
    setIsQuestionModalOpen(false);
  };

  const handleAddAnswer = () => {
    setSelectedAnswerId(null);
    setAnswerDescription('');
    setIsCorrect(false);
    setIsAnswerModalOpen(true);
  };

  const handleSaveAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answerDescription.trim()) {
      toast.error('Please enter answer content');
      return;
    }

    const newAnswer: Answer = {
      id: selectedAnswerId || Date.now().toString(),
      content: answerDescription,
      isCorrect: isCorrect
    };

    if (selectedAnswerId) {
      setAnswers(prev => prev.map(ans => ans.id === selectedAnswerId ? newAnswer : ans));
      toast.success('Answer updated!');
    } else {
      setAnswers(prev => [...prev, newAnswer]);
      toast.success('Answer added!');
    }

    setSelectedAnswerId(null);
    setAnswerDescription('');
    setIsCorrect(false);
    setIsAnswerModalOpen(false);
  };

  const handleCancelAnswer = () => {
    setSelectedAnswerId(null);
    setAnswerDescription('');
    setIsCorrect(false);
    setIsAnswerModalOpen(false);
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestionId(question.id);
    setQuestionContent(question.content);
    setSelectedQuestionType(question.type);
    setQuestionScore(question.score || 10);
    setAnswers(question.answers || []);
    setShowAnswers(!!(question.answers && question.answers.length > 0));
    setIsQuestionModalOpen(true);
  };

  const handleEditAnswer = (answer: Answer) => {
    setSelectedAnswerId(answer.id || null);
    setAnswerDescription(answer.content);
    setIsCorrect(answer.isCorrect);
    setIsAnswerModalOpen(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!globalThis.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await deleteQuestion.mutateAsync(id);
      toast.success('Question deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Delete question error:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteAnswer = (id: string) => {
    if (!globalThis.confirm('Are you sure you want to delete this answer?')) {
      return;
    }
    setAnswers(prev => prev.filter(ans => ans.id !== id));
    toast.success('Answer removed!');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Question Management</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error loading questions</p>
          <p className="text-sm">{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="searchName" className="text-sm font-semibold text-gray-800 dark:text-white">Name</label>
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
              <label htmlFor="questionType" className="text-sm font-semibold text-gray-800 dark:text-white">Type</label>
              <select
                id="questionType"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select item</option>
                <option value="SINGLE_CHOICE">Single Choice</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handleCreateQuestion}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <img src={createIcon} alt="Create" width="16" height="16" className="block" />
              {' '}Create
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <img src={clearIcon} alt="Clear" width="16" height="16" className="block" />
                {' '}Clear
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
              >
                <img src={searchIcon} alt="Search" width="16" height="16" className="block" />
                {' '}Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question List Table */}
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
                  Score
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Answers
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Loading questions...' : 'No questions found'}
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.content}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                      {question.type.replaceAll('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {question.score || 0}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.answers?.length || 0}</td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex gap-2 items-center justify-center">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                          title="Edit"
                        >
                          <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={deleteQuestion.isPending}
                          className="flex items-center justify-center w-9 h-9 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 hover:scale-110 transition-all p-0 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <img src={deleteIcon} alt="Delete" width="16" height="16" className="block brightness-0 invert" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
            
            {/* Page numbers */}
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
                  className={`w-9 h-9 flex items-center justify-center border rounded text-sm font-semibold cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
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

      {/* Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={handleCancelQuestion}
        title={selectedQuestionId ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <form onSubmit={handleSaveQuestion}>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="questionContent" className="text-sm font-semibold text-gray-800 dark:text-white">Content</label>
            <textarea
              id="questionContent"
              placeholder="Enter question content"
              rows={4}
              required
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="selectedQuestionType" className="text-sm font-semibold text-gray-800 dark:text-white">Question Type</label>
              <select
                id="selectedQuestionType"
                required
                value={selectedQuestionType}
                onChange={(e) => setSelectedQuestionType(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select Question Type</option>
                <option value="SINGLE_CHOICE">Single Choice</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="questionScore" className="text-sm font-semibold text-gray-800 dark:text-white">Score</label>
              <input
                id="questionScore"
                type="number"
                min="1"
                max="100"
                required
                value={questionScore}
                onChange={(e) => setQuestionScore(Number(e.target.value))}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <img src={createIcon} alt="Show" width="16" height="16" />
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelQuestion}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <img src={clearIcon} alt="Cancel" width="16" height="16" />
                {' '}Cancel
              </button>
              <button
                type="submit"
                disabled={createQuestion.isPending || updateQuestion.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src={saveIcon} alt="Save" width="16" height="16" />
                {' '}Save
              </button>
            </div>
          </div>

          {showAnswers && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Answer List</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Content
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Is Correct
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {answers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No answers added yet
                      </td>
                    </tr>
                  ) : (
                    answers.map((answer) => (
                      <tr key={answer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{answer.content}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{answer.isCorrect ? 'True' : 'False'}</td>
                        <td className="px-3 py-3 align-middle">
                          <div className="flex gap-2 items-center justify-center">
                            <button
                              onClick={() => handleEditAnswer(answer)}
                              className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                              title="Edit"
                            >
                              <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnswer(answer.id || '')}
                              className="flex items-center justify-center w-9 h-9 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 hover:scale-110 transition-all p-0 border-none"
                              title="Delete"
                            >
                              <img src={deleteIcon} alt="Delete" width="16" height="16" className="block brightness-0 invert" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-5">
              <button
                type="button"
                onClick={handleAddAnswer}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <img src={createIcon} alt="Add" width="16" height="16" />
                {' '}Add
              </button>
            </div>
          </div>
          )}
        </form>
      </Modal>

      {/* Answer Modal */}
      <Modal
        isOpen={isAnswerModalOpen}
        onClose={handleCancelAnswer}
        title={selectedAnswerId ? 'Edit Answer' : 'Add Answer'}
        size="md"
      >
        <form onSubmit={handleSaveAnswer}>
              <div className="flex flex-col gap-2 mb-5">
                <label htmlFor="answerDescription" className="text-sm font-semibold text-gray-800 dark:text-white">Description</label>
                <textarea
                  id="answerDescription"
                  placeholder="Enter answer description"
                  rows={4}
                  required
                  value={answerDescription}
                  onChange={(e) => setAnswerDescription(e.target.value)}
                  className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 mb-5">
                <label htmlFor="isCorrect" className="text-sm font-semibold text-gray-800 dark:text-white">Is Correct?</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
                  <input
                    type="checkbox"
                    id="isCorrect"
                    checked={isCorrect}
                    onChange={(e) => setIsCorrect(e.target.checked)}
                    className="w-4.5 h-4.5 cursor-pointer"
                  />
                  <label htmlFor="isCorrect" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                    Correct
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelAnswer}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  <img src={clearIcon} alt="Cancel" width="16" height="16" />
                  {' '}Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
                >
                  <img src={saveIcon} alt="Save" width="16" height="16" />
                  {' '}Save
                </button>
              </div>
            </form>
          </Modal>
    </div>
  );
};

export default QuestionManagement;

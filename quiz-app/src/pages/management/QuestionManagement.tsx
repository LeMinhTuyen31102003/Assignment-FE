import { useState } from 'react';
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

interface Question {
  id: number;
  content: string;
  type: string;
  answers: number;
  status: string;
}

interface Answer {
  id: number;
  content: string;
  isCorrect: boolean;
  status: string;
}

const QuestionManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [questionType, setQuestionType] = useState(''); 
  const [statusActive, setStatusActive] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [questionContent, setQuestionContent] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [questionStatusActive, setQuestionStatusActive] = useState(false);

  const [answerDescription, setAnswerDescription] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerStatusActive, setAnswerStatusActive] = useState(false);

  const [showAnswers, setShowAnswers] = useState(false);

  const questions: Question[] = [
    { id: 1, content: 'Who is the inventor of the airplane?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 2, content: 'Who is the inventor of the World Wide Web?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 3, content: 'Where is Viet Nam?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 4, content: 'What is the capital of France?', type: 'SingleChoice', answers: 4, status: 'Yes' },
    { id: 5, content: 'Who is the inventor of the alternating current?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 6, content: 'Where is Australia?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 7, content: 'Who is the inventor of the ATM?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 8, content: 'Where is France?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 9, content: 'Where is the United States?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
    { id: 10, content: 'Who is the inventor of the washing machine?', type: 'MultipleChoice', answers: 4, status: 'Yes' },
  ];

  const answers: Answer[] = [
    { id: 1, content: 'Wright brothers', isCorrect: true, status: 'Yes' },
    { id: 2, content: 'Alexander Graham Bell', isCorrect: false, status: 'Yes' },
    { id: 3, content: 'Albert Einstein', isCorrect: false, status: 'Yes' },
    { id: 4, content: 'Charles Babbage', isCorrect: false, status: 'Yes' },
  ];

  const handleSearch = () => {
    console.log('Searching...', { searchName, questionType, statusActive });
  };

  const handleClear = () => {
    setSearchName('');
    setQuestionType('');
    setStatusActive(false);
  };

  const handleCreateQuestion = () => {
    console.log('Creating question...');
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving question...', { questionContent, selectedQuestionType, questionStatusActive });
  };

  const handleCancelQuestion = () => {
    setQuestionContent('');
    setSelectedQuestionType('');
    setQuestionStatusActive(false);
  };

  const handleSaveAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving answer...', { answerDescription, isCorrect, answerStatusActive });
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Question Management</h1>

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
                <option value="MultipleChoice">MultipleChoice</option>
                <option value="SingleChoice">SingleChoice</option>
                <option value="TrueFalse">TrueFalse</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="statusActive" className="text-sm font-semibold text-gray-800 dark:text-white">Status</label>
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
            <div className="flex flex-col gap-2"></div>
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
                  Answers
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
              {questions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.content}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.type}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.answers}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{question.status}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => handleEdit(question.id)}
                        className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
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
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={firstIcon} alt="First" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={prevIcon} alt="Previous" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white border border-blue-500 rounded text-sm font-semibold cursor-pointer">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              3
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={nextIcon} alt="Next" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={lastIcon} alt="Last" width="16" height="16" />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">1-10 of 32</div>
        </div>
      </div>

      {/* Add Question Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Add Question</h2>
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
                <option value="MultipleChoice">MultipleChoice</option>
                <option value="SingleChoice">SingleChoice</option>
                <option value="TrueFalse">TrueFalse</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="questionStatusActive" className="text-sm font-semibold text-gray-800 dark:text-white">Status</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
                <input
                  type="checkbox"
                  id="questionStatusActive"
                  checked={questionStatusActive}
                  onChange={(e) => setQuestionStatusActive(e.target.checked)}
                  className="w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="questionStatusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                  Active
                </label>
              </div>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
              >
                <img src={saveIcon} alt="Save" width="16" height="16" />
                {' '}Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Answer List Table */}
      {showAnswers && (
        <>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Answer List</h2>
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
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer) => (
                    <tr key={answer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{answer.content}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{answer.isCorrect ? 'True' : 'False'}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{answer.status}</td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => handleEdit(answer.id)}
                            className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                            title="Edit"
                          >
                            <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                          </button>
                          <button
                            onClick={() => handleDelete(answer.id)}
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
            <div className="flex justify-between items-center mt-5">
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <img src={createIcon} alt="Add" width="16" height="16" />
                {' '}Add
              </button>
            </div>
          </div>

          {/* Add Answer Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Add Answer</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="answerStatusActive" className="text-sm font-semibold text-gray-800 dark:text-white">Status</label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
                    <input
                      type="checkbox"
                      id="answerStatusActive"
                      checked={answerStatusActive}
                      onChange={(e) => setAnswerStatusActive(e.target.checked)}
                      className="w-4.5 h-4.5 cursor-pointer"
                    />
                    <label htmlFor="answerStatusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                      Active
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
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
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionManagement;

interface QuizCardProps {
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  onStart?: () => void;
}

export default function QuizCard({
  thumbnail,
  title,
  description,
  duration,
  difficulty,
  onStart,
}: Readonly<QuizCardProps>) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
      <div className="w-full h-[200px] overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{duration}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">{description}</p>
        {difficulty && (
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          </div>
        )}
        <button
          onClick={onStart}
          className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white rounded text-base font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  );
}

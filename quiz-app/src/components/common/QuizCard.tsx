import { useMemo } from 'react';
import quiz1 from '../../assets/images/home/quiz1.png';
import quiz2 from '../../assets/images/home/quiz2.png';
import quiz3 from '../../assets/images/home/quiz3.png';

interface QuizCardProps {
  thumbnail?: string;
  title: string;
  description: string;
  duration: number;
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
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  const quizImages = [quiz1, quiz2, quiz3];
  
  // Random image based on title hash để consistent across renders
  const randomImage = useMemo(() => {
    const hash = title.split('').reduce((acc, char) => acc + (char.codePointAt(0) || 0), 0);
    return quizImages[hash % quizImages.length];
  }, [title]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
      <div className="w-full h-[200px] overflow-hidden">
        <img 
          src={thumbnail || randomImage} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-2.5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 flex-1">
            {title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
            {duration} min
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 line-clamp-2">{description}</p>
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

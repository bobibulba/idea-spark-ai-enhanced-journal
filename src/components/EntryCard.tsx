import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils';
import { Entry } from '../types';
import { ArrowRight } from 'lucide-react';

interface EntryCardProps {
  entry: Entry;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  // Get the first 150 characters of content for preview
  const contentPreview = entry.content.length > 150 
    ? `${entry.content.substring(0, 150)}...` 
    : entry.content;
  
  // Get mood emoji
  const getMoodEmoji = (mood: string | undefined) => {
    switch (mood) {
      case 'Inspired': return '✨';
      case 'Excited': return '🔥';
      case 'Focused': return '🎯';
      case 'Curious': return '🧐';
      case 'Neutral': return '😐';
      case 'Confused': return '😕';
      case 'Frustrated': return '😤';
      case 'Tired': return '😴';
      default: return '';
    }
  };

  return (
    <Link 
      to={`/entry/${entry.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{entry.title}</h3>
        {entry.mood && (
          <span className="text-xl" title={entry.mood}>
            {getMoodEmoji(entry.mood)}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {formatDate(entry.createdAt)}
      </p>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {contentPreview}
      </p>
      
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {entry.aiQuestions.filter(q => q.answer).length} of 3 questions answered
        </div>
        <div className="text-yellow-500 flex items-center text-sm font-medium">
          View details <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default EntryCard;

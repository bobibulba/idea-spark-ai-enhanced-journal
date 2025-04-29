import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="mb-4">
      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Tags (press Enter to add)
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div 
            key={tag} 
            className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        id="tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags like 'Work', 'Personal', 'Project'..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
};

export default TagInput;

import React from 'react';
import { Mood } from '../types';

interface MoodPickerProps {
  selectedMood: Mood | undefined;
  onSelectMood: (mood: Mood) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onSelectMood }) => {
  const moods: { mood: Mood; emoji: string }[] = [
    { mood: 'Inspired', emoji: '✨' },
    { mood: 'Excited', emoji: '🔥' },
    { mood: 'Focused', emoji: '🎯' },
    { mood: 'Curious', emoji: '🧐' },
    { mood: 'Neutral', emoji: '😐' },
    { mood: 'Confused', emoji: '😕' },
    { mood: 'Frustrated', emoji: '😤' },
    { mood: 'Tired', emoji: '😴' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">How are you feeling about this idea?</h3>
      <div className="grid grid-cols-4 gap-3">
        {moods.map(({ mood, emoji }) => (
          <button
            key={mood}
            type="button"
            onClick={() => onSelectMood(mood)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
              selectedMood === mood
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-2xl mb-1">{emoji}</span>
            <span className="text-sm">{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker;

import React, { useState } from 'react';
import { Entry } from '../types';
import { Loader, Check } from 'lucide-react';
import useStore from '../store';

interface AIQuestionSectionProps {
  entry: Entry;
  onUpdate: (updatedEntry: Entry) => void;
}

const AIQuestionSection: React.FC<AIQuestionSectionProps> = ({ entry, onUpdate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    entry.aiQuestions.findIndex(q => !q.answer) !== -1 
      ? entry.aiQuestions.findIndex(q => !q.answer) 
      : 0
  );
  const [answer, setAnswer] = useState('');
  const { isProcessing } = useStore();

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    
    const updatedQuestions = [...entry.aiQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answer: answer.trim()
    };
    
    const updatedEntry = {
      ...entry,
      aiQuestions: updatedQuestions
    };
    
    onUpdate(updatedEntry);
    setAnswer('');
    
    // Move to next unanswered question or stay on the last one
    const nextUnansweredIndex = updatedQuestions.findIndex((q, i) => i > currentQuestionIndex && !q.answer);
    if (nextUnansweredIndex !== -1) {
      setCurrentQuestionIndex(nextUnansweredIndex);
    } else {
      const lastIndex = updatedQuestions.length - 1;
      setCurrentQuestionIndex(lastIndex);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setAnswer(entry.aiQuestions[index].answer || '');
  };

  if (entry.aiQuestions.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-2">AI Questions</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {isProcessing 
            ? 'Generating questions based on your entry...' 
            : 'No questions generated yet. Save your entry to generate AI questions.'}
        </p>
        {isProcessing && (
          <div className="flex justify-center mt-4">
            <Loader className="h-6 w-6 text-yellow-500 animate-spin" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">AI Questions</h3>
      
      <div className="flex mb-4 overflow-x-auto pb-2">
        {entry.aiQuestions.map((q, index) => (
          <button
            key={index}
            onClick={() => navigateToQuestion(index)}
            className={`flex items-center justify-center min-w-[2.5rem] h-10 rounded-full mr-2 ${
              currentQuestionIndex === index
                ? 'bg-yellow-500 text-white'
                : q.answer
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {q.answer ? <Check className="h-4 w-4" /> : index + 1}
          </button>
        ))}
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">
          {entry.aiQuestions[currentQuestionIndex].question}
        </h4>
        
        <textarea
          value={answer || entry.aiQuestions[currentQuestionIndex].answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        
        <button
          type="button"
          onClick={handleSubmitAnswer}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          {entry.aiQuestions[currentQuestionIndex].answer ? 'Update Answer' : 'Save Answer'}
        </button>
        
        <button
          type="button"
          onClick={() => setCurrentQuestionIndex(Math.min(entry.aiQuestions.length - 1, currentQuestionIndex + 1))}
          disabled={currentQuestionIndex === entry.aiQuestions.length - 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AIQuestionSection;

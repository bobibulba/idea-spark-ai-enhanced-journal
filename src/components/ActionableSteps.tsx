import React from 'react';
import { Entry } from '../types';
import { Loader, Calendar } from 'lucide-react';
import { exportToCalendar } from '../utils';
import useStore from '../store';

interface ActionableStepsProps {
  entry: Entry;
  onUpdate: (updatedEntry: Entry) => void;
}

const ActionableSteps: React.FC<ActionableStepsProps> = ({ entry, onUpdate }) => {
  const { isProcessing } = useStore();

  const toggleStep = (index: number) => {
    const updatedSteps = [...entry.actionableSteps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      completed: !updatedSteps[index].completed
    };
    
    onUpdate({
      ...entry,
      actionableSteps: updatedSteps
    });
  };

  const handleExportToCalendar = () => {
    exportToCalendar(entry.actionableSteps);
  };

  if (entry.actionableSteps.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-2">Actionable Steps</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {isProcessing 
            ? 'Generating actionable steps based on your entry...' 
            : 'No actionable steps generated yet. Answer the AI questions to generate steps.'}
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Actionable Steps</h3>
        
        <button
          type="button"
          onClick={handleExportToCalendar}
          className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Export to Calendar
        </button>
      </div>
      
      <div className="space-y-3">
        {entry.actionableSteps.map((step, index) => (
          <div key={index} className="flex items-start">
            <input
              type="checkbox"
              checked={step.completed}
              onChange={() => toggleStep(index)}
              className="mt-1 h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label 
              className={`ml-3 text-gray-700 dark:text-gray-300 ${
                step.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}
            >
              {step.task}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionableSteps;

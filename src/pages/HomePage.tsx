import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { Entry } from '../types';
import { generateId } from '../utils';
import EntryCard from '../components/EntryCard';
import { PlusCircle, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const { entries, addEntry } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleCreateNewEntry = () => {
    const newEntry: Entry = {
      id: generateId(),
      title: 'Untitled Entry',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      aiQuestions: [],
      actionableSteps: []
    };
    
    addEntry(newEntry);
    navigate(`/entry/${newEntry.id}`);
  };
  
  // Filter entries by search term
  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Get recent entries (last 5)
  const recentEntries = filteredEntries.slice(0, 5);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to IdeaSpark</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Capture your ideas and turn them into actionable plans
          </p>
        </div>
        
        <button
          onClick={handleCreateNewEntry}
          className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Entry
        </button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search your entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-2">No entries yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by creating your first journal entry
          </p>
          <button
            onClick={handleCreateNewEntry}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create First Entry
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          
          {filteredEntries.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 py-4">
              No entries found matching "{searchTerm}"
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
          
          {filteredEntries.length > 5 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/entries')}
                className="text-yellow-500 hover:text-yellow-600 font-medium"
              >
                View All Entries ({filteredEntries.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;

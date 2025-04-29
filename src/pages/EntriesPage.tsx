import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import EntryCard from '../components/EntryCard';
import { filterEntries, getAllTags } from '../utils';
import { Search, Filter, PlusCircle, X } from 'lucide-react';

const EntriesPage: React.FC = () => {
  const { entries } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get all unique tags from entries
  const allTags = getAllTags(entries);
  
  // Filter entries based on search term and selected tags
  const filteredEntries = filterEntries(entries, searchTerm, selectedTags);
  
  const handleCreateNewEntry = () => {
    navigate('/');
  };
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">All Entries</h1>
        
        <button
          onClick={handleCreateNewEntry}
          className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Entry
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border ${
              selectedTags.length > 0
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filter by Tags</h3>
              {(selectedTags.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
                >
                  Clear all <X className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No tags found</p>
              ) : (
                allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {entries.length === 0
              ? 'No entries yet'
              : 'No entries match your search'}
          </p>
          {entries.length === 0 && (
            <button
              onClick={handleCreateNewEntry}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create First Entry
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EntriesPage;

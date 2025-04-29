import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { formatDate, exportToPDF, generateAIQuestions, generateActionableSteps } from '../utils';
import MoodPicker from '../components/MoodPicker';
import TagInput from '../components/TagInput';
import AIQuestionSection from '../components/AIQuestionSection';
import ActionableSteps from '../components/ActionableSteps';
import { Mood } from '../types';
import { ArrowLeft, Save, Trash2, Download, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const EntryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, updateEntry, deleteEntry, setIsProcessing, isProcessing } = useStore();
  
  const entry = entries.find(e => e.id === id);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood as Mood | undefined);
      setTags(entry.tags);
    } else {
      navigate('/');
    }
  }, [entry, navigate]);
  
  if (!entry) {
    return null;
  }
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    setIsSaving(true);
    
    const updatedEntry = {
      ...entry,
      title,
      content,
      mood,
      tags,
      updatedAt: new Date().toISOString(),
    };
    
    updateEntry(entry.id, updatedEntry);
    
    // Generate AI questions if none exist and content is substantial
    if (content.length > 20 && entry.aiQuestions.length === 0) {
      setIsProcessing(true);
      try {
        const questions = await generateAIQuestions(content);
        const aiQuestions = questions.map(question => ({ question, answer: '' }));
        updateEntry(entry.id, { aiQuestions });
      } catch (error) {
        console.error('Error generating AI questions:', error);
      } finally {
        setIsProcessing(false);
      }
    }
    
    // Generate actionable steps if all questions are answered and no steps exist
    if (
      entry.aiQuestions.length > 0 && 
      entry.aiQuestions.every(q => q.answer) && 
      entry.actionableSteps.length === 0
    ) {
      setIsProcessing(true);
      try {
        const answers = entry.aiQuestions.map(q => q.answer);
        const steps = await generateActionableSteps(content, answers);
        const actionableSteps = steps.map(task => ({ task, completed: false }));
        updateEntry(entry.id, { actionableSteps });
      } catch (error) {
        console.error('Error generating actionable steps:', error);
      } finally {
        setIsProcessing(false);
      }
    }
    
    setIsSaving(false);
    toast.success('Entry saved successfully');
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(entry.id);
      navigate('/');
      toast.success('Entry deleted');
    }
  };
  
  const handleExportToPDF = () => {
    exportToPDF(entry);
  };
  
  const handleUpdateEntry = (updatedEntry: any) => {
    updateEntry(entry.id, updatedEntry);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={handleExportToPDF}
            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Download className="h-5 w-5 mr-1" />
            Export PDF
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            <Trash2 className="h-5 w-5 mr-1" />
            Delete
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry Title"
            className="w-full text-2xl font-bold border-0 focus:ring-0 p-0 bg-transparent"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(entry.createdAt)}
          </p>
        </div>
        
        <TagInput tags={tags} onChange={setTags} />
        
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Write your ideas here..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white min-h-[200px]"
          />
        </div>
        
        <MoodPicker selectedMood={mood} onSelectMood={setMood} />
      </div>
      
      <AIQuestionSection entry={entry} onUpdate={handleUpdateEntry} />
      
      <ActionableSteps entry={entry} onUpdate={handleUpdateEntry} />
      
      {/* Hidden div for PDF export */}
      <div id="entry-for-export" className="hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">{entry.title}</h1>
          <p className="text-gray-500 mb-4">{formatDate(entry.createdAt)}</p>
          
          {entry.mood && (
            <p className="mb-4">
              <strong>Mood:</strong> {entry.mood}
            </p>
          )}
          
          {entry.tags.length > 0 && (
            <div className="mb-4">
              <strong>Tags:</strong> {entry.tags.join(', ')}
            </div>
          )}
          
          <div className="mb-6 whitespace-pre-wrap">{entry.content}</div>
          
          {entry.aiQuestions.some(q => q.answer) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Reflections</h2>
              {entry.aiQuestions.filter(q => q.answer).map((q, i) => (
                <div key={i} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <p className="ml-4">{q.answer}</p>
                </div>
              ))}
            </div>
          )}
          
          {entry.actionableSteps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3">Actionable Steps</h2>
              <ul>
                {entry.actionableSteps.map((step, i) => (
                  <li key={i} className={step.completed ? 'line-through' : ''}>
                    {step.task}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryDetailPage;

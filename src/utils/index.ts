import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Entry } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format time for display
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Export entry to PDF
export const exportToPDF = async (entry: Entry): Promise<void> => {
  const element = document.getElementById('entry-for-export');
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`IdeaSpark_${entry.title.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};

// Mock AI API call to generate questions
export const generateAIQuestions = async (content: string): Promise<string[]> => {
  // In a real app, this would call the xAI Grok API
  // For now, we'll simulate a response
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  
  const questions = [
    "What's the main goal you want to achieve with this idea?",
    "What obstacles might you encounter when implementing this?",
    "How could you make this idea more innovative or unique?",
  ];
  
  return questions;
};

// Mock AI API call to generate actionable steps
export const generateActionableSteps = async (content: string, answers: string[]): Promise<string[]> => {
  // In a real app, this would call the xAI Grok API
  // For now, we'll simulate a response
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  
  const steps = [
    "Research similar ideas and identify unique selling points",
    "Create a prototype or outline of your concept",
    "Share your idea with trusted colleagues for feedback",
  ];
  
  return steps;
};

// Schedule notification
export const scheduleNotification = (time: string): void => {
  // In a real app, this would use the device's notification system
  // For now, we'll just log to console
  console.log(`Notification scheduled for ${time}`);
};

// Export tasks to calendar
export const exportToCalendar = (tasks: { task: string; completed: boolean }[]): void => {
  // In a real app, this would create calendar events
  // For now, we'll just log to console
  console.log('Tasks exported to calendar:', tasks);
  alert('Tasks exported to calendar successfully!');
};

// Filter entries by search term and/or tags
export const filterEntries = (entries: Entry[], searchTerm: string, selectedTags: string[]): Entry[] => {
  return entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
};

// Get all unique tags from entries
export const getAllTags = (entries: Entry[]): string[] => {
  const tagsSet = new Set<string>();
  
  entries.forEach(entry => {
    entry.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet);
};

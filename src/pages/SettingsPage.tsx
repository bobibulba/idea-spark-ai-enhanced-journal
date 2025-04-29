import React from 'react';
import useStore from '../store';
import { Moon, Sun, Bell, BellOff } from 'lucide-react';
import { scheduleNotification } from '../utils';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, toggleDarkMode, toggleNotifications, setNotificationTime } = useStore();
  
  const handleNotificationTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setNotificationTime(newTime);
    scheduleNotification(newTime);
    toast.success(`Daily reminder set for ${newTime}`);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Appearance</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Toggle between light and dark mode
              </p>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                user.darkMode 
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {user.darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium">Notifications</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Get daily reminders to journal your ideas
              </p>
            </div>
            
            <button
              onClick={toggleNotifications}
              className={`p-2 rounded-full ${
                user.notificationsEnabled 
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {user.notificationsEnabled ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
            </button>
          </div>
          
          {user.notificationsEnabled && (
            <div>
              <label htmlFor="notification-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reminder Time (Asia/Jakarta timezone)
              </label>
              <input
                type="time"
                id="notification-time"
                value={user.notificationTime}
                onChange={handleNotificationTimeChange}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Your Progress</h2>
              <p className="text-gray-500 dark:text-gray-400">
                You've been journaling for {user.streak} day{user.streak !== 1? 's' : ''}
              </p>
            </div>
            
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full font-medium">
              {user.streak} day streak
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium mb-2">About IdeaSpark</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            IdeaSpark is a journaling app designed to help you capture, develop, and act on your ideas.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Version 1.0.0 • Built with ChatAndBuild
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import useStore from '../store';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  const { user } = useStore();
  
  useEffect(() => {
    // Apply dark mode class to body
    if (user.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Outlet />
      </main>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: user.darkMode ? '#374151' : '#ffffff',
            color: user.darkMode ? '#f3f4f6' : '#1f2937',
          },
        }}
      />
    </div>
  );
};

export default Layout;

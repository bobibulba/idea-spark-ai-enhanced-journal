import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, Menu, X, Home, BookOpen, Settings } from 'lucide-react';
import useStore from '../store';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useStore();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold">IdeaSpark</span>
          </Link>
          
          {/* Streak counter */}
          <div className="hidden md:flex items-center bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              {user.streak} day{user.streak !== 1 ? 's' : ''} streak
            </span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 ${isActive('/') ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500'}`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/entries" 
              className={`flex items-center space-x-1 ${isActive('/entries') ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500'}`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Entries</span>
            </Link>
            <Link 
              to="/settings" 
              className={`flex items-center space-x-1 ${isActive('/settings') ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500'}`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 py-2 ${isActive('/') ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={closeMenu}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/entries" 
                className={`flex items-center space-x-2 py-2 ${isActive('/entries') ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={closeMenu}
              >
                <BookOpen className="h-5 w-5" />
                <span>Entries</span>
              </Link>
              <Link 
                to="/settings" 
                className={`flex items-center space-x-2 py-2 ${isActive('/settings') ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={closeMenu}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              
              {/* Mobile streak counter */}
              <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-full self-start">
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  {user.streak} day{user.streak !== 1 ? 's' : ''} streak
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

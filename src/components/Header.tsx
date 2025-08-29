import React from 'react';
import { Cloud } from 'lucide-react';

export const Header: React.FC = () => {

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Cloud className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                WeatherDashBoard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your comprehensive weather companion
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
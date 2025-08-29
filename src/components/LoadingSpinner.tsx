import React from 'react';
import { Cloud } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <Cloud className="text-blue-500 animate-bounce" size={48} />
        <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full animate-ping"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Loading weather data...
      </p>
    </div>
  );
};
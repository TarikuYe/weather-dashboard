import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onDismiss: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onDismiss }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-yellow-500 rounded-lg flex-shrink-0">
          <Key className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            API Key Required for Real Weather Data
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            This application is currently using mock weather data. To get real-time weather information, 
            you'll need to set up an OpenWeatherMap API key.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
            >
              <AlertCircle size={16} />
              <span>Setup Instructions</span>
            </button>
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-50 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <ExternalLink size={16} />
              <span>Get API Key</span>
            </a>
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors duration-200"
            >
              Continue with Mock Data
            </button>
          </div>

          {showInstructions && (
            <div className="bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                How to Set Up Real Weather Data:
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Get a free API key from OpenWeatherMap
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">openweathermap.org/api</a> and sign up for a free account
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Create a .env file
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Copy the .env.example file to .env in your project root
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Add your API key
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 mt-1 font-mono text-xs">
                      VITE_OPENWEATHER_API_KEY=your_api_key_here
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Restart the application
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      The app will automatically use real weather data once configured
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> The free tier includes 1,000 API calls per day, which is sufficient for personal use.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LocationSearch } from './components/LocationSearch';
import { CurrentWeather } from './components/CurrentWeather';
import { DailyForecast } from './components/DailyForecast';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherAlerts } from './components/WeatherAlerts';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ApiKeySetup } from './components/ApiKeySetup';
import { useWeatherData } from './hooks/useWeatherData';
import { Location } from './types/weather';
import { Cloud } from 'lucide-react';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [showApiSetup, setShowApiSetup] = useState(false);
  const { weatherData, loading, error, refetch } = useWeatherData(selectedLocation);


  // Check if API key is configured
  useEffect(() => {
    const hasApiKey = !!import.meta.env.VITE_OPENWEATHER_API_KEY;
    setShowApiSetup(!hasApiKey);
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleRetry = () => {
    refetch();
  };

  const handleDismissApiSetup = () => {
    setShowApiSetup(false);
  };

  return (
    <div>
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* API Key Setup Notice */}
        {showApiSetup && (
          <ApiKeySetup onDismiss={handleDismissApiSetup} />
        )}

        {/* Location Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Weather Locations
          </h2>
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            currentLocation={selectedLocation}
          />
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}
        
        {/* Error State */}
        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Weather Content */}
        {weatherData && !loading && !error && (
          <div className="space-y-8">
            {/* Weather Alerts */}
            {weatherData.alerts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Weather Alerts
                </h2>
                <WeatherAlerts alerts={weatherData.alerts} />
              </div>
            )}

            {/* Current Weather */}
            <CurrentWeather weatherData={weatherData} />

            {/* Forecasts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Daily Forecast */}
              <DailyForecast forecast={weatherData.forecast.daily} />
              
              {/* Hourly Forecast */}
              <HourlyForecast forecast={weatherData.forecast.hourly} />
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!weatherData && !loading && !error && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-lg">
                <Cloud className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to WeatherDash Pro
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Get comprehensive, real-time weather information for any location worldwide. 
                Search for cities, save your favorite locations, and stay informed about changing weather conditions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Location Search
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Search for any city worldwide or use your current location for instant weather updates.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Detailed Forecasts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get 7-day forecasts and hourly predictions with comprehensive weather metrics.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Save Locations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Save your favorite locations for quick access and easy weather monitoring.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Get started by searching for a location or using your current position
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2 text-lg font-medium">
              WeatherDash Pro - Professional Weather Intelligence
            </p>
          
            <div className="flex justify-center space-x-6 text-sm">
              <a 
                href="https://openweathermap.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                Powered by OpenWeatherMap
              </a>
              <span>•</span>
              <span>Real-time Weather Data</span>
              <span>•</span>
              <span>Global Coverage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
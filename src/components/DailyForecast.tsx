import React from 'react';
import { DailyForecast as DailyForecastType } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface DailyForecastProps {
  forecast: DailyForecastType[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ forecast }) => {
  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 20) return 'text-yellow-500';
    if (temp >= 15) return 'text-green-500';
    if (temp >= 10) return 'text-blue-500';
    return 'text-blue-700';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        7-Day Forecast
      </h2>
      
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
              index === 0 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
            }`}
          >
            {/* Day and Weather Icon */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-16 text-left">
                <p className={`font-semibold ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                  {day.day}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              
              <WeatherIcon icon={day.icon} size={32} />
              
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {day.condition}
                </p>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div className="flex items-center space-x-1">
                    <Droplets size={14} />
                    <span>{day.chanceOfRain}%</span>
                  </div>
                  <span>•</span>
                  <span>{day.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* Temperature Range */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className={`text-lg font-bold ${getTemperatureColor(day.high)}`}>
                  {Math.round(day.high)}°
                </span>
                <span className="text-gray-400 dark:text-gray-500 ml-1 text-sm">
                  / {Math.round(day.low)}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
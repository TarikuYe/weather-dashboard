import React from 'react';
import { HourlyForecast as HourlyForecastType } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
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
        24-Hour Forecast
      </h2>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-max">
          {forecast.slice(0, 24).map((hour, index) => (
            <div
              key={hour.time}
              className={`flex flex-col items-center space-y-3 p-4 rounded-xl min-w-[80px] transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                index === 0 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
              }`}
            >
              {/* Time */}
              <p className={`text-sm font-medium ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {index === 0 ? 'Now' : new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', hour12: true })}
              </p>
              
              {/* Weather Icon */}
              <WeatherIcon icon={hour.icon} size={28} />
              
              {/* Temperature */}
              <p className={`text-lg font-bold ${getTemperatureColor(hour.temp)}`}>
                {Math.round(hour.temp)}°
              </p>
              
              {/* Rain Chance */}
              <div className="flex items-center space-x-1">
                <Droplets size={12} className="text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {hour.chanceOfRain}%
                </span>
              </div>
              
              {/* Wind Speed */}
              <div className="flex items-center space-x-1">
                <Wind size={12} className="text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {hour.windSpeed} km/h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun,
  CloudDrizzle
} from 'lucide-react';

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
  const { location, current } = weatherData;

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 20) return 'text-yellow-500';
    if (temp >= 15) return 'text-green-500';
    if (temp >= 10) return 'text-blue-500';
    return 'text-blue-700';
  };

  const getUVColor = (uv: number) => {
    if (uv >= 8) return 'text-red-500';
    if (uv >= 6) return 'text-orange-500';
    if (uv >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Location Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {location.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {location.region}, {location.country}
        </p>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <WeatherIcon icon={current.icon} size={64} />
          <div>
            <div className={`text-5xl font-bold ${getTemperatureColor(current.temp)}`}>
              {Math.round(current.temp)}°C
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Feels like {Math.round(current.feelsLike)}°C
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
            {current.condition}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Droplets className="text-blue-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
            <p className="font-semibold text-gray-900 dark:text-white">{current.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Wind className="text-green-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wind</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {current.windSpeed} km/h {current.windDir}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Eye className="text-purple-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visibility</p>
            <p className="font-semibold text-gray-900 dark:text-white">{current.visibility} km</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Gauge className="text-gray-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pressure</p>
            <p className="font-semibold text-gray-900 dark:text-white">{current.pressure} hPa</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Sun className={getUVColor(current.uvIndex)} size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">UV Index</p>
            <p className="font-semibold text-gray-900 dark:text-white">{current.uvIndex}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <CloudDrizzle className="text-blue-400" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cloud Cover</p>
            <p className="font-semibold text-gray-900 dark:text-white">{current.cloudCover}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
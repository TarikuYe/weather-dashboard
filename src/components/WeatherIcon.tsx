import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  Cloudy,
  Zap
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  icon, 
  size = 24, 
  className = "" 
}) => {
  const getIcon = () => {
    switch (icon.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun size={size} className={`text-yellow-500 ${className}`} />;
      case 'partly-cloudy':
      case 'partial-cloud':
        return <Cloudy size={size} className={`text-blue-400 ${className}`} />;
      case 'cloudy':
      case 'overcast':
        return <Cloud size={size} className={`text-gray-500 ${className}`} />;
      case 'rainy':
      case 'light-rain':
        return <CloudRain size={size} className={`text-blue-600 ${className}`} />;
      case 'drizzle':
        return <CloudDrizzle size={size} className={`text-blue-500 ${className}`} />;
      case 'snow':
      case 'snowy':
        return <CloudSnow size={size} className={`text-blue-200 ${className}`} />;
      case 'thunderstorm':
      case 'storm':
        return <CloudLightning size={size} className={`text-purple-600 ${className}`} />;
      case 'lightning':
        return <Zap size={size} className={`text-yellow-400 ${className}`} />;
      default:
        return <Sun size={size} className={`text-yellow-500 ${className}`} />;
    }
  };

  return getIcon();
};
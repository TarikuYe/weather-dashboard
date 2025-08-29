import React from 'react';
import { WeatherAlert } from '../types/weather';
import { AlertTriangle, Info, AlertCircle, XCircle } from 'lucide-react';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  const getAlertIcon = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return <XCircle className="text-red-600" size={24} />;
      case 'severe':
        return <AlertTriangle className="text-red-500" size={24} />;
      case 'moderate':
        return <AlertCircle className="text-yellow-500" size={24} />;
      case 'minor':
        return <Info className="text-blue-500" size={24} />;
      default:
        return <Info className="text-blue-500" size={24} />;
    }
  };

  const getAlertColors = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'severe':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'moderate':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'minor':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${getAlertColors(alert.severity)}`}
        >
          <div className="flex items-start space-x-3">
            {getAlertIcon(alert.severity)}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {alert.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {alert.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Effective: {new Date(alert.effective).toLocaleString()}
                </span>
                <span>•</span>
                <span>
                  Expires: {new Date(alert.expires).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
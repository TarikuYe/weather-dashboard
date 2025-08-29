export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDir: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    cloudCover: number;
  };
  forecast: {
    daily: DailyForecast[];
    hourly: HourlyForecast[];
  };
  alerts: WeatherAlert[];
}

export interface DailyForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  chanceOfRain: number;
}

export interface HourlyForecast {
  time: string;
  hour: string;
  temp: number;
  condition: string;
  icon: string;
  chanceOfRain: number;
  windSpeed: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  effective: string;
  expires: string;
}

export interface Location {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
}
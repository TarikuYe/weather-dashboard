import axios from 'axios';
import { WeatherData, Location, DailyForecast, HourlyForecast, WeatherAlert } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const GEO_URL = import.meta.env.VITE_OPENWEATHER_GEO_URL || 'https://api.openweathermap.org/geo/1.0';

if (!API_KEY) {
  console.warn('OpenWeatherMap API key not found. Using mock data.');
}

// Create axios instance with default config
const weatherApi = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for API key
weatherApi.interceptors.request.use((config) => {
  if (API_KEY) {
    config.params = { ...config.params, appid: API_KEY };
  }
  return config;
});

// Add response interceptor for error handling
weatherApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    }
    if (error.response?.status === 404) {
      throw new Error('Location not found. Please try a different search term.');
    }
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data.');
  }
);

// Convert OpenWeatherMap condition codes to our icon names
const getWeatherIcon = (code: number, isDay: boolean = true): string => {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rainy';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'cloudy';
  if (code === 800) return isDay ? 'sunny' : 'clear';
  if (code > 800) return 'partly-cloudy';
  return 'sunny';
};

// Convert wind direction degrees to cardinal direction
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
};

// Search for locations using OpenWeatherMap Geocoding API
export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await weatherApi.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
      },
    });

    return response.data.map((item: any, index: number) => ({
      id: `${item.lat}-${item.lon}-${index}`,
      name: item.name,
      country: item.country,
      region: item.state || item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Location search error:', error);
    // Return mock data as fallback when API fails
    const mockResults: Location[] = [
      { id: '1', name: 'New York', country: 'US', region: 'New York', lat: 40.7128, lon: -74.0060 },
      { id: '2', name: 'London', country: 'GB', region: 'England', lat: 51.5074, lon: -0.1278 },
      { id: '3', name: 'Tokyo', country: 'JP', region: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { id: '4', name: 'Sydney', country: 'AU', region: 'New South Wales', lat: -33.8688, lon: 151.2093 },
      { id: '5', name: 'Paris', country: 'FR', region: 'Île-de-France', lat: 48.8566, lon: 2.3522 },
    ].filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.country.toLowerCase().includes(query.toLowerCase()) ||
      location.region.toLowerCase().includes(query.toLowerCase())
    );
    
    return mockResults;
  }
};

// Get location by coordinates (reverse geocoding)
export const getLocationByCoords = async (lat: number, lon: number): Promise<Location> => {
  try {
    const response = await weatherApi.get(`${GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
      },
    });

    const item = response.data[0];
    if (!item) {
      throw new Error('Location not found for these coordinates');
    }

    return {
      id: `${lat}-${lon}`,
      name: item.name,
      country: item.country,
      region: item.state || item.country,
      lat,
      lon,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return fallback location when API fails
    return {
      id: 'current',
      name: 'Current Location',
      country: 'Unknown',
      region: 'Unknown',
      lat,
      lon,
    };
  }
};

// Fetch comprehensive weather data
export const fetchWeatherData = async (location: Location): Promise<WeatherData> => {
  try {
    // Fetch current weather and forecast data in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      weatherApi.get(`${BASE_URL}/weather`, {
        params: {
          lat: location.lat,
          lon: location.lon,
          units: 'metric',
        },
      }),
      weatherApi.get(`${BASE_URL}/forecast`, {
        params: {
          lat: location.lat,
          lon: location.lon,
          units: 'metric',
        },
      }),
    ]);

    const current = currentResponse.data;
    const forecast = forecastResponse.data;

    // Process current weather
    const currentWeather = {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      condition: current.weather[0].description,
      icon: getWeatherIcon(current.weather[0].id, current.dt > current.sys.sunrise && current.dt < current.sys.sunset),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
      windDir: getWindDirection(current.wind.deg || 0),
      pressure: current.main.pressure,
      visibility: Math.round((current.visibility || 10000) / 1000), // Convert to km
      uvIndex: 0, // UV index not available in free tier
      cloudCover: current.clouds.all,
    };

    // Process hourly forecast (next 24 hours)
    const hourlyForecast: HourlyForecast[] = forecast.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toISOString(),
      hour: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].description,
      icon: getWeatherIcon(item.weather[0].id),
      chanceOfRain: Math.round((item.pop || 0) * 100),
      windSpeed: Math.round(item.wind.speed * 3.6),
    }));

    // Process daily forecast (group by day)
    const dailyMap = new Map<string, any[]>();
    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)!.push(item);
    });

    const dailyForecast: DailyForecast[] = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([dateStr, items], index) => {
        const date = new Date(dateStr);
        const temps = items.map(item => item.main.temp);
        const conditions = items.map(item => item.weather[0]);
        const mostCommonCondition = conditions.reduce((a, b) => 
          conditions.filter(c => c.id === a.id).length >= conditions.filter(c => c.id === b.id).length ? a : b
        );

        return {
          date: date.toISOString().split('T')[0],
          day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 
               date.toLocaleDateString('en-US', { weekday: 'long' }),
          high: Math.round(Math.max(...temps)),
          low: Math.round(Math.min(...temps)),
          condition: mostCommonCondition.description,
          icon: getWeatherIcon(mostCommonCondition.id),
          humidity: Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length),
          windSpeed: Math.round(items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length * 3.6),
          chanceOfRain: Math.round(items.reduce((sum, item) => sum + (item.pop || 0), 0) / items.length * 100),
        };
      });

    // Weather alerts (not available in free tier, using mock data)
    const alerts: WeatherAlert[] = [];

    return {
      location,
      current: currentWeather,
      forecast: {
        daily: dailyForecast,
        hourly: hourlyForecast,
      },
      alerts,
    };
  } catch (error) {
    console.error('Weather data fetch error:', error);
    // Return mock data as fallback when API fails
    return getMockWeatherData(location);
  }
};

// Enhanced mock data for development/fallback
const getMockWeatherData = (location: Location): WeatherData => {
  const baseTemp = 20 + Math.sin(Date.now() / 86400000) * 10; // Simulate daily temperature variation
  
  return {
    location,
    current: {
      temp: Math.round(baseTemp + Math.random() * 5),
      feelsLike: Math.round(baseTemp + Math.random() * 5 + 2),
      condition: "Partly cloudy",
      icon: "partly-cloudy",
      humidity: Math.round(50 + Math.random() * 30),
      windSpeed: Math.round(5 + Math.random() * 15),
      windDir: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      pressure: Math.round(1000 + Math.random() * 50),
      visibility: Math.round(8 + Math.random() * 7),
      uvIndex: Math.round(Math.random() * 11),
      cloudCover: Math.round(Math.random() * 100),
    },
    forecast: {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : 
             new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(baseTemp + Math.random() * 8 + 2),
        low: Math.round(baseTemp - Math.random() * 8 - 2),
        condition: ["Sunny", "Partly cloudy", "Cloudy", "Light rain"][Math.floor(Math.random() * 4)],
        icon: ["sunny", "partly-cloudy", "cloudy", "rainy"][Math.floor(Math.random() * 4)],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15),
        chanceOfRain: Math.round(Math.random() * 60),
      })),
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() + i * 3600000).toISOString(),
        hour: new Date(Date.now() + i * 3600000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        temp: Math.round(baseTemp + Math.sin(i / 4) * 5 + Math.random() * 3),
        condition: ["Sunny", "Partly cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
        icon: ["sunny", "partly-cloudy", "cloudy"][Math.floor(Math.random() * 3)],
        chanceOfRain: Math.round(Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 10),
      })),
    },
    alerts: Math.random() > 0.7 ? [{
      id: "1",
      title: "Weather Advisory",
      description: "Moderate weather conditions expected. Stay informed about changing conditions.",
      severity: "moderate" as const,
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 12 * 3600000).toISOString(),
    }] : [],
  };
};
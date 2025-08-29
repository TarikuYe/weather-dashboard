import { useState, useEffect, useCallback } from 'react';
import { WeatherData, Location } from '../types/weather';
import { fetchWeatherData, searchLocations, getLocationByCoords } from '../services/weatherApi';

export const useWeatherData = (location?: Location) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (loc: Location) => {
    if (!loc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchData(location);
    }
  }, [location, fetchData]);

  const refetch = useCallback(() => {
    if (location) {
      fetchData(location);
    }
  }, [location, fetchData]);

  return { weatherData, loading, error, refetch };
};

export const useLocationSearch = () => {
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string): Promise<Location[]> => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const locations = await searchLocations(query);
      setResults(locations);
      return locations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search locations';
      setError(errorMessage);
      console.error('Location search error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const location = await getLocationByCoords(latitude, longitude);
            setLoading(false);
            resolve(location);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get location details';
            setError(errorMessage);
            setLoading(false);
            reject(new Error(errorMessage));
          }
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try searching for your city.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  return { 
    search, 
    getCurrentLocation, 
    results, 
    loading, 
    error,
    clearResults: () => setResults([]),
    clearError: () => setError(null),
  };
};

// Hook for managing saved locations with persistence
export const useSavedLocations = () => {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const maxLocations = parseInt(import.meta.env.VITE_MAX_SAVED_LOCATIONS || '10');

  // Load saved locations from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather-saved-locations');
      if (saved) {
        const locations = JSON.parse(saved);
        setSavedLocations(Array.isArray(locations) ? locations : []);
      }
    } catch (err) {
      console.error('Error loading saved locations:', err);
      setSavedLocations([]);
    }
  }, []);

  // Save locations to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('weather-saved-locations', JSON.stringify(savedLocations));
    } catch (err) {
      console.error('Error saving locations:', err);
    }
  }, [savedLocations]);

  const addLocation = useCallback((location: Location) => {
    setSavedLocations(prev => {
      // Check if location already exists
      if (prev.some(loc => loc.id === location.id)) {
        return prev;
      }
      
      // Add new location and limit to max
      const updated = [location, ...prev].slice(0, maxLocations);
      return updated;
    });
  }, [maxLocations]);

  const removeLocation = useCallback((locationId: string) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
  }, []);

  const clearAllLocations = useCallback(() => {
    setSavedLocations([]);
  }, []);

  const isLocationSaved = useCallback((locationId: string) => {
    return savedLocations.some(loc => loc.id === locationId);
  }, [savedLocations]);

  return {
    savedLocations,
    addLocation,
    removeLocation,
    clearAllLocations,
    isLocationSaved,
    maxLocations,
  };
};
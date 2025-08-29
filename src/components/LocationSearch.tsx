import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Star, AlertCircle, Navigation } from 'lucide-react';
import { Location } from '../types/weather';
import { useLocationSearch, useSavedLocations } from '../hooks/useWeatherData';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentLocation
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    search, 
    getCurrentLocation, 
    results, 
    loading: searchLoading, 
    error: searchError,
    clearResults,
    clearError
  } = useLocationSearch();
  
  const {
    savedLocations,
    addLocation,
    removeLocation,
    isLocationSaved
  } = useSavedLocations();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        clearResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearResults]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.trim()) {
      const timeout = setTimeout(() => {
        search(query).then(() => {
          setIsOpen(true);
        });
      }, 300);
      setSearchTimeout(timeout);
    } else {
      clearResults();
      setIsOpen(false);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [query, search, clearResults]);

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    addLocation(location);
    setQuery('');
    setIsOpen(false);
    clearResults();
    clearError();
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      handleLocationSelect(location);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to get current location:', error);
    }
  };

  const handleSavedLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setIsOpen(false);
    clearResults();
  };

  const handleRemoveSavedLocation = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation();
    removeLocation(locationId);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for cities, countries, or regions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-16 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true);
              }
            }}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchLoading && (
              <Loader2 className="animate-spin text-blue-500" size={20} />
            )}
            <button
              onClick={handleCurrentLocation}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 group"
              title="Use current location"
              disabled={searchLoading}
            >
              <Navigation className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200" size={20} />
            </button>
          </div>
        </div>

        {/* Search Error */}
        {searchError && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
            <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
            <span className="text-red-700 dark:text-red-300 text-sm">{searchError}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Search Results Dropdown */}
        {isOpen && (results.length > 0 || searchLoading) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
            {searchLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="animate-spin text-blue-500 mr-3" size={20} />
                <span className="text-gray-600 dark:text-gray-400">Searching locations...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200" size={18} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {location.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {location.region && location.region !== location.country && `${location.region}, `}
                          {location.country}
                        </div>
                      </div>
                    </div>
                    {isLocationSaved(location.id) && (
                      <Star className="text-yellow-500" size={16} fill="currentColor" />
                    )}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Current Location
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {currentLocation.name}
                {currentLocation.region && currentLocation.region !== currentLocation.country && 
                  `, ${currentLocation.region}`}
                {currentLocation.country && `, ${currentLocation.country}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Saved Locations
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {savedLocations.length} saved
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSavedLocationSelect(location)}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <Star className="text-yellow-500 flex-shrink-0" size={16} fill="currentColor" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {location.region && location.region !== location.country && `${location.region}, `}
                      {location.country}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveSavedLocation(e, location.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full transition-all duration-200"
                  title="Remove from saved locations"
                >
                  <X className="text-gray-400 hover:text-red-500" size={16} />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCurrentLocation}
          disabled={searchLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {searchLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Navigation size={16} />
          )}
          <span>Use Current Location</span>
        </button>
        <button
          onClick={focusInput}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <Search size={16} />
          <span>Search Locations</span>
        </button>
      </div>
    </div>
  );
};
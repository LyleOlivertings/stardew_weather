import { useState } from 'react';
import axios from 'axios';
import { MapPinIcon } from '@heroicons/react/24/solid';

export default function Geolocator({ onLocationDetected, disabled }) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const detectLocation = async () => {
    try {
      setGeoLoading(true);
      setGeoError('');
      
      if (!('geolocation' in navigator)) {
        throw new Error('Geolocation not supported');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get city name from coordinates
      const { data } = await axios.get(
        `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
      );

      onLocationDetected({
        lat: latitude,
        lon: longitude,
        name: data.name
      });
      
    } catch (error) {
      setGeoError(getErrorMessage(error));
    } finally {
      setGeoLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable permissions.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'Error detecting location. Please try again.';
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={detectLocation}
        disabled={disabled || geoLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8ba58d] text-[#f8f4e8] rounded hover:bg-[#7a947c] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#7a6a52] transition-all"
      >
        <MapPinIcon className="h-5 w-5" />
        {geoLoading ? 'Detecting Location...' : 'Use Current Location'}
      </button>
      
      {geoError && (
        <p className="mt-2 text-center text-red-600 text-sm">{geoError}</p>
      )}
    </div>
  );
}
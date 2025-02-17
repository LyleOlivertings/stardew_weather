import { useState, useEffect } from 'react';
import axios from 'axios';
import { SunIcon, CloudIcon, UmbrellaIcon, SnowflakeIcon } from '@heroicons/react/24/solid';

const SEASONS = {
  spring: { 
    name: 'Spring',
    background: '/backgrounds/spring.jpg',
    emblem: '/emblem/spring.png',
    tips: 'Perfect for planting blueberries!'
  },
  summer: {
    name: 'Summer',
    background: '/backgrounds/summer.jpg',
    emblem: '/emblem/summer.png',
    tips: 'Great time for fishing!'
  },
  fall: {
    name: 'Fall',
    background: '/backgrounds/fall.jpg',
    emblem: '/emblem/fall.png',
    tips: 'Apple picking season!'
  },
  winter: {
    name: 'Winter',
    background: '/backgrounds/winter.jpg',
    emblem: '/emblem/winter.png',
    tips: 'Ideal for mining in the caves! 🏝️'
  }
};

export default function Home() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [season, setSeason] = useState(null);

  useEffect(() => {
    // Southern Hemisphere season calculation
    const getSeason = () => {
      const month = new Date().getMonth() + 1;
      if (month >= 9 && month <= 11) return SEASONS.spring;    // Sep-Nov
      if (month === 12 || month <= 2) return SEASONS.summer;  // Dec-Feb
      if (month >= 3 && month <= 5) return SEASONS.fall;      // Mar-May
      return SEASONS.winter;                                  // Jun-Aug
    };
    
    setSeason(getSeason());
  }, []);

  const getWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      );
      setWeather(data);
      setError('');
    } catch (err) {
      setError('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      if (data.length > 0) {
        await getWeather(data[0].lat, data[0].lon);
      }
    } catch (err) {
      setError('Location not found');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return null;
    const main = weather.weather[0].main.toLowerCase();
    
    if (main.includes('rain')) return <UmbrellaIcon className="h-20 w-20 text-blue-600" />;
    if (main.includes('cloud')) return <CloudIcon className="h-20 w-20 text-white-400" />;
    if (main.includes('snow')) return <SnowflakeIcon className="h-20 w-20 text-blue-200" />;
    return <SunIcon className="h-20 w-20 text-yellow-400" />;
  };

  return (
    <div 
      className="min-h-screen p-8 font-pixel relative"
      style={{ 
        backgroundImage: `url(${season?.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="max-w-md mx-auto bg-[#f0eae0] rounded-lg shadow-lg p-6 border-4 border-[#7a6a52] relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <h1 className="text-3xl text-center text-[#5a4a32]">
            🌻 Stardew Weather 🌻
          </h1>
          {season && (
            <img 
              src={season.emblem}
              alt={season.name}
              className="h-12 w-12"
            />
          )}
        </div>

        {season && (
          <div className="text-center mb-4 text-[#5a4a32]">
            <p className="text-lg">Season: {season.name}</p>
            <p className="text-sm mt-1">{season.tips}</p>
          </div>
        )}

        

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter town name..."
              className="flex-1 px-4 py-2 rounded border-2 border-[#7a6a52] bg-[#f8f4e8] text-[#5a4a32] placeholder-[#9c8e7a] focus:outline-none focus:border-[#5a4a32]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#8ba58d] text-[#f8f4e8] rounded hover:bg-[#7a947c] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#7a6a52]"
            >
              Search
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center text-[#5a4a32]">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}

        {weather && (
          <div className="text-center bg-[#f8f4e8] p-6 rounded-lg border-2 border-[#7a6a52]">
            <div className="mb-4">
              <h2 className="text-2xl text-[#5a4a32]">{weather.name}</h2>
              <div className="text-4xl font-bold text-[#5a4a32] my-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-[#7a6a52]">
                Feels like {Math.round(weather.main.feels_like)}°C
              </div>
            </div>

            <div className="flex justify-center mb-4">
              {getWeatherIcon()}
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#5a4a32]">
              <div className="bg-[#e9e5d6] p-3 rounded border-2 border-[#7a6a52]">
                💧 Humidity: {weather.main.humidity}%
              </div>
              <div className="bg-[#e9e5d6] p-3 rounded border-2 border-[#7a6a52]">
                🌬️ Wind: {weather.wind.speed}m/s
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-[#7a6a52]">
          <p>{season?.name} in Stardew Valley</p>
          <p>Check if it's a good day for farming!</p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .font-pixel {
          font-family: 'Press Start 2P', cursive;
        }
      `}</style>
    </div>
  );
}
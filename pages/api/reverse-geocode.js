import axios from 'axios';

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    
    if (data.length > 0) {
      res.status(200).json({
        name: data[0].name
      });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location data' });
  }
}
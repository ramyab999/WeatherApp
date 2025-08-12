import { useState, useEffect, useCallback } from "react";
import Header from "./Components/Header";
import DefaultScreen from "./Components/DefaultScreen";
import SearchResult from "./Components/SearchResult";
import "./style/index.css";
import { fetchWeatherData, getCurrentWeather } from "./Services/WeatherService";

const DEFAULT_LOCATION = {
  label: "London",
  lat: 51.5085,
  lon: -0.1257,
};

function App() {
  const [dailyForecast, setDailyForecast] = useState(null);
  const [hourlyForecastData, setHourlyForecastData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [forecastLocation, setForecastLocation] = useState(DEFAULT_LOCATION);

  // Added useCallback to stabilize the function reference
  const fetchWeather = useCallback(async (lat, lon, switchScreen = false) => {
    setDataLoading(true);
    setError(null);  
    try {
      const { hourlyData, dailyData } = await fetchWeatherData(lat, lon);
      setHourlyForecastData(hourlyData);
      setDailyForecast(dailyData);
      if (switchScreen) setShowResultScreen(true);
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setError(err.message);  
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(forecastLocation.lat, forecastLocation.lon);
  }, [fetchWeather, forecastLocation.lat, forecastLocation.lon]); 

  const handleLocationSelect = (searchItem) => {
    if (!searchItem?.lat || !searchItem?.lon) return;
    
    setForecastLocation({
      label: searchItem.label,
      lat: parseFloat(searchItem.lat),
      lon: parseFloat(searchItem.lon)
    });
    fetchWeather(searchItem.lat, searchItem.lon, true);
  };

  const currentWeather = getCurrentWeather(hourlyForecastData);

  return (
    <div className="app">
      <Header />
      
      {dataLoading && <p>Loading weather data...</p>}
      {error && <p className="error">Error: {error}</p>}
      
      {!dataLoading && !error && !showResultScreen && (
        <DefaultScreen
          currentWeatherData={currentWeather}
          forecastLocation={forecastLocation}
          onHandleClick={handleLocationSelect}
        />
      )}
      
      {!dataLoading && !error && showResultScreen && (
        <SearchResult
          dailyForecast={dailyForecast}
          forecastLocation={forecastLocation}
          currentWeatherData={currentWeather}
        />
      )}
      
      <p className="copyright-text">&copy; {new Date().getFullYear()} WSA. All Rights Reserved</p>
    </div>
  );
}

export default App;
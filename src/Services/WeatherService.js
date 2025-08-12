// src/services/weatherService.js
import { fetchWeatherApi } from "openmeteo";
import {
  range,
  createWeatherObject,
  getTodayClosestTime,
} from "./RangeTimeUtils";
import { weatherCodesMapping } from "./utils";

function processData(hourly, daily) {
  const hourlyObj = createWeatherObject(
    hourly.time,
    {
      temperature2m: hourly.temperature2m,
      visibility: hourly.visibility,
      windDirection10m: hourly.windDirection10m,
      apparentTemperature: hourly.apparentTemperature,
      precipitation_probability: hourly.precipitation_probability,
      humidity: hourly.humidity,
      windSpeed: hourly.windSpeed,
      weatherCode: hourly.weatherCode,
    },
    weatherCodesMapping
  );

  const dailyObj = createWeatherObject(
    daily.time,
    {
      weatherCode: daily.weatherCode,
      temperature2mMax: daily.temperature2mMax,
      temperature2mMin: daily.temperature2mMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      sunset: daily.sunset,
      sunrise: daily.sunrise,
      uvIndexMax: daily.uvIndexMax,
      precipitationSum: daily.precipitationSum,
      windSpeed10mMax: daily.windSpeed10mMax,
      windDirection10mDominant: daily.windDirection10mDominant,
    },
    weatherCodesMapping
  );

  const hourlyData = getTodayClosestTime(hourlyObj);
  return { dailyData: dailyObj, hourlyData };
}

export const fetchWeatherData = async (lat, lon) => {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: [
      "temperature_2m",
      "weather_code",
      "visibility",
      "wind_direction_10m",
      "apparent_temperature",
      "precipitation_probability",
      "relative_humidity_2m",
      "wind_speed_10m",
    ],
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
      "sunrise",
    ],
    timezone: "auto",
  };

  const [response] = await fetchWeatherApi(
    "https://api.open-meteo.com/v1/forecast",
    params
  );

  const utcOffset = response.utcOffsetSeconds();
  const hourly = response.hourly();
  const daily = response.daily();

  const getTimes = (data) =>
    range(Number(data.time()), Number(data.timeEnd()), data.interval()).map(
      (t) => new Date((t + utcOffset) * 1000)
    );

  const weatherData = {
    hourly: {
      time: getTimes(hourly),
      temperature2m: hourly.variables(0).valuesArray(),
      weatherCode: hourly.variables(1).valuesArray(),
      visibility: hourly.variables(2).valuesArray(),
      windDirection10m: hourly.variables(3).valuesArray(),
      apparentTemperature: hourly.variables(4).valuesArray(),
      precipitation_probability: hourly.variables(5).valuesArray(),
      humidity: hourly.variables(6).valuesArray(),
      windSpeed: hourly.variables(7).valuesArray(),
    },
    daily: {
      time: getTimes(daily),
      weatherCode: daily.variables(0).valuesArray(),
      temperature2mMax: daily.variables(1).valuesArray(),
      temperature2mMin: daily.variables(2).valuesArray(),
      apparentTemperatureMax: daily.variables(3).valuesArray(),
      apparentTemperatureMin: daily.variables(4).valuesArray(),
      sunset: daily.variables(5).valuesArray(),
      uvIndexMax: daily.variables(6).valuesArray(),
      precipitationSum: daily.variables(7).valuesArray(),
      windSpeed10mMax: daily.variables(8).valuesArray(),
      windDirection10mDominant: daily.variables(9).valuesArray(),
      sunrise: daily.variables(10).valuesArray(),
    },
  };

  return processData(weatherData.hourly, weatherData.daily);
};

export const getCurrentWeather = (hourlyData) => {
  if (!hourlyData || !hourlyData.length) return [];
  return hourlyData.filter((hour) => hour.isClosestTime);
};

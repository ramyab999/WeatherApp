import React from "react";
import CardLayout from "./ui/CardLayout";
import Location from "../assets/images/location.svg";
import Temperature from "../assets/images/temperature.svg";
import Eye from "../assets/images/eye.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Windy from "../assets/images/windy.svg";
import Water from "../assets/images/water.svg";
import Sun from "../assets/images/sun.svg";
import DayForecastCard from "./ui/DayForecastCard";
import { weatherCodesMapping } from "../Services/utils";
import moment from "moment";

const SearchResult = ({
  dailyForecast,
  forecastLocation,
  currentWeatherData,
}) => {
  return (
    <div className="search-result-container-div">
      <p className="forecast-title text-capitalize">
        {currentWeatherData[0]?.values?.weatherCondition}
      </p>
      <CardLayout>
        <div className="weather-info-grid">
          {/* left block */}
          <div className="left-block">
            <img
              src={
                weatherCodesMapping[currentWeatherData[0].values.weatherCode]
                  .img
              }
              alt="weather image"
              className="weather-icon"
            />
            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{forecastLocation?.label}</p>
            </div>
            <p className="text-blue date-text">
              Today {moment(currentWeatherData[0].date).format("MMM DD")}
            </p>
          </div>

          {/* center block */}
          <div className="center-block temp-container">
            <img
              src={Temperature}
              className="thermometer-img"
              alt="thermometer image"
            />
            <div>
              <p className="main-temp">
                {parseFloat(
                  currentWeatherData[0].values?.temperature2m
                ).toFixed(0)}
              </p>
              <p>{currentWeatherData[0]?.values?.weatherCondition}</p>
            </div>
            <p className="unit-symbol">°C</p>
          </div>

          {/* right block */}
          <div className="right-block">
            {/* first row */}
            <div className="info-row">
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Eye} />
                  <p className="weather-params-label">Visibility</p>
                </div>
                <p>
                  {" "}
                  {Math.floor(
                    currentWeatherData[0].values?.visibility / 1000
                  )}{" "}
                  km
                </p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={ThermoMini} />
                  <p className="weather-params-label">Feels like</p>
                </div>
                <p>
                  {" "}
                  {Math.floor(
                    currentWeatherData[0].values?.apparentTemperature
                  )}
                  °C
                </p>
              </div>
            </div>

            {/* second row */}
            <div className="info-row margin-top-24">
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Water} />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{currentWeatherData[0].values?.humidity}%</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Windy} />
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>
                  {parseFloat(currentWeatherData[0].values?.windSpeed).toFixed(
                    0
                  )}{" "}
                  km/hr
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>

      {/* Daily forecast dynamic */}
      <div className="daily-forecast-section">
        {Object.keys(dailyForecast)?.length > 0 &&
          Object.keys(dailyForecast).map((day) => {
            return (
              <DayForecastCard key={day} data={dailyForecast[day]} date={day} />
            );
          })}
      </div>
    </div>
  );
};

export default SearchResult;

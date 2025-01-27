import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ShowWeather({
  setLocationPossibilities,
  setLocationName,
}) {
  const params = useParams();
  const lat = params.lat;
  const lon = params.lon;
  const [location, setLocation] = useState({});
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    setLocationPossibilities([]);
    setLocationName('');
  }, [setLocationPossibilities, setLocationName, lat, lon]);

  useEffect(() => {
    if (Object.keys(location).length > 0 && !lat && !lon) {
      fetchWeatherData(location.latitude, location.longitude);
    } else if (lat && lon) {
      fetchWeatherData(lat, lon);
    }
  }, [location, lon, lat]);

  function fetchWeatherData(finalLatitude, finalLongitude) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${finalLatitude}&lon=${finalLongitude}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
    )
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        },
        (networkError) => console.log(networkError.message),
      )
      .then((jsonResponse) => {
        setWeatherData(jsonResponse);
      })
      .catch((error) => console.log(error));
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  return (
    <>
      {Object.keys(location).length === 0 && (
        <p>Please enable location services</p>
      )}
      {Object.keys(weatherData).length > 0 && (
        <div>
          <p>Location: {weatherData.name}</p>
          Weather:
          <ul>
            {weatherData.weather.map((weatherCondition) => {
              return (
                <li key={`weatherCondition-${weatherCondition.id}`}>
                  {weatherCondition.main}: {weatherCondition.description}
                </li>
              );
            })}
          </ul>
          <p>Temperature: {weatherData.main.temp} &#176;C </p>
          <p>Feels like: {weatherData.main.feels_like} &#176;C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h</p>
        </div>
      )}
    </>
  );
}

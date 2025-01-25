import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [location, setLocation] = useState();
  const [weatherData, setWeatherData] = useState();

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
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
          console.log(jsonResponse);
        })
        .catch((error) => console.log(error));
    }
  }, [location]);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log(
            `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
          );
        },
        () => console.log('Unable to retrieve your location'),
      );
    } else {
      console.log('Geolocation not supported');
    }
  }

  return (
    <div>
      {!location && <p>Please enable location services</p>}
      {weatherData && (
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
    </div>
  );
}

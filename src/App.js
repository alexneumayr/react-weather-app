import './App.css';
import 'react-widgets/styles.css';
import { useEffect, useState } from 'react';
import styles from './index.css';

export default function App() {
  const [location, setLocation] = useState();
  const [weatherData, setWeatherData] = useState();
  const [locationList, setLocationList] = useState([]);
  const [cityNames, setCityNames] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [locationPossibilities, setLocationPossibilities] = useState();

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    console.log(locationList);
    if (locationList) {
      setCityNames(
        locationList.map((item) => {
          return `${item.name}${item.state ? item.state : ''}, ${item.country}`;
        }),
      );
    }
  }, [locationList]);

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

  function HandleFormSubmit(event) {
    event.preventDefault();
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=5&appid=d5c82b722cdf859ce5348827559f2d4f`,
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
        setLocationPossibilities(jsonResponse);
      })
      .catch((error) => console.log(error));
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
      <div style={{ width: '300px' }}>
        <form onSubmit={HandleFormSubmit}>
          <label htmlFor="location-name">Location: </label>
          <input
            id="location-name"
            value={locationName}
            onChange={(event) => setLocationName(event.currentTarget.value)}
          />
          <button>Set Location</button>
        </form>
        {locationPossibilities && (
          <div>
            <ul>
              {locationPossibilities.map((singleLocation) => {
                return (
                  <li>{`${singleLocation.name}, ${singleLocation.state}, ${singleLocation.country}`}</li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

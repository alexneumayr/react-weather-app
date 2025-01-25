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

  return <div></div>;
}

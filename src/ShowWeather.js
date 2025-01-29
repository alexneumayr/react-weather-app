import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ShowWeather({
  setLocationPossibilities,
  setLocationName,
}) {
  const params = useParams(); // access URL parameters
  const lat = params.lat; // variable for the latitude
  const lon = params.lon; // variable for the longitude
  const [userLocation, setUserLocation] = useState({}); // State of the user's location
  const [weatherData, setWeatherData] = useState({}); // State of the received weather data

  // Use a function to get the user's current location on the first render
  useEffect(() => {
    getUserLocation();
  }, []);

  /* Clear the location input field and the list of location possibilities
  after the user has chosen a location */
  useEffect(() => {
    setLocationPossibilities([]);
    setLocationName('');
  }, [setLocationPossibilities, setLocationName, lat, lon]);

  useEffect(() => {
    if (Object.keys(userLocation).length > 0 && !lat && !lon) {
      // If there are no coordinates in the URL fetch weather data of the current location
      fetchWeatherData(userLocation.latitude, userLocation.longitude);
    } else if (lat && lon) {
      // If there are coordinates in the URL fetch weather data of that location
      fetchWeatherData(lat, lon);
    }
  }, [userLocation, lon, lat]);

  // Function to fetch the weather data of the specified coordinates
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
        // Save received weather data in the weatherData state
        setWeatherData(jsonResponse);
      })
      .catch((error) => console.log(error));
  }

  /* Function to use the Geolocation API of the browser to get
  the user's current location and safe it in the location state */
  function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  return (
    <div className="App">
      {/* If the location state is empty ask the user enable location services */}
      {Object.keys(userLocation).length === 0 && (
        <p>Please enable location services</p>
      )}
      {/* Show the weather data after it has been successfully fetched */}
      {Object.keys(weatherData).length > 0 && (
        <div>
          <p>Location: {weatherData.name}</p>
          Weather:
          {/* As the weather conditions are received as an array
          (there can be more then one weather condition at a time) map through them
           and show them as a list */}
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

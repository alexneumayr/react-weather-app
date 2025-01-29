import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ShowWeather from './ShowWeather';

export default function App() {
  const [locationName, setLocationName] = useState('');
  const [locationPossibilities, setLocationPossibilities] = useState([]);

  useEffect(() => {
    setLocationPossibilities([]);
  }, []);

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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ShowWeather
                setLocationPossibilities={setLocationPossibilities}
                setLocationName={setLocationName}
              />
            }
          />
          <Route
            path="/:lat/:lon"
            element={
              <ShowWeather
                setLocationPossibilities={setLocationPossibilities}
                setLocationName={setLocationName}
              />
            }
          />
        </Routes>

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
          {locationPossibilities.length > 0 && (
            <div>
              <ul>
                {locationPossibilities.map((singleLocation) => {
                  return (
                    <li key={`location-${singleLocation.lat}`}>
                      <Link
                        to={`/${singleLocation.lat}/${singleLocation.lon}`}
                      >{`${singleLocation.name}${singleLocation.state ? `, ${singleLocation.state}` : ''}, ${singleLocation.country}`}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

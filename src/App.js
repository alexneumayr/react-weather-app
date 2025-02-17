import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ShowWeather from './ShowWeather';

export default function App() {
  const [locationName, setLocationName] = useState(''); // State of the "Location" input field
  const [locationPossibilities, setLocationPossibilities] = useState([]); // State of the return of the Geocoding API

  // Function to request possible location after user clicks "Set Location" button
  function HandleFormSubmit(event) {
    event.preventDefault();
    /* Send request with the location which the user has specified to the OpenWeather Geocoding API. The "limit" parameter is set to 5 which is the maximum amount of possible locations the API can deliver (this parameter has to be there as otherwise the API would only return a single location) */
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=20&appid=d5c82b722cdf859ce5348827559f2d4f`,
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
        // If the request was successful save the response to the locationPossibilities state
        setLocationPossibilities(jsonResponse);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      {/* Using ReactRouter to allow the user to just click on the link of a location.
      The coordinates are then put in the URL to be used with useParams in the ShowWeather component. */}
      <BrowserRouter>
        <Routes>
          {/* Show ShowWeather when the path is "/" */}
          <Route
            path="/"
            element={
              <ShowWeather
                setLocationPossibilities={setLocationPossibilities}
                setLocationName={setLocationName}
              />
            }
          />
          {/* Show ShowWeather when the path contains the coordinates and specify the parameter names */}
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
          {/* Show simple form with input field and "Location" button */}
          <form onSubmit={HandleFormSubmit}>
            <label htmlFor="location-name">Location: </label>
            <input
              id="location-name"
              value={locationName}
              onChange={(event) => setLocationName(event.currentTarget.value)}
            />
            <button>Set Location</button>
          </form>
          {/* When the locations are received from the Geocoding API show the locations as links in a list */}
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

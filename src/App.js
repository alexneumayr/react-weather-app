import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [location, setLocation] = useState();

  useEffect(() => {
    getLocation();
  }, []);

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

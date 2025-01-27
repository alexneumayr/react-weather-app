import { useParams } from 'react-router-dom';

export default function ShowWeather() {
  const params = useParams();
  const lat = params.lat;
  const lon = params.lon;
  return (
    <>
      Lat: {lat} <br />
      Lon: {lon}
    </>
  );
}

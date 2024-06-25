import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './map.scss';
import 'leaflet/dist/leaflet.css';
import Pin from '../pin/Pin';

function Map({ items }) {
  const [userPosition, setUserPosition] = useState([52.4797, -1.90269]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          setLoading(false);
        },
        () => {
          setLoading(false); // If there is an error or the user denies the request, stop loading
        }
      );
    } else {
      setLoading(false); // If geolocation is not supported, stop loading
    }
  }, []);

  if (loading) {
    return (
      <img
        style={{
          width: 150,
        }}
        src='/loading.gif'
      />
    ); // Optionally show a loading indicator
  }

  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : userPosition
      }
      zoom={12}
      scrollWheelZoom={true}
      className='map'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {items.map((item) => (
        <Pin
          item={item}
          key={item.id}
        />
      ))}
    </MapContainer>
  );
}

export default Map;

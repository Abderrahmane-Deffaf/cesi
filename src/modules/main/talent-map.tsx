'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { fetchAllTalents } from './fetch-tanelts';

interface Talent {
  name: string;
  prenom: string;
  lat: number;
  long: number;
  adresse: string;
  passion: string;
  is_verified: boolean | null;
  user_id: string;
}

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function TalentMap() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTalents() {
      const result = await fetchAllTalents();
      if (result.success && result.data) {
        setTalents(result.data);
      }
      setLoading(false);
    }
    loadTalents();
  }, []);

  if (loading) {
    return <div className="w-full h-[600px] flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="w-[80%] mx-auto h-[80vh] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={6}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {talents.map((talent) => (
          <Marker
            key={talent.user_id}
            position={[talent.lat, talent.long]}
            icon={customIcon}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <Link href={`/talent-profile/${talent.user_id}`} className="block hover:bg-gray-50 rounded transition-colors">
                  <h3 className="font-bold text-lg mb-2 text-blue-600 hover:text-blue-800">
                    {talent.prenom} {talent.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Address:</span> {talent.adresse}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Passions:</span> {talent.passion}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Verified:</span>{' '}
                    {talent.is_verified ? '✓' : '✗'}
                  </p>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
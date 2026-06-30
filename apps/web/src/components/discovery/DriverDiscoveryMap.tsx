'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type DriverMarker = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
};

type DriverDiscoveryMapProps = {
  center: { latitude: number; longitude: number };
  drivers: DriverMarker[];
};

export function DriverDiscoveryMap({ center, drivers }: DriverDiscoveryMapProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(elementRef.current).setView([center.latitude, center.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
    const map = mapRef.current;
    map.setView([center.latitude, center.longitude], 13);
    const layer = L.layerGroup().addTo(map);
    L.circleMarker([center.latitude, center.longitude], { radius: 8, color: '#0f766e' }).bindPopup('Your location').addTo(layer);
    drivers.forEach((driver) => {
      L.marker([driver.latitude, driver.longitude])
        .bindPopup(`${driver.name}<br />${driver.distanceKm.toFixed(1)} km away<br />Rating ${driver.rating.toFixed(1)}`)
        .addTo(layer);
    });
    return () => {
      layer.remove();
    };
  }, [center.latitude, center.longitude, drivers]);

  return <div ref={elementRef} className="h-[420px] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800" aria-label="Nearby registered drivers map" />;
}

'use client';

import dynamic from 'next/dynamic';

const DriverDiscoveryMap = dynamic(() => import('./DriverDiscoveryMap').then((module) => module.DriverDiscoveryMap), { ssr: false });

export type DriverMarker = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
};

export function DriverDiscoveryMapLoader({ center, drivers }: { center: { latitude: number; longitude: number }; drivers: DriverMarker[] }) {
  return <DriverDiscoveryMap center={center} drivers={drivers} />;
}

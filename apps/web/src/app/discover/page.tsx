import { DriverDiscoveryMapLoader } from '@/components/discovery/DriverDiscoveryMapLoader';

const demoDrivers = [
  { id: 'driver-1', name: 'Ravi Kumar', latitude: 10.0261, longitude: 76.3125, distanceKm: 1.2, rating: 4.8 },
  { id: 'driver-2', name: 'Anil Joseph', latitude: 10.018, longitude: 76.304, distanceKm: 2.1, rating: 4.6 },
];

export default function DiscoverPage() {
  const center = { latitude: 10.026, longitude: 76.308 };
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Driver discovery</p>
      <h1 className="mt-4 text-4xl font-bold">Find nearby registered auto-rickshaw drivers</h1>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">AutoConnect India shows registered drivers near you so you can call or chat directly. The platform does not assign rides, calculate fares, dispatch drivers, or collect ride payments.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <DriverDiscoveryMapLoader center={center} drivers={demoDrivers} />
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Nearby drivers</h2>
          <ul className="mt-4 grid gap-3">{demoDrivers.map((driver) => <li className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950" key={driver.id}><p className="font-semibold">{driver.name}</p><p className="text-sm text-slate-600 dark:text-slate-300">{driver.distanceKm} km away · {driver.rating} ★</p><a className="mt-3 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white" href={`tel:+910000000000`}>Call driver</a></li>)}</ul>
        </aside>
      </div>
    </main>
  );
}

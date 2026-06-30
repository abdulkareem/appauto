export default function DriverVehiclesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Vehicle management</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Drivers can add and remove auto-rickshaw records. Verification and richer vehicle photos continue in later phases.</p>
      <div className="mt-6 grid gap-3"><code className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">GET /drivers/me/vehicles</code><code className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">POST /drivers/me/vehicles</code><code className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">DELETE /drivers/me/vehicles/:vehicleId</code></div>
    </main>
  );
}

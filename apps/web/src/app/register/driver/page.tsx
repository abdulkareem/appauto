const benefits = ['Business profile', 'Availability controls', 'Customer enquiries', 'Reviews and ratings'];

export default function DriverRegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Driver registration</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Drivers create a digital business presence and subscribe monthly. The platform helps customers discover drivers but never assigns rides.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">{benefits.map((benefit) => <li className="rounded-2xl bg-teal-50 p-4 font-medium text-teal-950 dark:bg-teal-950/40 dark:text-teal-50" key={benefit}>{benefit}</li>)}</ul>
      <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"><p className="font-semibold">Phase 2 API endpoint</p><code className="mt-2 block rounded bg-slate-100 p-3 text-sm dark:bg-slate-900">POST /auth/register/driver</code></div>
    </main>
  );
}

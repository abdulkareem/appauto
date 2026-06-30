const cards = [
  ['Profile', 'Keep languages, service area, and working hours up to date.'],
  ['Vehicles', 'Add registration details for your auto-rickshaw.'],
  ['Documents', 'Upload licence, RC, auto photo, profile photo, and UPI QR.'],
  ['Availability', 'Switch availability on or off from your driver profile.'],
];

export default function DriverDashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Driver dashboard</p>
      <h1 className="mt-4 text-4xl font-bold">Manage your AutoConnect business profile</h1>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">Phase 3 adds the protected APIs that power profile management, vehicle records, and secure document uploads.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{cards.map(([title, body]) => <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p></section>)}</div>
    </main>
  );
}

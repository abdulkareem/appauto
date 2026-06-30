const principles = [
  'Driver discovery only — no ride assignment or dispatch',
  'Customers contact drivers directly',
  'Driver subscriptions power the platform',
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl shadow-teal-950/5 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">AutoConnect India</p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">A digital business platform for auto-rickshaw drivers.</h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-300">Customers discover nearby registered drivers, review profiles, and call or chat directly. AutoConnect India never assigns rides, calculates fares, or collects ride payments.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {principles.map((item) => <div key={item} className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-medium text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-50">{item}</div>)}
        </div>
      <div className="mt-8 flex flex-wrap gap-3"><a className="rounded-xl bg-brand px-5 py-3 font-semibold text-white" href="/auth">Start with OTP</a><a className="rounded-xl border border-slate-300 px-5 py-3 font-semibold" href="/register/driver">Driver registration</a><a className="rounded-xl border border-slate-300 px-5 py-3 font-semibold" href="/register/customer">Customer registration</a><a className="rounded-xl border border-slate-300 px-5 py-3 font-semibold" href="/driver/dashboard">Driver dashboard</a></div>
      </section>
    </main>
  );
}

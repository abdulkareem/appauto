export default function CustomerRegisterPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold">Customer registration</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Customers use AutoConnect India free to discover and contact registered auto-rickshaw drivers directly.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <p className="font-semibold">Phase 2 API endpoint</p>
        <code className="mt-2 block rounded bg-slate-100 p-3 text-sm dark:bg-slate-900">POST /auth/register/customer</code>
      </div>
    </main>
  );
}

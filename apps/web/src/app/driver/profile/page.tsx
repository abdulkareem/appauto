export default function DriverProfileManagementPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Driver profile management</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Use the protected API below to update bio, service area, languages, working hours, and availability.</p>
      <code className="mt-6 block rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">PUT /drivers/me/profile</code>
    </main>
  );
}

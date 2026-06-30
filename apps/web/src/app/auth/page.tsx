const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function AuthPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Mobile OTP</p>
        <h1 className="mt-4 text-3xl font-bold">Sign in to AutoConnect India</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Use <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">123456</code> as the development OTP. Production SMS providers can be connected behind the same API contract.</p>
        <form className="mt-8 grid gap-4" action={`${apiBaseUrl}/auth/otp/request`} method="post">
          <label className="grid gap-2 text-sm font-medium">Mobile number<input name="mobile" placeholder="+919876543210" className="rounded-xl border border-slate-300 bg-transparent px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-medium">Role<select name="role" className="rounded-xl border border-slate-300 bg-transparent px-4 py-3"><option value="CUSTOMER">Customer</option><option value="DRIVER">Driver</option></select></label>
          <button className="rounded-xl bg-brand px-5 py-3 font-semibold text-white" type="submit">Request OTP</button>
        </form>
      </section>
    </main>
  );
}

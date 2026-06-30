const documents = ['PROFILE_PHOTO', 'AUTO_PHOTO', 'LICENCE', 'REGISTRATION_CERTIFICATE', 'AADHAAR', 'UPI_QR'];

export default function DriverDocumentsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Document uploads</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Upload JPEG, PNG, WebP, or PDF files up to 5 MB. Aadhaar remains optional.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">{documents.map((item) => <li className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold dark:border-slate-800" key={item}>{item}</li>)}</ul>
      <code className="mt-6 block rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-900">POST multipart/form-data /drivers/me/documents</code>
    </main>
  );
}

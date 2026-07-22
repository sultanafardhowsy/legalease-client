export default function LegalPage({ title, updated, children }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: {updated}</p>
      <div className="mt-8 space-y-6 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:text-neutral-600 dark:[&_p]:text-neutral-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-neutral-600 dark:[&_ul]:text-neutral-400">
        {children}
      </div>
    </main>
  );
}

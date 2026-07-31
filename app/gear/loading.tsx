export default function GearLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="shrink-0 space-y-4 lg:w-60">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-gray-200" />
          ))}
        </aside>
        <main className="flex-1">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

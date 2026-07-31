export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 space-y-4 text-center">
        <div className="mx-auto h-10 w-72 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-5 w-96 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-10 w-36 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

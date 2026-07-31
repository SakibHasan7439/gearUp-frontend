export default function GearDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-72 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mb-10 h-40 animate-pulse rounded-lg bg-gray-200" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

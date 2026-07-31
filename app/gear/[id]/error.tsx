"use client";

export default function GearDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Failed to load gear details</h2>
      <p className="text-gray-500">{error.message}</p>
      <button
        onClick={() => reset()}
        className="rounded bg-black px-4 py-2 text-white transition-opacity hover:opacity-80"
      >
        Try again
      </button>
    </div>
  );
}

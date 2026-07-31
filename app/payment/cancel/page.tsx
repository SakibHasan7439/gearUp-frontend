"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-5xl text-red-400">✕</div>
      <h1 className="text-3xl font-bold">Payment cancelled</h1>
      <p className="text-gray-500">
        Your payment was cancelled. No charges were made.
      </p>
      {sessionId && (
        <p className="text-xs text-gray-400">Session ID: {sessionId}</p>
      )}
      <Link
        href="/dashboard/customer"
        className="rounded bg-black px-6 py-2 text-white transition-opacity hover:opacity-80"
      >
        Back to my rentals
      </Link>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-5xl text-green-500">✓</div>
      <h1 className="text-3xl font-bold">Payment successful</h1>
      <p className="text-gray-500">
        Your payment has been processed successfully.
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

"use client";

import { useMyRentals, useCreatePaymentSession } from "@/lib/queries/rentals";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const { data: rentals, isLoading } = useMyRentals();
  const { mutate: pay, isPending } = useCreatePaymentSession();

  const handlePay = (rentalId: string) => {
    pay(rentalId, {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  const hasPendingPayment = (order: typeof rentals extends (infer U)[] ? U : never) =>
    !order.payments?.some((p) => p.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">My rentals</h1>

      {rentals && rentals.length === 0 ? (
        <p className="text-gray-500">You have no rentals yet.</p>
      ) : (
        <div className="space-y-4">
          {rentals?.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <Link
                href={`/dashboard/customer/orders/${order.id}`}
                className="flex-1"
              >
                <div className="mb-1 flex items-center gap-3">
                  <span className="font-medium">#{order.id.slice(0, 8)}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()} — $
                  {order.totalAmount.toFixed(2)}
                </p>
              </Link>

              <div className="flex shrink-0 gap-2">
                {hasPendingPayment(order) && order.status !== "CANCELLED" && (
                  <button
                    onClick={() => handlePay(order.id)}
                    disabled={isPending}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  >
                    {isPending ? "Redirecting…" : "Pay Now"}
                  </button>
                )}

                {order.status === "RETURNED" && (
                  <Link
                    href={`/dashboard/customer/orders/${order.id}`}
                    className="rounded bg-gray-100 px-3 py-1.5 text-sm transition-colors hover:bg-gray-200"
                  >
                    Leave Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

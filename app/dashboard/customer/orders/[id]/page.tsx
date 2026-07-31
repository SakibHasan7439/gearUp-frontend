"use client";

import { useParams } from "next/navigation";
import { useRentalOrder } from "@/lib/queries/rentals";
import StatusBadge from "@/components/shared/StatusBadge";
import ReviewForm from "@/components/shared/ReviewForm";
import { Payment } from "@/types";
import { useCreatePaymentSession } from "@/lib/queries/rentals";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useRentalOrder(id);
  const { mutate: pay, isPending } = useCreatePaymentSession();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-gray-500">Order not found.</div>
    );
  }

  const completedPayment = order.payments?.find(
    (p: Payment) => p.status === "COMPLETED",
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Placed</span>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-gray-500">Total</span>
          <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-gray-500">Payment</span>
          <p>
            {completedPayment ? (
              <span className="text-green-600">
                Paid on{" "}
                {completedPayment.paidAt
                  ? new Date(completedPayment.paidAt).toLocaleDateString()
                  : "—"}
              </span>
            ) : (
              <span className="text-red-500">Unpaid</span>
            )}
          </p>
        </div>
      </div>

      {!completedPayment && order.status !== "CANCELLED" && (
        <button
          onClick={() =>
            pay(order.id, {
              onSuccess: (data) => {
                window.location.href = data.url;
              },
            })
          }
          disabled={isPending}
          className="mb-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Redirecting…" : "Pay Now"}
        </button>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Items</h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {item.gearItem?.name ?? item.gearItemId}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} &middot; ${item.pricePerDay.toFixed(2)}
                  /day
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.startDate).toLocaleDateString()} —{" "}
                  {new Date(item.endDate).toLocaleDateString()}
                </p>
              </div>

              {order.status === "RETURNED" && (
                <div className="w-64">
                  <ReviewForm gearItemId={item.gearItemId} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

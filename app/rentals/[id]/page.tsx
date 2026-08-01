"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRentalDetails, useCreatePaymentSession } from "@/lib/queries/rentals";
import StatusBadge from "@/components/shared/StatusBadge";
import ReviewModal from "@/components/shared/ReviewModal";
import { Payment } from "@/types";

export default function RentalDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const pollForUpdate = success === "true";
  const { data: order, isLoading } = useRentalDetails(id, pollForUpdate);
  const { mutate: pay, isPending: isPayPending } = useCreatePaymentSession();

  const handlePay = () => {
    if (!id) return;
    pay(id, {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    });
  };

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
      <div className="py-20 text-center text-gray-500">Rental order not found.</div>
    );
  }

  const completedPayment = order.payments?.find(
    (p: Payment) => p.status === "COMPLETED",
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Query param notification banners */}
      {success === "true" && order.status === "PENDING" && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-800 border-t-transparent" />
          <span>Confirming payment status, please wait…</span>
        </div>
      )}

      {success === "true" && order.status !== "PENDING" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          Payment confirmed! Your rental status is now <strong>{order.status}</strong>.
        </div>
      )}

      {success === "false" && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <span>Payment was cancelled. You can retry paying for this rental.</span>
          <button
            onClick={handlePay}
            disabled={isPayPending}
            className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:bg-red-700 disabled:opacity-50"
          >
            {isPayPending ? "Redirecting…" : "Retry Payment"}
          </button>
        </div>
      )}

      {/* Header & Status */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Rental #{order.id.slice(0, 8)}</h1>
          <StatusBadge status={order.status} />
        </div>
        <Link
          href="/dashboard/customer"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          &larr; Back to My Rentals
        </Link>
      </div>

      {/* Summary Metadata */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm sm:grid-cols-3">
        <div>
          <span className="text-gray-500 block">Placed Date</span>
          <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-gray-500 block">Total Amount</span>
          <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-gray-500 block">Payment Status</span>
          <p className="font-medium">
            {completedPayment ? (
              <span className="text-green-600">
                Paid on{" "}
                {completedPayment.paidAt
                  ? new Date(completedPayment.paidAt).toLocaleDateString()
                  : "—"}
              </span>
            ) : order.status === "CANCELLED" ? (
              <span className="text-gray-500">Cancelled</span>
            ) : (
              <span className="text-red-500">Unpaid</span>
            )}
          </p>
        </div>
      </div>

      {/* Action to pay if not paid & not cancelled */}
      {!completedPayment && order.status !== "CANCELLED" && success !== "false" && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handlePay}
            disabled={isPayPending}
            className="rounded bg-blue-600 px-4 py-2 text-white font-medium transition-opacity hover:bg-blue-700 disabled:opacity-50"
          >
            {isPayPending ? "Redirecting…" : "Pay Now"}
          </button>
        </div>
      )}

      {/* Items Section */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Rental Items</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4"
            >
              <div>
                <p className="font-medium text-base">
                  {item.gearItem?.name ?? `Gear ID: ${item.gearItemId}`}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} &middot; ${item.pricePerDay.toFixed(2)} / day
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dates: {new Date(item.startDate).toLocaleDateString()} &mdash;{" "}
                  {new Date(item.endDate).toLocaleDateString()}
                </p>
              </div>

              {order.status === "RETURNED" && (
                <div className="shrink-0">
                  <ReviewModal
                    gearItemId={item.gearItemId}
                    gearName={item.gearItem?.name}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

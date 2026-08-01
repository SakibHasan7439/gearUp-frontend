"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRentalDetails, useCreatePaymentSession } from "@/lib/queries/rentals";
import StatusBadge from "@/components/shared/StatusBadge";
import ReviewModal from "@/components/shared/ReviewModal";
import { Payment } from "@/types";
import { Button } from "@/components/ui/button";

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
        <div className="mb-6 h-8 w-48 animate-pulse bg-[#4E5D5A]/10" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-[#4E5D5A]">Rental order not found.</div>
    );
  }

  const completedPayment = order.payments?.find(
    (p: Payment) => p.status === "COMPLETED",
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Notifications */}
      {success === "true" && order.status === "PENDING" && (
        <div className="mb-6 flex items-center gap-3 border-l-4 border-[#B8823A] bg-[#B8823A]/10 p-4 text-[#20291F]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#B8823A] border-t-transparent" />
          <span className="text-sm font-mono">Confirming payment status, please wait…</span>
        </div>
      )}

      {success === "true" && order.status !== "PENDING" && (
        <div className="mb-6 border-l-4 border-[#2F4A34] bg-[#2F4A34]/10 p-4 text-[#20291F]">
          <span className="text-sm">
            Payment confirmed! Rental order is now <strong>{order.status}</strong>.
          </span>
        </div>
      )}

      {success === "false" && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-[#8C3B2E] bg-[#8C3B2E]/10 p-4 text-[#20291F]">
          <span className="text-sm font-mono">Payment was cancelled. You can retry paying for this rental order.</span>
          <Button
            size="sm"
            onClick={handlePay}
            disabled={isPayPending}
          >
            {isPayPending ? "Redirecting…" : "Retry Payment"}
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4E5D5A]/20 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
              RENTAL <span className="font-mono text-2xl">#{order.id.slice(0, 8)}</span>
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs font-mono text-[#4E5D5A] mt-1">
            Order ID: {order.id}
          </p>
        </div>
        <Link href="/dashboard/customer" className="text-xs font-mono text-[#2F4A34] hover:underline">
          &larr; Back to My Rentals
        </Link>
      </div>

      {/* Details Bar */}
      <div className="mb-8 grid grid-cols-2 gap-6 py-4 border-y border-[#4E5D5A]/20 sm:grid-cols-3">
        <div>
          <span className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A] block">Placed Date</span>
          <p className="font-mono text-sm font-semibold text-[#20291F] mt-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A] block">Total Amount</span>
          <p className="font-mono text-xl font-bold text-[#20291F] mt-0.5">
            ${order.totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <span className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A] block">Payment Status</span>
          <p className="font-mono text-sm font-semibold mt-1">
            {completedPayment ? (
              <span className="text-[#2F4A34]">
                Paid on {completedPayment.paidAt ? new Date(completedPayment.paidAt).toLocaleDateString() : "—"}
              </span>
            ) : order.status === "CANCELLED" ? (
              <span className="text-[#4E5D5A]">Cancelled</span>
            ) : (
              <span className="text-[#8C3B2E]">Unpaid</span>
            )}
          </p>
        </div>
      </div>

      {!completedPayment && order.status !== "CANCELLED" && success !== "false" && (
        <div className="mb-8 flex justify-end">
          <Button onClick={handlePay} disabled={isPayPending}>
            {isPayPending ? "Redirecting…" : "Pay Now"}
          </Button>
        </div>
      )}

      {/* Items Section */}
      <section>
        <h2 className="font-display text-xl font-bold tracking-tight text-[#20291F] mb-4">
          Rental Items
        </h2>
        <div className="divide-y divide-[#4E5D5A]/20 border-y border-[#4E5D5A]/20">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
            >
              <div>
                <p className="font-display text-base font-bold text-[#20291F]">
                  {item.gearItem?.name ?? `Gear ID: ${item.gearItemId}`}
                </p>
                <p className="font-mono text-xs text-[#4E5D5A] mt-1">
                  Qty: {item.quantity} &middot; Rate: ${item.pricePerDay.toFixed(2)}/day
                </p>
                <p className="font-mono text-xs text-[#4E5D5A] mt-0.5">
                  Dates: {new Date(item.startDate).toLocaleDateString()} &mdash; {new Date(item.endDate).toLocaleDateString()}
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

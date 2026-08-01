"use client";

import { useMyRentals, useCreatePaymentSession } from "@/lib/queries/rentals";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <div className="mb-6 h-8 w-48 animate-pulse bg-[#4E5D5A]/10" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      </div>
    );
  }

  const hasPendingPayment = (order: typeof rentals extends (infer U)[] ? U : never) =>
    !order.payments?.some((p) => p.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            MY RENTALS
          </h1>
          <p className="text-sm text-[#4E5D5A]">Track and manage your rental orders</p>
        </div>
        <Link href="/gear">
          <Button size="sm" variant="outline">Browse Gear</Button>
        </Link>
      </div>

      {rentals && rentals.length === 0 ? (
        <div className="py-12 border-y border-[#4E5D5A]/20 text-center">
          <p className="text-[#4E5D5A] mb-4">No rentals yet — browse gear to place your first rental order.</p>
          <Link href="/gear">
            <Button>Browse Gear</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[#4E5D5A]/20 border-y border-[#4E5D5A]/20">
          {rentals?.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
            >
              <Link
                href={`/rentals/${order.id}`}
                className="flex-1 group"
              >
                <div className="mb-1 flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#20291F] group-hover:text-[#B8823A] transition-colors">
                    #{order.id.slice(0, 8)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="font-mono text-xs text-[#4E5D5A]">
                  Placed: {new Date(order.createdAt).toLocaleDateString()} &middot; Total: ${order.totalAmount.toFixed(2)}
                </p>
              </Link>

              <div className="flex items-center gap-2 shrink-0">
                {hasPendingPayment(order) && order.status !== "CANCELLED" && (
                  <Button
                    size="sm"
                    onClick={() => handlePay(order.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Redirecting…" : "Pay Now"}
                  </Button>
                )}

                {order.status === "RETURNED" && (
                  <Link href={`/rentals/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Leave Review
                    </Button>
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

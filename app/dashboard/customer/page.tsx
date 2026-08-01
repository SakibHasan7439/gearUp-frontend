"use client";

import { useMyRentals } from "@/lib/queries/rentals";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeader from "@/components/shared/PageHeader";
import TableWrapper from "@/components/shared/TableWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreatePayment } from "@/lib/queries/payment";

export default function CustomerDashboardPage() {
  const { data: rentals, isLoading } = useMyRentals();
  const { mutate: pay, isPending } = useCreatePayment();

  const handlePay = (rentalId: string) => {
    pay(rentalId, {
      onSuccess: (data) => {
        window.location.href = data.paymentUrl;
      },
    });
  };

  const hasPendingPayment = (
    order: NonNullable<typeof rentals>[number],
  ) => !order.payments?.some((p) => p.status === "COMPLETED");

  return (
    <div className="w-full">
      <PageHeader
        title="My Rentals"
        description="Track and manage your rental orders"
        action={
          <Link href="/gear">
            <Button size="sm" variant="outline">
              Browse Gear
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : rentals && rentals.length === 0 ? (
        <div className="border border-[#4E5D5A]/20 py-12 text-center">
          <p className="mb-4 text-[#4E5D5A]">
            No rentals yet — browse gear to place your first rental order.
          </p>
          <Link href="/gear">
            <Button>Browse Gear</Button>
          </Link>
        </div>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-44 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/rentals/${order.id}`}
                      className="font-mono text-sm font-bold text-[#20291F] hover:text-[#B8823A] transition-colors"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-[#4E5D5A]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {
                        order.status === "PENDING" && (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}

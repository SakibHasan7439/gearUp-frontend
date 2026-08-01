"use client";

import { useProviderOrders, useUpdateOrderStatus } from "@/lib/queries/provider";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RentalStatus } from "@/types";

const nextStatusAction: Partial<
  Record<RentalStatus, { label: string; nextStatus: RentalStatus }>
> = {
  PENDING: { label: "Confirm", nextStatus: "CONFIRMED" },
  CONFIRMED: { label: "Mark Picked Up", nextStatus: "PICKED_UP" },
  PICKED_UP: { label: "Mark Returned", nextStatus: "RETURNED" },
};

export default function ProviderOrdersPage() {
  const { data: orders, isLoading } = useProviderOrders();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Incoming Orders</h1>

      {orders && orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No orders received yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-44 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => {
                const action = nextStatusAction[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-gray-600">
                      {order.customerId.slice(0, 8)}…
                    </TableCell>
                    <TableCell>{order.items?.length ?? 0}</TableCell>
                    <TableCell className="font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {action && (
                        <Button
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            updateStatus({
                              id: order.id,
                              status: action.nextStatus,
                            })
                          }
                        >
                          {isPending ? "Updating…" : action.label}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

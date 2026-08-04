"use client";

import { useState } from "react";
import { useProviderOrders, useUpdateOrderStatus } from "@/lib/queries/provider";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeader from "@/components/shared/PageHeader";
import TableWrapper from "@/components/shared/TableWrapper";
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
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, status: RentalStatus) => {
    setUpdatingOrderId(id);
    updateStatus(
      { id, status },
      {
        onSettled: () => setUpdatingOrderId(null),
      },
    );
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Incoming Orders"
        description="Manage and update order statuses"
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : orders && orders.length === 0 ? (
        <div className="border border-[#4E5D5A]/20 py-12 text-center text-[#4E5D5A]">
          No orders received yet.
        </div>
      ) : (
        <TableWrapper>
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
                const isThisUpdating =
                  isPending && updatingOrderId === order.id;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#4E5D5A]">
                      {order.customerId.slice(0, 8)}…
                    </TableCell>
                    <TableCell>{order.items?.length ?? 0}</TableCell>
                    <TableCell className="font-mono font-semibold">
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
                            handleUpdateStatus(order.id, action.nextStatus)
                          }
                        >
                          {isThisUpdating ? "Updating…" : action.label}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
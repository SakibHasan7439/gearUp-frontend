"use client";

import { useAdminRentals } from "@/lib/queries/admin";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminRentalsPage() {
  const { data: rentals, isLoading } = useAdminRentals();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Rentals</h1>
        <p className="text-sm text-gray-500">Platform-wide rental orders monitoring</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : rentals && rentals.length > 0 ? (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">
                    {order.customerId.slice(0, 8)}…
                  </TableCell>
                  <TableCell>{order.items?.length ?? 0}</TableCell>
                  <TableCell className="font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No rental orders found on the platform.
        </div>
      )}
    </div>
  );
}

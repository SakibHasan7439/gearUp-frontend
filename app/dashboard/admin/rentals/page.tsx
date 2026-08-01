"use client";

import { useAdminRentals } from "@/lib/queries/admin";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeader from "@/components/shared/PageHeader";
import TableWrapper from "@/components/shared/TableWrapper";
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
    <div className="w-full">
      <PageHeader
        title="All Rentals"
        description="Platform-wide rental orders monitoring"
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : rentals && rentals.length > 0 ? (
        <TableWrapper>
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
                  <TableCell className="text-xs text-[#4E5D5A]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : (
        <div className="border border-[#4E5D5A]/20 py-12 text-center text-[#4E5D5A]">
          No rental orders found on the platform.
        </div>
      )}
    </div>
  );
}

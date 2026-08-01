"use client";

import { useAdminGear } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminGearPage() {
  const { data: gear, isLoading } = useAdminGear();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Gear</h1>
        <p className="text-sm text-gray-500">Platform-wide gear listings moderation overview</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : gear && gear.length > 0 ? (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Provider ID</TableHead>
                <TableHead>Price/day</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gear.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.category?.name ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">
                    {item.userId.slice(0, 8)}…
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.availableQuantity > 0 ? "default" : "destructive"
                      }
                    >
                      {item.availableQuantity} / {item.totalQuantity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No gear items found on the platform.
        </div>
      )}
    </div>
  );
}

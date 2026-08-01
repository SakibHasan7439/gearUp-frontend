"use client";

import { useAdminGear } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
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

export default function AdminGearPage() {
  const { data: gear, isLoading } = useAdminGear();

  return (
    <div className="w-full">
      <PageHeader
        title="All Gear"
        description="Platform-wide gear listings moderation overview"
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : gear && gear.length > 0 ? (
        <TableWrapper>
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
                  <TableCell className="font-mono text-xs text-[#4E5D5A]">
                    {item.userId.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="font-mono">${item.price.toFixed(2)}</TableCell>
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
        </TableWrapper>
      ) : (
        <div className="border border-[#4E5D5A]/20 py-12 text-center text-[#4E5D5A]">
          No gear items found on the platform.
        </div>
      )}
    </div>
  );
}

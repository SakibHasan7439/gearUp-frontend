"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyGear, useDeleteGear } from "@/lib/queries/provider";
import { GearItem } from "@/types";
import { Button } from "@/components/ui/button";
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
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProviderGearPage() {
  const { data: gear, isLoading } = useMyGear();
  const { mutate: deleteGear, isPending: isDeleting } = useDeleteGear();
  const [itemToDelete, setItemToDelete] = useState<GearItem | null>(null);

  const handleDelete = () => {
    if (!itemToDelete) return;
    deleteGear(itemToDelete.id, {
      onSuccess: () => {
        setItemToDelete(null);
      },
    });
  };

  return (
    <div className="w-full">
      <PageHeader
        title="My Gear"
        description="Manage your rental items inventory"
        action={
          <Link href="/dashboard/provider/gear/new">
            <Button>
              <PlusIcon className="mr-1 size-4" />
              Add Gear
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse bg-[#4E5D5A]/10" />
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
                <TableHead>Price/day</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gear.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.category?.name ?? "—"}</TableCell>
                  <TableCell className="font-mono">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.availableQuantity > 0 ? "default" : "destructive"
                      }
                    >
                      {item.availableQuantity} / {item.totalQuantity} available
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/provider/gear/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <PencilIcon className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                      >
                        <TrashIcon className="size-4 text-[#8C3B2E]" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      ) : (
        <div className="border border-[#4E5D5A]/20 py-12 text-center text-[#4E5D5A]">
          No gear listed yet. Click &ldquo;Add Gear&rdquo; above to list your first item.
        </div>
      )}

      <Dialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent className="rounded-none border-[#4E5D5A]/30 bg-[#EDEAE0] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#20291F]">
              Delete Gear
            </DialogTitle>
            <DialogDescription className="text-[#4E5D5A]">
              Are you sure you want to delete &ldquo;{itemToDelete?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 border-0 bg-transparent p-0 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyGear, useDeleteGear } from "@/lib/queries/provider";
import { GearItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Gear</h1>
          <p className="text-sm text-gray-500">Manage your rental items inventory</p>
        </div>
        <Link href="/dashboard/provider/gear/new">
          <Button>
            <PlusIcon className="mr-1 size-4" />
            Add gear
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : gear && gear.length > 0 ? (
        <div className="rounded-md border">
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
                  <TableCell>${item.price.toFixed(2)}</TableCell>
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
                        <TrashIcon className="size-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No gear listed yet. Click "Add gear" above to list your first item.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete gear</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{itemToDelete?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
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

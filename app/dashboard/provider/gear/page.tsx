"use client";

import { useMyGear, useDeleteGear } from "@/lib/queries/provider";
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
import Link from "next/link";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function ProviderGearPage() {
  const { data: gear, isLoading } = useMyGear();
  const { mutate: remove, isPending } = useDeleteGear();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My gear</h1>
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
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : gear && gear.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price/day</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {gear.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.brand}</TableCell>
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
                <TableCell>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/provider/gear/${item.id}/edit`}>
                      <Button variant="outline" size="icon-sm">
                        <PencilIcon className="size-4" />
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <TrashIcon className="size-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete gear</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete &ldquo;{item.name}
                            &rdquo;? This cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            disabled={isPending}
                            onClick={() => {
                              if (deleteId) remove(deleteId);
                            }}
                          >
                            {isPending ? "Deleting…" : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500">No gear listed yet.</p>
      )}
    </div>
  );
}

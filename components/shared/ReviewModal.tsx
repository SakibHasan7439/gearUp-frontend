"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";

export default function ReviewModal({
  gearItemId,
  gearName,
}: {
  gearItemId: string;
  gearName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
        data-slot="review-trigger"
      >
        Leave Review
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {gearName ?? "gear"}</DialogTitle>
          <DialogDescription>
            Share your experience with this gear.
          </DialogDescription>
        </DialogHeader>
        <ReviewForm gearItemId={gearItemId} onSubmitted={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

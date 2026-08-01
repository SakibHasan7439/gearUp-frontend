"use client";

import { useRouter } from "next/navigation";
import { useCreateGear } from "@/lib/queries/provider";
import GearForm from "@/components/provider/GearForm";
import { RentGearFormValues } from "@/lib/validators/gear";

export default function NewGearPage() {
  const router = useRouter();
  const { mutate: createGear, isPending } = useCreateGear();

  const handleSubmit = (values: RentGearFormValues) => {
    createGear(values, {
      onSuccess: () => {
        router.push("/dashboard/provider/gear");
      },
    });
  };

  return (
    <div className="w-full">
      <GearForm
        title="Add New Gear"
        submitLabel="Create Gear"
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
}

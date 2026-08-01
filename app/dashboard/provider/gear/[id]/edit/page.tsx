"use client";

import { useParams, useRouter } from "next/navigation";
import { useMyGear, useUpdateGear } from "@/lib/queries/provider";
import GearForm from "@/components/provider/GearForm";
import { RentGearFormValues } from "@/lib/validators/gear";

export default function EditGearPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const { data: gear, isLoading } = useMyGear();
  const { mutate: updateGear, isPending } = useUpdateGear(id);

  const item = gear?.find((g) => g.id === id);

  const handleSubmit = (values: RentGearFormValues) => {
    updateGear(values, {
      onSuccess: () => {
        router.push("/dashboard/provider/gear");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="h-64 max-w-2xl animate-pulse bg-[#4E5D5A]/10" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-20 text-center text-[#4E5D5A]">Gear item not found.</div>
    );
  }

  return (
    <div className="w-full">
      <GearForm
        title={`Edit ${item.name}`}
        submitLabel="Save Changes"
        defaultValues={{
          name: item.name,
          brand: item.brand,
          price: item.price,
          description: item.description,
          categoryId: item.categoryId,
          totalQuantity: item.totalQuantity,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
}

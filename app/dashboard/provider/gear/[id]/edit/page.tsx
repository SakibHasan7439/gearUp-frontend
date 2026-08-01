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
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-20 text-center text-gray-500">Gear item not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
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

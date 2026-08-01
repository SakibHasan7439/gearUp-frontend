"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { gearSchema, RentGearFormValues } from "@/lib/validators/gear";
import { useMyGear, useUpdateGear } from "@/lib/queries/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/lib/queries/categories";

export default function EditGearPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: gear } = useMyGear();
  const { data: categories } = useCategories();
  const { mutate, isPending } = useUpdateGear();

  const item = gear?.find((g) => g.id === id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RentGearFormValues>({
    resolver: zodResolver(gearSchema),
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        brand: item.brand,
        price: item.price,
        description: item.description,
        categoryId: item.categoryId,
        totalQuantity: item.totalQuantity,
      });
    }
  }, [item, reset]);

  const onSubmit = (values: RentGearFormValues) => {
    mutate(
      { id, ...values },
      { onSuccess: () => router.push("/dashboard/provider/gear") },
    );
  };

  if (!item) {
    return (
      <div className="py-20 text-center text-gray-500">Gear not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit gear</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} />
              {errors.brand && (
                <p className="text-sm text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="price">Price per day</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                {...register("description")}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                defaultValue={item.categoryId}
                onValueChange={(v) => setValue("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="totalQuantity">Total quantity</Label>
              <Input
                id="totalQuantity"
                type="number"
                min={1}
                {...register("totalQuantity", { valueAsNumber: true })}
              />
              {errors.totalQuantity && (
                <p className="text-sm text-red-500">
                  {errors.totalQuantity.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending} className="mt-2">
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

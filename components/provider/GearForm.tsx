"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gearFormSchema, RentGearFormValues } from "@/lib/validators/gear";
import { useCategories } from "@/lib/queries/categories";
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

interface GearFormProps {
  defaultValues?: Partial<RentGearFormValues>;
  onSubmit: (values: RentGearFormValues) => void;
  isPending?: boolean;
  submitLabel?: string;
  title: string;
}

export default function GearForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Save gear",
  title,
}: GearFormProps) {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RentGearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
      description: "",
      categoryId: "",
      totalQuantity: 1,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? "",
        brand: defaultValues.brand ?? "",
        price: defaultValues.price ?? 0,
        description: defaultValues.description ?? "",
        categoryId: defaultValues.categoryId ?? "",
        totalQuantity: defaultValues.totalQuantity ?? 1,
      });
    }
  }, [defaultValues, reset]);

  const selectedCategoryId = watch("categoryId");

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Sony Alpha a7 IV" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" placeholder="e.g. Sony" {...register("brand")} />
            {errors.brand && (
              <p className="text-sm text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="price">Price per day ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
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
              rows={4}
              placeholder="Provide details about condition, included accessories, etc."
              {...register("description")}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={selectedCategoryId || ""}
              onValueChange={(val: string) => setValue("categoryId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCategories ? "Loading categories…" : "Select category"} />
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
              <p className="text-sm text-red-500">{errors.categoryId.message}</p>
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
              <p className="text-sm text-red-500">{errors.totalQuantity.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Submitting…" : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

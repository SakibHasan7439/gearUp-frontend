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
  submitLabel = "Save Gear",
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
    <div className="py-4">
      <h2 className="font-display text-2xl font-bold tracking-tight text-[#20291F] mb-6">
        {title}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Gear Name
          </Label>
          <Input
            id="name"
            placeholder="e.g. MSR Hubba Hubba 2-Person Tent"
            {...register("name")}
            className="rounded-none border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.name && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand" className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Brand
          </Label>
          <Input
            id="brand"
            placeholder="e.g. MSR"
            {...register("brand")}
            className="rounded-none border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.brand && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.brand.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price" className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Daily Rate ($)
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
            className="rounded-none border-[#4E5D5A]/40 bg-transparent font-mono px-3 py-2 text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.price && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Description
          </Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe features, condition, specs, and included accessories..."
            {...register("description")}
            className="w-full rounded-none border border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus:outline-none focus:border-[#B8823A]"
          />
          {errors.description && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">Category</Label>
          <Select
            value={selectedCategoryId || ""}
            onValueChange={(val: string) => setValue("categoryId", val, { shouldValidate: true })}
          >
            <SelectTrigger className="rounded-none border-[#4E5D5A]/40 bg-transparent">
              <SelectValue placeholder={isLoadingCategories ? "Loading categories…" : "Select category"} />
            </SelectTrigger>
            <SelectContent className="bg-[#EDEAE0] border border-[#4E5D5A]/30">
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="totalQuantity" className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">Total Quantity</Label>
          <Input
            id="totalQuantity"
            type="number"
            min={1}
            {...register("totalQuantity", { valueAsNumber: true })}
            className="rounded-none border-[#4E5D5A]/40 bg-transparent font-mono px-3 py-2 text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.totalQuantity && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.totalQuantity.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "Submitting…" : submitLabel}
        </Button>
      </form>
    </div>
  );
}

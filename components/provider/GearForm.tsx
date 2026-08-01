"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gearFormSchema, RentGearFormValues } from "@/lib/validators/gear";
import { useCategories } from "@/lib/queries/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FormField,
  formInputClass,
  formTextareaClass,
} from "@/components/shared/FormField";
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
    <div className="w-full max-w-2xl">
      <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-[#20291F] sm:text-3xl">
        {title}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField label="Gear Name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="e.g. MSR Hubba Hubba 2-Person Tent"
            className={formInputClass}
            {...register("name")}
          />
        </FormField>

        <FormField label="Brand" htmlFor="brand" error={errors.brand?.message}>
          <Input
            id="brand"
            placeholder="e.g. MSR"
            className={formInputClass}
            {...register("brand")}
          />
        </FormField>

        <FormField label="Daily Rate ($)" htmlFor="price" error={errors.price?.message}>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            className={cn(formInputClass, "font-mono")}
            {...register("price", { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
        >
          <textarea
            id="description"
            rows={4}
            placeholder="Describe features, condition, specs, and included accessories..."
            className={formTextareaClass}
            {...register("description")}
          />
        </FormField>

        <FormField label="Category" error={errors.categoryId?.message}>
          <Select
            value={selectedCategoryId || ""}
            onValueChange={(val: string) =>
              setValue("categoryId", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="rounded-none border-[#4E5D5A]/40 bg-transparent">
              <SelectValue
                placeholder={
                  isLoadingCategories ? "Loading categories…" : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent className="border border-[#4E5D5A]/30 bg-[#EDEAE0]">
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Total Quantity"
          htmlFor="totalQuantity"
          error={errors.totalQuantity?.message}
        >
          <Input
            id="totalQuantity"
            type="number"
            min={1}
            className={cn(formInputClass, "font-mono")}
            {...register("totalQuantity", { valueAsNumber: true })}
          />
        </FormField>

        <Button type="submit" disabled={isPending} className="mt-2 w-full sm:w-auto">
          {isPending ? "Submitting…" : submitLabel}
        </Button>
      </form>
    </div>
  );
}

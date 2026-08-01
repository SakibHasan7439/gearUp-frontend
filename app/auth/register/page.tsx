"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, RegisterFormValues } from "@/lib/validators/auth";
import { useRegister } from "@/lib/queries/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  formInputClass,
  formSelectClass,
} from "@/components/shared/FormField";

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex w-full max-w-sm flex-col gap-5 border-y border-[#4E5D5A]/20 py-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            CREATE ACCOUNT
          </h1>
          <p className="mt-1 font-mono text-xs text-[#4E5D5A]">
            Join GearUp as a Customer or Provider
          </p>
        </div>

        <FormField label="Full Name" error={errors.name?.message}>
          <Input
            {...register("name")}
            placeholder="Jane Doe"
            className={formInputClass}
          />
        </FormField>

        <FormField label="Email Address" error={errors.email?.message}>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={formInputClass}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className={formInputClass}
          />
        </FormField>

        <FormField label="Account Role" error={errors.role?.message}>
          <select {...register("role")} className={formSelectClass}>
            <option value="" className="bg-[#EDEAE0]">
              Select a role
            </option>
            <option value="CUSTOMER" className="bg-[#EDEAE0]">
              Customer (Rent Gear)
            </option>
            <option value="PROVIDER" className="bg-[#EDEAE0]">
              Provider (List Gear)
            </option>
          </select>
        </FormField>

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="mt-2 text-center text-xs text-[#4E5D5A]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#2F4A34] hover:underline"
          >
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}

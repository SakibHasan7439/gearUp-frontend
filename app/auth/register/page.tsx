"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, RegisterFormValues } from "@/lib/validators/auth";
import { useRegister } from "@/lib/queries/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        className="w-full max-w-sm flex flex-col gap-5 border-y border-[#4E5D5A]/20 py-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs font-mono text-[#4E5D5A] mt-1">
            Join GearUp as a Customer or Provider
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Full Name
          </Label>
          <Input
            {...register("name")}
            placeholder="Jane Doe"
            className="rounded-none border-[#4E5D5A]/40 bg-transparent text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.name && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Email Address
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="rounded-none border-[#4E5D5A]/40 bg-transparent text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.email && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Password
          </Label>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="rounded-none border-[#4E5D5A]/40 bg-transparent text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
          />
          {errors.password && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
            Account Role
          </Label>
          <select
            {...register("role")}
            className="w-full rounded-none border border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus:outline-none focus:border-[#B8823A]"
          >
            <option value="" className="bg-[#EDEAE0]">Select a role</option>
            <option value="CUSTOMER" className="bg-[#EDEAE0]">Customer (Rent Gear)</option>
            <option value="PROVIDER" className="bg-[#EDEAE0]">Provider (List Gear)</option>
          </select>
          {errors.role && (
            <p className="text-xs font-mono text-[#8C3B2E]">{errors.role.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="mt-2"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-center text-xs text-[#4E5D5A] mt-2">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[#2F4A34] hover:underline">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}

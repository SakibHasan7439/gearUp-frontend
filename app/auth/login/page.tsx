"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "@/lib/validators/auth";
import { useLogin } from "@/lib/queries/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, formInputClass } from "@/components/shared/FormField";

export default function LoginPage() {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex w-full max-w-sm flex-col gap-5 border-y border-[#4E5D5A]/20 py-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            LOG IN
          </h1>
          <p className="mt-1 font-mono text-xs text-[#4E5D5A]">
            Access your GearUp account
          </p>
        </div>

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

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Logging in..." : "Log In"}
        </Button>

        <p className="mt-2 text-center text-xs text-[#4E5D5A]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-[#2F4A34] hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

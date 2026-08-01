"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "@/lib/validators/auth";
import { useLogin } from "@/lib/queries/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        className="w-full max-w-sm flex flex-col gap-5 border-y border-[#4E5D5A]/20 py-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            LOG IN
          </h1>
          <p className="text-xs font-mono text-[#4E5D5A] mt-1">
            Access your GearUp account
          </p>
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

        <Button
          type="submit"
          disabled={isPending}
          className="mt-2"
        >
          {isPending ? "Logging in..." : "Log In"}
        </Button>

        <p className="text-center text-xs text-[#4E5D5A] mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-[#2F4A34] hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

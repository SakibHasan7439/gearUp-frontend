"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validators/auth";
import { useLogin } from "@/lib/queries/auth";

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
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="mx-auto mt-20 flex max-w-sm flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold">Log in</h1>

      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-black py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}

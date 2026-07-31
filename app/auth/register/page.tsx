"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/validators/auth";
import { useRegister } from "@/lib/queries/auth";

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
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="mx-auto mt-20 flex max-w-sm flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold">Create an account</h1>

      <div>
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full rounded border px-3 py-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

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

      <div>
        <select
          {...register("role")}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select a role</option>
          <option value="CUSTOMER">Customer</option>
          <option value="PROVIDER">Provider</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-black py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

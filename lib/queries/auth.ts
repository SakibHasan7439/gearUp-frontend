import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "../api-client";
import { useAuthStore } from "../auth-store";
import { toast } from "sonner";
import { decodeJwtToken } from "../jwt-decode";
import { LoginFormValues, RegisterFormValues } from "../validators/auth";

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await apiClient.post("/auth/login", values);
      return data.data as { accessToken: string; refreshToken: string };
    },
    onSuccess: (data) => {
      const user = decodeJwtToken(data.accessToken);
      if (user) setUser(user);
      toast.success("Logged in successfully");

      if (user?.role === "ADMIN") router.push("/dashboard/admin");
      else if (user?.role === "PROVIDER") router.push("/dashboard/provider");
      else router.push("/dashboard/customer");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Login failed");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { data } = await apiClient.post("/auth/register", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Account created — please log in");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Registration failed");
    },
  });
}
import { axiosInstance } from "@/lib/axios";
import type { LoginDto } from "@/features/auth/types/auth.types";

export const handleLogin = (data: LoginDto) => {
  return axiosInstance.post("/auth/login", data);
};

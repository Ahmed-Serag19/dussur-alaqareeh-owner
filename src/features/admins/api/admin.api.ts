import { axiosInstance } from "@/lib/axios";
import type { Admin } from "../types/admin-response.types";

export const getAdmins = () => {
  return axiosInstance.get<Admin[]>("/owner/property-requests/Get-All-Users");
};

export const toggleAdminStatus = (id: number) => {
  return axiosInstance.put(`/owner/property-requests/Toggel-User-Status/${id}`);
};

import { axiosInstance } from "@/lib/axios";
import type { Admin } from "../types/admin-response.types";

export const getAdmins = () => {
  return axiosInstance.get<Admin[]>("/owner/users");
};

export const toggleAdminStatus = (id: number) => {
  return axiosInstance.put(`/owner/users/toggle-status/${id}`);
};

export const deleteAdmin = (id: number) => {
  return axiosInstance.delete(`/owner/users/${id}`);
};

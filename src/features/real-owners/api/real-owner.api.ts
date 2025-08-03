import { axiosInstance } from "@/lib/axios";
import type {
  RealOwner,
  CreateRealOwnerRequest,
  UpdateRealOwnerRequest,
} from "../types/real-owner-response.types";

export const getRealOwners = () => {
  return axiosInstance.get<RealOwner[]>("/owner/propertymanagement/realowners");
};

export const getRealOwnerById = (id: number) => {
  return axiosInstance.get<RealOwner>(
    `/owner/propertymanagement/realowners/${id}`
  );
};

export const createRealOwner = (data: CreateRealOwnerRequest) => {
  const formData = new FormData();

  // Add realowner data as individual form fields
  formData.append("fullName", data.realowner.fullName);
  formData.append("nationalId", data.realowner.nationalId);
  formData.append("phoneNumber", data.realowner.phoneNumber);
  formData.append("accountBank", data.realowner.accountBank);
  formData.append("iban", data.realowner.iban);

  // Send the image URL if provided, otherwise send "string"
  const imageUrl = data.ibanImage
    ? "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg"
    : "string";
  formData.append("ibanImageUrl", imageUrl);

  return axiosInstance.post<RealOwner>(
    "/owner/propertymanagement/realowners",
    formData
  );
};

export const updateRealOwner = (id: number, data: UpdateRealOwnerRequest) => {
  return axiosInstance.put<RealOwner>(
    `/owner/propertymanagement/realowners/${id}`,
    data
  );
};

export const deleteRealOwner = (id: number) => {
  return axiosInstance.delete(`/owner/propertymanagement/realowners/${id}`);
};

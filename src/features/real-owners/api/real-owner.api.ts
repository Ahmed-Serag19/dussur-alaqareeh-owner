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

// Get real owner properties
export const getRealOwnerProperties = async (realOwnerId: number) => {
  const response = await axiosInstance.get(
    `/owner/propertymanagement/properties/real-owner/${realOwnerId}`
  );
  return response.data;
};

// Create new property for real owner
export const createPropertyForRealOwner = async (propertyData: {
  title: string;
  description: string;
  realOwnerId: number;
  regionId: number;
  cityId: number;
  neighborhoodId: number;
  listingTypeId: number;
  subUnits: Array<{
    propertyTypeId: number;
    paymentType: string;
    customPaymentDays: number;
    paymentValue: number;
    price: number;
    paidAmount: number;
  }>;
}) => {
  const response = await axiosInstance.post(
    "/owner/propertymanagement/properties",
    propertyData
  );
  return response.data;
};

// Update property for real owner
export const updatePropertyForRealOwner = async (
  propertyId: number,
  propertyData: {
    title: string;
    description: string;
    realOwnerId: number;
    regionId: number;
    cityId: number;
    neighborhoodId: number;
    listingTypeId: number;
    subUnits: Array<{
      propertyTypeId: number;
      paymentType: string;
      customPaymentDays: number;
      paymentValue: number;
      price: number;
      paidAmount: number;
    }>;
  }
) => {
  const response = await axiosInstance.put(
    `/owner/propertymanagement/properties/${propertyId}`,
    propertyData
  );
  return response.data;
};

import { axiosInstance } from "@/lib/axios";
import type {
  RealOwner,
  CreateRealOwnerRequest,
  UpdateRealOwnerRequest,
  RealOwnerProperty,
  CreatePropertyForRealOwnerRequest,
} from "../types/real-owner-response.types";

// Real Owner Management APIs
export const getRealOwners = () => {
  return axiosInstance.get<RealOwner[]>("/real-owners");
};

export const getRealOwnerById = (id: number) => {
  return axiosInstance.get<RealOwner>(`/real-owners/${id}`);
};

export const createRealOwner = (data: CreateRealOwnerRequest) => {
  const formData = new FormData();

  // Add realowner data as JSON with content type
  const realownerData = {
    fullName: data.realowner.fullName,
    nationalId: data.realowner.nationalId,
    phoneNumber: data.realowner.phoneNumber,
    accountBank: data.realowner.accountBank,
    iban: data.realowner.iban,
  };

  // Create a Blob with the JSON data and set content type
  const realownerBlob = new Blob([JSON.stringify(realownerData)], {
    type: "application/json",
  });

  formData.append("realowner", realownerBlob);

  // Add the image file if provided
  if (data.ibanImage) {
    formData.append("ibanImage", data.ibanImage);
  }

  return axiosInstance.post<RealOwner>("/real-owners", formData, {
    headers: {
      "Content-Type": undefined, // Let browser set it automatically for FormData
    },
  });
};

export const updateRealOwner = (
  id: number,
  data: UpdateRealOwnerRequest & { ibanImage?: File }
) => {
  // Check if we have a new image to upload
  if (data.ibanImage) {
    // Use FormData for image upload (like create)
    const formData = new FormData();

    // Build realowner data object with only provided fields
    const realownerData: Partial<{
      fullName: string;
      nationalId: string;
      phoneNumber: string;
      accountBank: string;
      iban: string;
      ibanImageUrl: string | null;
    }> = {};
    if (data.fullName !== undefined) realownerData.fullName = data.fullName;
    if (data.nationalId !== undefined)
      realownerData.nationalId = data.nationalId;
    if (data.phoneNumber !== undefined)
      realownerData.phoneNumber = data.phoneNumber;
    if (data.accountBank !== undefined)
      realownerData.accountBank = data.accountBank;
    if (data.iban !== undefined) realownerData.iban = data.iban;
    if (data.ibanImageUrl !== undefined)
      realownerData.ibanImageUrl = data.ibanImageUrl;

    // Create a Blob with the JSON data and set content type
    const realownerBlob = new Blob([JSON.stringify(realownerData)], {
      type: "application/json",
    });

    formData.append("realowner", realownerBlob);
    formData.append("ibanImage", data.ibanImage);

    return axiosInstance.put<RealOwner>(`/real-owners/${id}`, formData, {
      headers: {
        "Content-Type": undefined, // Let browser set it automatically for FormData
      },
    });
  } else {
    // Use JSON for text-only updates
    const realownerData: Partial<{
      fullName: string;
      nationalId: string;
      phoneNumber: string;
      accountBank: string;
      iban: string;
      ibanImageUrl: string | null;
    }> = {};
    if (data.fullName !== undefined) realownerData.fullName = data.fullName;
    if (data.nationalId !== undefined)
      realownerData.nationalId = data.nationalId;
    if (data.phoneNumber !== undefined)
      realownerData.phoneNumber = data.phoneNumber;
    if (data.accountBank !== undefined)
      realownerData.accountBank = data.accountBank;
    if (data.iban !== undefined) realownerData.iban = data.iban;
    if (data.ibanImageUrl !== undefined)
      realownerData.ibanImageUrl = data.ibanImageUrl;

    const jsonData = {
      realowner: realownerData,
    };

    return axiosInstance.put<RealOwner>(`/real-owners/${id}`, jsonData);
  }
};

export const deleteRealOwner = (id: number) => {
  return axiosInstance.delete(`/real-owners/${id}`);
};

// Property Management APIs for Real Owners
export const getRealOwnerProperties = (realOwnerId?: number) => {
  const params = realOwnerId ? { realOwnerId } : {};
  return axiosInstance.get<RealOwnerProperty[]>("/real-owners/properties", {
    params,
  });
};

export const getRealOwnerPropertyById = (id: number) => {
  return axiosInstance.get<RealOwnerProperty>(`/real-owners/properties/${id}`);
};

export const createPropertyForRealOwner = (
  propertyData: CreatePropertyForRealOwnerRequest
) => {
  return axiosInstance.post<RealOwnerProperty>(
    "/real-owners/properties",
    propertyData
  );
};

export const updatePropertyForRealOwner = (
  propertyId: number,
  propertyData: CreatePropertyForRealOwnerRequest
) => {
  return axiosInstance.put<RealOwnerProperty>(
    `/real-owners/properties/${propertyId}`,
    propertyData
  );
};

export const deletePropertyForRealOwner = (propertyId: number) => {
  return axiosInstance.delete(`/real-owners/properties/${propertyId}`);
};

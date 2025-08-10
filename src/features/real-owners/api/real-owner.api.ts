import { axiosInstance } from "@/lib/axios";
import type {
  RealOwner,
  CreateRealOwnerRequest,
  UpdateRealOwnerRequest,
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

    // Add realowner data as JSON with content type
    const realownerData = {
      fullName: data.fullName,
      nationalId: data.nationalId,
      phoneNumber: data.phoneNumber,
      accountBank: data.accountBank,
      iban: data.iban,
      ibanImageUrl: null, // Include null ibanImageUrl in the JSON
    };

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
    // Use JSON for text-only updates (keep existing image)
    const jsonData = {
      fullName: data.fullName,
      nationalId: data.nationalId,
      phoneNumber: data.phoneNumber,
      accountBank: data.accountBank,
      iban: data.iban,
      ibanImageUrl: data.ibanImageUrl || "string",
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
  return axiosInstance.get("/real-owners/properties", { params });
};

export const getRealOwnerPropertyById = (id: number) => {
  return axiosInstance.get(`/real-owners/properties/${id}`);
};

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
    customPaymentDays: number | null;
    paymentValue: number;
    price: number;
    paidAmount: number;
  }>;
}) => {
  const response = await axiosInstance.post(
    "/real-owners/properties",
    propertyData
  );
  return response.data;
};

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
      customPaymentDays: number | null;
      paymentValue: number;
      price: number;
      paidAmount: number;
    }>;
  }
) => {
  const response = await axiosInstance.put(
    `/real-owners/properties/${propertyId}`,
    propertyData
  );
  return response.data;
};

export const deletePropertyForRealOwner = (propertyId: number) => {
  return axiosInstance.delete(`/real-owners/properties/${propertyId}`);
};

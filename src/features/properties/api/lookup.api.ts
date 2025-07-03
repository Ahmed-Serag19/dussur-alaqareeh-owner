import { axiosInstance } from "@/lib/axios";
import type {
  LookupItem,
  CityItem,
  NeighborhoodItem,
  LookupData,
} from "@/features/properties/types/lookup.types";

// Individual lookup API calls
export const getRegions = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>("/lookup/regions");
  return response.data;
};

export const getCities = async (regionId?: number): Promise<CityItem[]> => {
  const url = regionId
    ? `/lookup/cities?region_id=${regionId}`
    : "/lookup/cities";
  const response = await axiosInstance.get<CityItem[]>(url);
  return response.data;
};

export const getNeighborhoods = async (
  cityId?: number
): Promise<NeighborhoodItem[]> => {
  const url = cityId
    ? `/lookup/neighborhoods?city_id=${cityId}`
    : "/lookup/neighborhoods";
  const response = await axiosInstance.get<NeighborhoodItem[]>(url);
  return response.data;
};

export const getPropertyTypes = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>(
    "/lookup/property-types"
  );
  return response.data;
};

export const getListingTypes = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>(
    "/lookup/listing-types"
  );
  return response.data;
};

export const getPropertyConditions = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>(
    "/lookup/property-conditions"
  );
  return response.data;
};

export const getFinishingTypes = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>(
    "/lookup/finishing-types"
  );
  return response.data;
};

export const getPropertyStatusValues = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>(
    "/lookup/property-status-values"
  );
  return response.data;
};

export const getPropertyFeatures = async (): Promise<LookupItem[]> => {
  const response = await axiosInstance.get<LookupItem[]>(
    "/lookup/property-features"
  );
  return response.data;
};

// Fetch all lookup data at once
export const getAllLookupData = async (): Promise<LookupData> => {
  const [
    regions,
    cities,
    neighborhoods,
    propertyTypes,
    listingTypes,
    propertyConditions,
    finishingTypes,
    propertyStatusValues,
    propertyFeatures,
  ] = await Promise.all([
    getRegions(),
    getCities(),
    getNeighborhoods(),
    getPropertyTypes(),
    getListingTypes(),
    getPropertyConditions(),
    getFinishingTypes(),
    getPropertyStatusValues(),
    getPropertyFeatures(),
  ]);

  return {
    regions,
    cities,
    neighborhoods,
    propertyTypes,
    listingTypes,
    propertyConditions,
    finishingTypes,
    propertyStatusValues,
    propertyFeatures,
  };
};

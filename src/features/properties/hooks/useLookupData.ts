import { useQuery } from "@tanstack/react-query";
import { getAllLookupData } from "../api/lookup.api";
import type { LookupItem } from "../types/lookup.types";
import useLanguage from "@/hooks/useLanguage";

export const useLookupData = () => {
  const { isRTL } = useLanguage();

  const {
    data: lookupData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lookup-data"],
    queryFn: getAllLookupData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getLookupValue = (
    items: LookupItem[] | undefined,
    id: number
  ): string => {
    if (!items || !id) return "";
    const item = items.find((item) => item.id === id);
    if (!item) return "";
    return isRTL ? item.nameAr : item.nameEn;
  };

  const getRegionName = (id: number) => getLookupValue(lookupData?.regions, id);
  const getCityName = (id: number, regionId?: number) => {
    if (!lookupData?.cities || !id) return "";

    // Find the city by ID
    const city = lookupData.cities.find((city) => city.id === id);
    if (!city) {
      console.warn(`City ID ${id} not found in lookup data`);
      return "";
    }

    // If regionId is provided, verify the city belongs to that region
    if (regionId && city.regionId !== regionId) {
      console.warn(
        `City ID ${id} (${city.nameAr}) does not belong to region ID ${regionId}`
      );
      return "";
    }

    return isRTL ? city.nameAr : city.nameEn;
  };

  const getNeighborhoodName = (id: number, cityId?: number) => {
    if (!lookupData?.neighborhoods || !id) return "";

    // Find the neighborhood by ID
    const neighborhood = lookupData.neighborhoods.find(
      (neighborhood) => neighborhood.id === id
    );
    if (!neighborhood) {
      console.warn(`Neighborhood ID ${id} not found in lookup data`);
      return "";
    }

    // If cityId is provided, verify the neighborhood belongs to that city
    if (cityId && neighborhood.cityId !== cityId) {
      console.warn(
        `Neighborhood ID ${id} (${neighborhood.nameAr}) does not belong to city ID ${cityId}`
      );
      return "";
    }

    return isRTL ? neighborhood.nameAr : neighborhood.nameEn;
  };
  const getPropertyTypeName = (id: number) =>
    getLookupValue(lookupData?.propertyTypes, id);
  const getListingTypeName = (id: number) =>
    getLookupValue(lookupData?.listingTypes, id);
  const getPropertyConditionName = (id: number) =>
    getLookupValue(lookupData?.propertyConditions, id);
  const getFinishingTypeName = (id: number) =>
    getLookupValue(lookupData?.finishingTypes, id);

  const getFeatureById = (id: number): LookupItem | undefined => {
    if (!lookupData?.propertyFeatures) return undefined;
    return lookupData.propertyFeatures.find(
      (feature: LookupItem) => feature.id === id
    );
  };

  return {
    lookupData,
    isLoading,
    error,
    getRegionName,
    getCityName,
    getNeighborhoodName,
    getPropertyTypeName,
    getListingTypeName,
    getPropertyConditionName,
    getFinishingTypeName,
    getFeatureById,
  };
};

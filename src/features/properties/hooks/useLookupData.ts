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
  const getCityName = (id: number) => getLookupValue(lookupData?.cities, id);
  const getNeighborhoodName = (id: number) =>
    getLookupValue(lookupData?.neighborhoods, id);
  const getPropertyTypeName = (id: number) =>
    getLookupValue(lookupData?.propertyTypes, id);
  const getListingTypeName = (id: number) =>
    getLookupValue(lookupData?.listingTypes, id);
  const getPropertyConditionName = (id: number) =>
    getLookupValue(lookupData?.propertyConditions, id);
  const getFinishingTypeName = (id: number) =>
    getLookupValue(lookupData?.finishingTypes, id);

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
  };
};

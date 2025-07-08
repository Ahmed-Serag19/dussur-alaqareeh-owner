import { MapPin } from "lucide-react";
import type { Property } from "../../../types/property-response.types";
import { useLookupData } from "@/features/properties/hooks/useLookupData";
import useLanguage from "@/hooks/useLanguage";

interface PropertyLocationDetailsProps {
  property: Property;
}

export const PropertyLocationDetails = ({
  property,
}: PropertyLocationDetailsProps) => {
  const { isRTL, t } = useLanguage();
  const { getRegionName, getCityName, getNeighborhoodName } = useLookupData();

  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <h3
        className={`text-lg font-semibold flex items-center gap-2 ${
          isRTL ? "justify-end" : ""
        }`}
      >
        <MapPin className="h-5 w-5" />
        {t("properties.viewModal.locationDetails")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.region")}
          </label>
          <p className="text-gray-900">
            {getRegionName(property.regionId) || t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.city")}
          </label>
          <p className="text-gray-900">
            {getCityName(property.cityId) || t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.neighborhood")}
          </label>
          <p className="text-gray-900">
            {getNeighborhoodName(property.neighborhoodId) ||
              t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.streetAr")}
          </label>
          <p className="text-gray-900">
            {property.streetAr || t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.streetEn")}
          </label>
          <p className="text-gray-900">
            {property.streetEn || t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.viewModal.coordinates")}
          </label>
          <p className="text-gray-900 font-mono text-sm">
            {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
};

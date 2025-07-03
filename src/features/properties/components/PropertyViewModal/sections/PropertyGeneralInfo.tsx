import { Home, Ruler, Tag } from "lucide-react";
import type { Property } from "../../../types/property-response.types";

import useLanguage from "@/hooks/useLanguage";
import { useLookupData } from "@/features/properties/hooks/useLookupData";

interface PropertyGeneralInfoProps {
  property: Property;
}

export const PropertyGeneralInfo = ({ property }: PropertyGeneralInfoProps) => {
  const { isRTL, t } = useLanguage();
  const {
    getPropertyTypeName,
    getListingTypeName,
    getPropertyConditionName,
    getFinishingTypeName,
  } = useLookupData();

  return (
    <div className="space-y-4">
      <h3
        className={`text-lg font-semibold flex items-center gap-2 ${
          isRTL ? "justify-end" : ""
        }`}
      >
        <Home className="h-5 w-5" />
        {t("properties.viewModal.generalInfo")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.title")}
          </label>
          <p className="text-gray-900">{property.title}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.area")}
          </label>
          <p
            className={`text-gray-900 flex items-center gap-1 ${
              isRTL ? "justify-end" : ""
            }`}
          >
            {property.area} {isRTL ? "متر مربع" : "sqm"}
            <Ruler className="h-4 w-4" />
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.propertyType")}
          </label>
          <p className="text-gray-900">
            {getPropertyTypeName(property.propertyTypeId) ||
              t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.listingType")}
          </label>
          <p
            className={`text-gray-900 flex items-center gap-1 ${
              isRTL ? "justify-end" : ""
            }`}
          >
            <Tag className="h-4 w-4 text-blue-600" />
            {getListingTypeName(property.listingTypeId) ||
              t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.condition")}
          </label>
          <p className="text-gray-900">
            {getPropertyConditionName(property.conditionId) ||
              t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.finishType")}
          </label>
          <p className="text-gray-900">
            {getFinishingTypeName(property.finishTypeId) ||
              t("common.notSpecified")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.buildingAge")}
          </label>
          <p className="text-gray-900">
            {property.buildingAge} {isRTL ? "سنة" : "years"}
          </p>
        </div>
        {property.descriptionAr && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-500">
              {t("properties.descriptionAr")}
            </label>
            <p className="text-gray-900 leading-relaxed">
              {property.descriptionAr}
            </p>
          </div>
        )}
        {property.descriptionEn && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-500">
              {t("properties.descriptionEn")}
            </label>
            <p className="text-gray-900 leading-relaxed">
              {property.descriptionEn}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

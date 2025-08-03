import { BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Property } from "@/features/properties/types/property-response.types";
import { useLookupData } from "@/features/properties/hooks/useLookupData";

interface Props {
  property: Property;
}

export const PropertyFeaturesView = ({ property }: Props) => {
  const { t, i18n } = useTranslation();
  const { getFeatureById } = useLookupData();
  const features = ((property.features ?? []) as number[])
    .map((id) => getFeatureById(id))
    .filter((f): f is { id: number; nameAr: string; nameEn: string } => !!f);
  const isRTL = i18n.language === "ar";
  if (features.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3
        className={`text-lg font-semibold flex items-center gap-2 ${
          isRTL ? "justify-end" : ""
        }`}
      >
        <BadgeCheck className="h-5 w-5" />
        {t("properties.featuresTitle")}
      </h3>

      <div
        className={`flex flex-wrap gap-2  ${
          isRTL ? "justify-end" : "justify-start"
        }`}
      >
        {features.map((feature) => (
          <span
            key={feature.id}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {isRTL ? feature.nameAr : feature.nameEn}
          </span>
        ))}
      </div>
    </div>
  );
};

import { Home } from "lucide-react";
import type { Property } from "../../../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface PropertySpecificationsProps {
  property: Property;
}

export const PropertySpecifications = ({
  property,
}: PropertySpecificationsProps) => {
  const { isRTL, t } = useLanguage();

  const specs = [
    { label: t("properties.roomsCount"), value: property.roomsCount },
    { label: t("properties.bathroomsCount"), value: property.bathroomsCount },
    {
      label: t("properties.livingroomsCount"),
      value: property.livingroomsCount,
    },
    { label: t("properties.floorsCount"), value: property.floorsCount },
  ];

  return (
    <div className="space-y-4">
      <h3
        className={`text-lg font-semibold flex items-center gap-2 ${
          isRTL ? "justify-end" : ""
        }`}
      >
        <Home className="h-5 w-5" />
        {t("properties.viewModal.propertySpecs")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specs.map((spec, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">{spec.value}</div>
            <div className="text-sm text-gray-600">{spec.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

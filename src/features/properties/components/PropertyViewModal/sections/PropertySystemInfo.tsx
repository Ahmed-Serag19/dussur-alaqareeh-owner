import { Calendar, Mail } from "lucide-react";
import type { Property } from "../../../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface PropertySystemInfoProps {
  property: Property;
}

export const PropertySystemInfo = ({ property }: PropertySystemInfoProps) => {
  const { isRTL, t } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <h3
        className={`text-lg font-semibold flex items-center gap-2 ${
          isRTL ? "justify-end" : ""
        }`}
      >
        <Calendar className="h-5 w-5" />
        {t("properties.systemInformation")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.viewModal.propertyId")}
          </label>
          <p className="text-gray-900 font-mono">{property.id}</p>
        </div>
        <div className="space-y-2">
          <label
            className={`text-sm font-medium text-gray-500 flex items-center gap-1 ${
              isRTL ? "justify-end" : ""
            }`}
          >
            <Mail className="h-3 w-3" />
            {t("properties.viewModal.adminEmail")}
          </label>
          <p className="text-gray-900">
            {property.adminEmail || t("common.notAssigned")}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.viewModal.createdAt")}
          </label>
          <p className="text-gray-900">{formatDate(property.createdAt)}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            {t("properties.viewModal.updatedAt")}
          </label>
          <p className="text-gray-900">{formatDate(property.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

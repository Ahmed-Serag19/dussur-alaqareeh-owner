import {
  Home,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import type { RealOwnerProperty } from "../types/real-owner-response.types";
import { useLookupData } from "@/features/properties/hooks/useLookupData";
import useLanguage from "@/hooks/useLanguage";

interface RealOwnerPropertyCardProps {
  property: RealOwnerProperty;
  onView: (property: RealOwnerProperty) => void;
  onEdit?: (property: RealOwnerProperty) => void;
  onDelete?: (propertyId: number) => void;
  isDeleting?: boolean;
}

export const RealOwnerPropertyCard = ({
  property,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
}: RealOwnerPropertyCardProps) => {
  const { isRTL, t } = useLanguage();
  const { getRegionName, getCityName } = useLookupData();

  const formatDate = (dateString: string) => {
    if (!dateString) return t("common.notSpecified");
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPrice = property.subUnits.reduce(
    (sum, unit) => sum + unit.price,
    0
  );
  const totalPaid = property.subUnits.reduce(
    (sum, unit) => sum + unit.paidAmount,
    0
  );

  // Check if all units are paid
  const isFullyPaid = property.subUnits.every((unit) => unit.isPaid === true);

  const handleDelete = () => {
    if (onDelete && !isDeleting) {
      onDelete(property.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden ${
        isFullyPaid ? "border-green-200 bg-green-50" : "border-gray-100"
      }`}
    >
      {/* Paid Status Badge */}
      {isFullyPaid && (
        <div className="bg-green-500 text-white text-center py-2 px-4">
          <span className="font-medium">{t("properties.paidComplete")}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div
          className={`flex items-start justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-2">
              {property.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {property.description}
            </p>
            <div
              className={`flex items-center gap-1 text-gray-500 mb-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">
                {property.subUnits.length} {t("properties.units")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <div className="space-y-4">
          {/* Location Info */}
          <div
            className={`flex items-center gap-2 text-sm text-gray-600 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>
              {t("properties.region")}:{" "}
              {getRegionName(property.regionId) || `ID: ${property.regionId}`} |{" "}
              {t("properties.city")}:{" "}
              {getCityName(property.cityId) || `ID: ${property.cityId}`}
            </span>
          </div>

          {/* Price Information */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t("properties.totalPrice")}:
                </span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {totalPrice.toLocaleString()} {t("common.currency")}
              </span>
            </div>
            <div
              className={`flex items-center justify-between mt-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-sm text-gray-600">
                {t("properties.paidAmount")}:
              </span>
              <span className="text-sm font-medium text-blue-600">
                {totalPaid.toLocaleString()} {t("common.currency")}
              </span>
            </div>
          </div>

          {/* Created Date */}
          <div
            className={`flex items-center gap-2 text-sm text-gray-500 ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>
              {t("common.createdAt")}: {formatDate(property.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div
          className={`flex flex-wrap gap-2 justify-center sm:justify-start ${
            isRTL ? "sm:justify-end" : ""
          }`}
        >
          <button
            onClick={() => onView(property)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium min-w-[80px]"
          >
            <Eye className="h-4 w-4" />
            <span>{t("common.view")}</span>
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(property)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 text-sm font-medium min-w-[80px]"
            >
              <Edit className="h-4 w-4" />
              <span>{t("common.edit")}</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium min-w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {isDeleting ? t("common.deleting") : t("common.delete")}
              </span>
            </button>
          )}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {t("properties.active")}
          </span>
        </div>
      </div>
    </div>
  );
};

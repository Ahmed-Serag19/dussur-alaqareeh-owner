import {
  X,
  Home,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  CreditCard,
} from "lucide-react";
import type { RealOwnerProperty } from "../types/real-owner-response.types";
import { useLookupData } from "@/features/properties/hooks/useLookupData";
import useLanguage from "@/hooks/useLanguage";

interface RealOwnerPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: RealOwnerProperty | null;
}

export const RealOwnerPropertyModal = ({
  isOpen,
  onClose,
  property,
}: RealOwnerPropertyModalProps) => {
  const { isRTL, t } = useLanguage();
  const { lookupData } = useLookupData();

  const getLookupName = (items: any[], id: number) => {
    const item = items.find((item) => item.id === id);
    if (!item) return `ID: ${id}`;
    return isRTL ? item.nameAr : item.nameEn;
  };

  if (!isOpen || !property) return null;

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
  const remainingAmount = totalPrice - totalPaid;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("realOwners.propertyDetails")} - {property.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Property Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("properties.title")}
                </label>
                <p className="text-gray-900 font-medium">{property.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("properties.description")}
                </label>
                <p className="text-gray-900">{property.description}</p>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div
                className={`flex items-center gap-2 mb-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  {t("properties.locationDetails")}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.region")}
                  </label>
                  <p className="text-gray-900">
                    {getLookupName(lookupData.regions, property.regionId)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.city")}
                  </label>
                  <p className="text-gray-900">
                    {getLookupName(lookupData.cities, property.cityId)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.neighborhood")}
                  </label>
                  <p className="text-gray-900">
                    {getLookupName(
                      lookupData.neighborhoods,
                      property.neighborhoodId
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <div
                className={`flex items-center gap-2 mb-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <DollarSign className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">
                  {t("properties.financialInfo")}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.totalPrice")}
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {totalPrice.toLocaleString()} {t("common.currency")}
                  </p>
                </div>
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.paidAmount")}
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalPaid.toLocaleString()} {t("common.currency")}
                  </p>
                </div>
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.remainingAmount")}
                  </label>
                  <p className="text-2xl font-bold text-orange-600">
                    {remainingAmount.toLocaleString()} {t("common.currency")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub Units */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div
                className={`flex items-center gap-2 mb-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Building className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">
                  {t("properties.subUnits")} ({property.subUnits.length})
                </h3>
              </div>
              <div className="space-y-3">
                {property.subUnits.map((unit, index) => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {t("properties.unit")} {index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {unit.id}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">
                          {t("properties.propertyType")}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {getLookupName(
                            lookupData.propertyTypes,
                            unit.propertyTypeId
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("properties.paymentType")}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {unit.paymentType}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("properties.price")}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {unit.price.toLocaleString()} {t("common.currency")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("properties.paidAmount")}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {unit.paidAmount.toLocaleString()}{" "}
                          {t("common.currency")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("properties.paymentValue")}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {unit.paymentValue.toLocaleString()}{" "}
                          {t("common.currency")}
                        </span>
                      </div>

                      {unit.fullName && (
                        <div>
                          <span className="text-gray-600">
                            {t("properties.fullName")}:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {unit.fullName}
                          </span>
                        </div>
                      )}
                      {unit.phoneNumber && (
                        <div>
                          <span className="text-gray-600">
                            {t("properties.phoneNumber")}:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {unit.phoneNumber}
                          </span>
                        </div>
                      )}
                      {unit.nationalId && (
                        <div>
                          <span className="text-gray-600">
                            {t("properties.nationalId")}:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {unit.nationalId}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">
                          {t("properties.isPaid")}:
                        </span>
                        <span
                          className={`ml-2 font-medium ${
                            unit.isPaid ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {unit.isPaid ? t("common.yes") : t("common.no")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

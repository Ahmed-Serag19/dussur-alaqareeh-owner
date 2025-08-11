import { X, MapPin, DollarSign, Building } from "lucide-react";
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
  const {
    lookupData,
    isLoading: isLoadingLookups,
    getRegionName,
    getCityName,
    getNeighborhoodName,
    getPropertyTypeName,
  } = useLookupData();

  // Helper function to get city name with proper region validation
  const getCityNameWithValidation = (cityId: number, regionId: number) => {
    return getCityName(cityId, regionId);
  };

  // Helper function to get neighborhood name with proper city validation
  const getNeighborhoodNameWithValidation = (
    neighborhoodId: number,
    cityId: number
  ) => {
    return getNeighborhoodName(neighborhoodId, cityId);
  };

  // Helper function to get available cities for a region
  const getAvailableCitiesForRegion = (regionId: number) => {
    if (!lookupData?.cities) return [];
    return lookupData.cities.filter((city) => city.regionId === regionId);
  };

  // Helper function to get available neighborhoods for a city
  const getAvailableNeighborhoodsForCity = (cityId: number) => {
    if (!lookupData?.neighborhoods) return [];
    return lookupData.neighborhoods.filter(
      (neighborhood) => neighborhood.cityId === cityId
    );
  };

  // Debug logging
  if (property) {
    console.log("=== PROPERTY LOCATION DEBUG ===");
    console.log("Property data:", {
      regionId: property.regionId,
      cityId: property.cityId,
      neighborhoodId: property.neighborhoodId,
    });

    console.log(
      "Available regions:",
      lookupData?.regions?.map((r) => ({
        id: r.id,
        nameAr: r.nameAr,
        nameEn: r.nameEn,
      }))
    );
    console.log(
      "Available cities:",
      lookupData?.cities?.map((c) => ({
        id: c.id,
        regionId: c.regionId,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
      }))
    );
    console.log(
      "Available neighborhoods:",
      lookupData?.neighborhoods?.map((n) => ({
        id: n.id,
        cityId: n.cityId,
        nameAr: n.nameAr,
        nameEn: n.nameEn,
      }))
    );

    // Show what cities are available for this region
    const citiesInRegion = lookupData?.cities?.filter(
      (c) => c.regionId === property.regionId
    );
    console.log(
      `Cities available for region ${property.regionId}:`,
      citiesInRegion
    );

    // Show what neighborhoods are available for this city
    const neighborhoodsInCity = lookupData?.neighborhoods?.filter(
      (n) => n.cityId === property.cityId
    );
    console.log(
      `Neighborhoods available for city ${property.cityId}:`,
      neighborhoodsInCity
    );

    // Hierarchical validation debugging
    const directRegion = lookupData?.regions?.find(
      (r) => r.id === property.regionId
    );
    const directCity = lookupData?.cities?.find(
      (c) => c.id === property.cityId
    );
    const directNeighborhood = lookupData?.neighborhoods?.find(
      (n) => n.id === property.neighborhoodId
    );

    // Check hierarchical relationships
    const cityBelongsToRegion =
      directCity && directCity.regionId === property.regionId;
    const neighborhoodBelongsToCity =
      directNeighborhood && directNeighborhood.cityId === property.cityId;

    console.log("Hierarchical validation results:", {
      region: directRegion,
      city: directCity,
      neighborhood: directNeighborhood,
      cityBelongsToRegion,
      neighborhoodBelongsToCity,
    });

    console.log("=== END DEBUG ===");
  }

  if (!isOpen || !property) return null;

  const totalPrice =
    property.subUnits?.reduce((sum, unit) => sum + unit.price, 0) || 0;
  const totalPaid =
    property.subUnits?.reduce((sum, unit) => sum + unit.paidAmount, 0) || 0;
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
          <div
            className={`flex items-center justify-between p-6 border-b border-gray-200 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
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
                    {isLoadingLookups ? (
                      <span className="animate-pulse bg-gray-200 h-4 w-24 rounded"></span>
                    ) : (
                      getRegionName(property.regionId) ||
                      `ID: ${property.regionId} (غير موجود في البيانات)`
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.city")}
                  </label>
                  <p className="text-gray-900">
                    {isLoadingLookups ? (
                      <span className="animate-pulse bg-gray-200 h-4 w-24 rounded"></span>
                    ) : (
                      (() => {
                        const cityName = getCityNameWithValidation(
                          property.cityId,
                          property.regionId
                        );
                        if (cityName) return cityName;

                        const availableCities = getAvailableCitiesForRegion(
                          property.regionId
                        );
                        const availableCityNames = availableCities
                          .map((c) => `${c.nameAr} (ID: ${c.id})`)
                          .join(", ");

                        return `ID: ${property.cityId} (غير موجود في المنطقة ${
                          property.regionId
                        })
                                المدن المتاحة: ${
                                  availableCityNames || "لا توجد مدن"
                                }`;
                      })()
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {t("properties.neighborhood")}
                  </label>
                  <p className="text-gray-900">
                    {isLoadingLookups ? (
                      <span className="animate-pulse bg-gray-200 h-4 w-24 rounded"></span>
                    ) : (
                      (() => {
                        const neighborhoodName =
                          getNeighborhoodNameWithValidation(
                            property.neighborhoodId,
                            property.cityId
                          );
                        if (neighborhoodName) return neighborhoodName;

                        const availableNeighborhoods =
                          getAvailableNeighborhoodsForCity(property.cityId);
                        const availableNeighborhoodNames =
                          availableNeighborhoods
                            .map((n) => `${n.nameAr} (ID: ${n.id})`)
                            .join(", ");

                        return `ID: ${
                          property.neighborhoodId
                        } (غير موجود في المدينة ${property.cityId})
                                الأحياء المتاحة: ${
                                  availableNeighborhoodNames || "لا توجد أحياء"
                                }`;
                      })()
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
                  {t("properties.subUnits")} ({property.subUnits?.length || 0})
                </h3>
              </div>
              <div className="space-y-3">
                {property.subUnits?.map((unit, index) => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div
                      className={`flex items-center justify-between mb-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
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
                          {isLoadingLookups ? (
                            <span className="animate-pulse bg-gray-200 h-4 w-16 rounded"></span>
                          ) : (
                            getPropertyTypeName(unit.propertyTypeId) ||
                            `ID: ${unit.propertyTypeId}`
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("properties.paymentType")}:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {t(`properties.${unit.paymentType}`)}
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
                      {unit.tenantName && (
                        <div>
                          <span className="text-gray-600">
                            {t("properties.tenantName")}:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {unit.tenantName}
                          </span>
                        </div>
                      )}
                      {unit.tenantPhoneNumber && (
                        <div>
                          <span className="text-gray-600">
                            {t("properties.tenantPhoneNumber")}:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {unit.tenantPhoneNumber}
                          </span>
                        </div>
                      )}
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

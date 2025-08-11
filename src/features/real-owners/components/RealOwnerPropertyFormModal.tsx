import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type {
  RealOwnerProperty,
  CreatePropertyForRealOwnerRequest,
} from "../types/real-owner-response.types";
import { useLookupData } from "@/features/properties/hooks/useLookupData";
import useLanguage from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

interface RealOwnerPropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePropertyForRealOwnerRequest) => void;
  property?: RealOwnerProperty | null;
  isLoading?: boolean;
  realOwnerId: number;
  error?: string | null;
}

export const RealOwnerPropertyFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  property,
  isLoading = false,
  realOwnerId,
  error,
}: RealOwnerPropertyFormModalProps) => {
  const { isRTL, t } = useLanguage();
  const { lookupData, isLoading: isLoadingLookups } = useLookupData();

  const [formData, setFormData] = useState<CreatePropertyForRealOwnerRequest>({
    title: "",
    description: "",
    realOwnerId,
    regionId: 0,
    cityId: 0,
    neighborhoodId: 0,
    listingTypeId: 0,
    subUnits: [],
  });

  // Initialize form data when property is provided (edit mode)
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        realOwnerId: realOwnerId, // Use the prop since it's not in the response
        regionId: property.regionId,
        cityId: property.cityId,
        neighborhoodId: property.neighborhoodId,
        listingTypeId: property.listingTypeId,
        subUnits: property.subUnits.map((unit) => ({
          propertyTypeId: unit.propertyTypeId,
          paymentType: unit.paymentType,
          paymentValue: unit.paymentValue,
          price: unit.price,
          paidAmount: unit.paidAmount,
          tenantName: unit.tenantName,
          tenantPhoneNumber: unit.tenantPhoneNumber,
        })),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        realOwnerId,
        regionId: 0,
        cityId: 0,
        neighborhoodId: 0,
        listingTypeId: 0,
        subUnits: [],
      });
    }
  }, [property, realOwnerId]);

  // Filter cities based on selected region
  const filteredCities =
    lookupData?.cities.filter((city) => city.regionId === formData.regionId) ||
    [];

  // Filter neighborhoods based on selected city
  const filteredNeighborhoods =
    lookupData?.neighborhoods.filter(
      (neighborhood) => neighborhood.cityId === formData.cityId
    ) || [];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubUnitChange = (
    index: number,
    field: string,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      subUnits: prev.subUnits.map((unit, i) =>
        i === index ? { ...unit, [field]: value } : unit
      ),
    }));
  };

  const addSubUnit = () => {
    setFormData((prev) => ({
      ...prev,
      subUnits: [
        ...prev.subUnits,
        {
          propertyTypeId: 0,
          paymentType: "",
          paymentValue: 0,
          price: 0,
          paidAmount: 0,
          tenantName: null,
          tenantPhoneNumber: null,
        },
      ],
    }));
  };

  // Clean form data before submission to handle null values
  const cleanFormData = (data: CreatePropertyForRealOwnerRequest) => {
    return {
      ...data,
      subUnits: data.subUnits.map((unit) => ({
        ...unit,
        paymentValue: unit.paymentValue || 0,
        paidAmount: unit.paidAmount || 0,
        price: unit.price || 0,
      })),
    };
  };

  const removeSubUnit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subUnits: prev.subUnits.filter((_, i) => i !== index),
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      realOwnerId,
      regionId: 0,
      cityId: 0,
      neighborhoodId: 0,
      listingTypeId: 0,
      subUnits: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = cleanFormData(formData);
    onSubmit(cleanedData);

    // Reset form after submission (only for create, not edit)
    if (!property) {
      resetForm();
    }
  };

  if (!isOpen) return null;

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
              {property ? t("common.edit") : t("common.add")}{" "}
              {t("properties.title")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`flex flex-col ${
                  isRTL ? "items-end" : "items-start"
                }`}
              >
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("properties.title")}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div
                className={`flex flex-col ${
                  isRTL ? "items-end" : "items-start"
                }`}
              >
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("properties.description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("properties.locationDetails")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`flex flex-col ${
                    isRTL ? "items-end" : "items-start"
                  }`}
                >
                  <label
                    className={`block text-sm font-medium text-gray-600 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("properties.region")}
                  </label>
                  <select
                    value={formData.regionId}
                    onChange={(e) => {
                      handleInputChange("regionId", parseInt(e.target.value));
                      handleInputChange("cityId", 0);
                      handleInputChange("neighborhoodId", 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoadingLookups}
                  >
                    <option value={0}>{t("common.select")}</option>
                    {lookupData?.regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {isRTL ? region.nameAr : region.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={`flex flex-col ${
                    isRTL ? "items-end" : "items-start"
                  }`}
                >
                  <label
                    className={`block text-sm font-medium text-gray-600 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("properties.city")}
                  </label>
                  <select
                    value={formData.cityId}
                    onChange={(e) => {
                      handleInputChange("cityId", parseInt(e.target.value));
                      handleInputChange("neighborhoodId", 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!formData.regionId || filteredCities.length === 0}
                  >
                    <option value={0}>{t("common.select")}</option>
                    {filteredCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {isRTL ? city.nameAr : city.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={`flex flex-col ${
                    isRTL ? "items-end" : "items-start"
                  }`}
                >
                  <label
                    className={`block text-sm font-medium text-gray-600 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("properties.neighborhood")}
                  </label>
                  <select
                    value={formData.neighborhoodId}
                    onChange={(e) =>
                      handleInputChange(
                        "neighborhoodId",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={
                      !formData.cityId || filteredNeighborhoods.length === 0
                    }
                  >
                    <option value={0}>{t("common.select")}</option>
                    {filteredNeighborhoods.map((neighborhood) => (
                      <option key={neighborhood.id} value={neighborhood.id}>
                        {isRTL ? neighborhood.nameAr : neighborhood.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Listing Type */}
            <div
              className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}
            >
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("properties.listingType")}
              </label>
              <select
                value={formData.listingTypeId}
                onChange={(e) =>
                  handleInputChange("listingTypeId", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoadingLookups}
              >
                <option value={0}>{t("common.select")}</option>
                {lookupData?.listingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {isRTL ? type.nameAr : type.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Units */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div
                className={`flex items-center justify-between mb-4 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <h3 className="font-semibold text-gray-900">
                  {t("properties.subUnits")}
                </h3>
                <Button
                  type="button"
                  onClick={addSubUnit}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  {t("properties.addUnit")}
                </Button>
              </div>

              {formData.subUnits.map((unit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200 mb-4"
                >
                  <div
                    className={`flex items-center justify-between mb-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">
                      {t("properties.unit")} {index + 1}
                    </h4>
                    <Button
                      type="button"
                      onClick={() => removeSubUnit(index)}
                      className="text-red-600 hover:text-red-700"
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.propertyType")}
                      </label>
                      <select
                        value={unit.propertyTypeId}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "propertyTypeId",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={isLoadingLookups}
                      >
                        <option value={0}>{t("common.select")}</option>
                        {lookupData?.propertyTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {isRTL ? type.nameAr : type.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.paymentType")}
                      </label>
                      <select
                        value={unit.paymentType}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "paymentType",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">{t("common.select")}</option>
                        <option value="MONTHLY">
                          {t("properties.monthly")}
                        </option>
                        <option value="YEARLY">{t("properties.yearly")}</option>
                      </select>
                    </div>

                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.price")}
                      </label>
                      <input
                        type="number"
                        value={unit.price || ""}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.paidAmount")}
                      </label>
                      <input
                        type="number"
                        value={
                          unit.paidAmount === 0 ? 0 : unit.paidAmount || ""
                        }
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "paidAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.paymentValue")}
                      </label>
                      <input
                        type="number"
                        value={unit.paymentValue || ""}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "paymentValue",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.tenantName")}
                      </label>
                      <input
                        type="text"
                        value={unit.tenantName || ""}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "tenantName",
                            e.target.value || null
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t("properties.tenantNamePlaceholder")}
                      />
                    </div>

                    <div
                      className={`flex flex-col ${
                        isRTL ? "items-end" : "items-start"
                      }`}
                    >
                      <label
                        className={`block text-sm font-medium text-gray-600 mb-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("properties.tenantPhoneNumber")}
                      </label>
                      <input
                        type="tel"
                        value={unit.tenantPhoneNumber || ""}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "tenantPhoneNumber",
                            e.target.value || null
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t(
                          "properties.tenantPhoneNumberPlaceholder"
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isLoadingLookups}
                className="flex items-center gap-2"
              >
                {isLoading
                  ? t("common.saving")
                  : property
                  ? t("common.update")
                  : t("common.create")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

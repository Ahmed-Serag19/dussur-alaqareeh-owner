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
}

export const RealOwnerPropertyFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  property,
  isLoading = false,
  realOwnerId,
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
        realOwnerId: property.realOwnerId || realOwnerId,
        regionId: property.regionId,
        cityId: property.cityId,
        neighborhoodId: property.neighborhoodId,
        listingTypeId: property.listingTypeId,
        subUnits: property.subUnits.map((unit) => ({
          propertyTypeId: unit.propertyTypeId,
          paymentType: unit.paymentType,
          customPaymentDays: unit.customPaymentDays || 0,
          paymentValue: unit.paymentValue || 0,
          price: unit.price || 0,
          paidAmount: unit.paidAmount || 0,
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubUnitChange = (index: number, field: string, value: any) => {
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
          customPaymentDays: 0,
          paymentValue: 0,
          price: 0,
          paidAmount: 0,
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
        customPaymentDays: unit.customPaymentDays || 0,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = cleanFormData(formData);
    onSubmit(cleanedData);
  };

  const getLookupName = (items: any[], id: number) => {
    const item = items.find((item) => item.id === id);
    if (!item) return `ID: ${id}`;
    return isRTL ? item.nameAr : item.nameEn;
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("properties.title")} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("properties.description")} *
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
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t("properties.region")} *
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
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t("properties.city")} *
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
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t("properties.neighborhood")} *
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("properties.listingType")} *
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
              <div className="flex items-center justify-between mb-4">
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
                  <div className="flex items-center justify-between mb-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t("properties.propertyType")} *
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

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t("properties.paymentType")} *
                      </label>
                      <input
                        type="text"
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
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t("properties.price")} *
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

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t("properties.paidAmount")}
                      </label>
                      <input
                        type="number"
                        value={unit.paidAmount || ""}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t("properties.customPaymentDays")}
                      </label>
                      <input
                        type="number"
                        value={unit.customPaymentDays || ""}
                        onChange={(e) =>
                          handleSubUnitChange(
                            index,
                            "customPaymentDays",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
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

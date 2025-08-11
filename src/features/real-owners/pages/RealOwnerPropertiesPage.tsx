import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Home } from "lucide-react";
import { RealOwnerPropertyCard } from "../components/RealOwnerPropertyCard";
import { RealOwnerPropertyModal } from "../components/RealOwnerPropertyModal";
import { RealOwnerPropertyFormModal } from "../components/RealOwnerPropertyFormModal";
import { useRealOwnerProperties } from "../hooks/useRealOwnerProperties";
import { useRealOwnersData } from "../hooks/useRealOwnersData";
import { Button } from "@/components/ui/button";
import useLanguage from "@/hooks/useLanguage";
import type {
  RealOwnerProperty,
  CreatePropertyForRealOwnerRequest,
} from "../types/real-owner-response.types";

const RealOwnerPropertiesPage = () => {
  const { realOwnerId } = useParams<{ realOwnerId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedProperty, setSelectedProperty] =
    useState<RealOwnerProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] =
    useState<RealOwnerProperty | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmProperty, setDeleteConfirmProperty] =
    useState<RealOwnerProperty | null>(null);

  const {
    properties,
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRealOwnerProperties(realOwnerId ? parseInt(realOwnerId) : undefined);
  const { realOwners } = useRealOwnersData();

  const realOwner = realOwners.find(
    (ro) => ro.id === parseInt(realOwnerId || "0")
  );

  const handleBack = () => {
    // Go back one step in browser history, or fallback to real owners list
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/real-owners");
    }
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsFormModalOpen(true);
  };

  const handleEditProperty = (property: RealOwnerProperty) => {
    setEditingProperty(property);
    setIsFormModalOpen(true);
  };

  const handleViewProperty = (property: RealOwnerProperty) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = (property: RealOwnerProperty) => {
    setDeleteConfirmProperty(property);
  };

  const confirmDeleteProperty = () => {
    if (deleteConfirmProperty) {
      deleteProperty(deleteConfirmProperty.id).catch((error) => {
        console.error("Failed to delete property:", error);
      });
      setDeleteConfirmProperty(null);
    }
  };

  const cancelDeleteProperty = () => {
    setDeleteConfirmProperty(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProperty(null);
    setFormError(null);
  };

  const handleFormSubmit = (data: CreatePropertyForRealOwnerRequest) => {
    console.log("Form submitted with data:", data);
    setFormError(null);

    // Validate the data before submission
    const validationErrors = [];

    // Log the data being submitted for debugging
    console.log("Submitting property data:", {
      title: data.title,
      description: data.description,
      regionId: data.regionId,
      cityId: data.cityId,
      neighborhoodId: data.neighborhoodId,
      listingTypeId: data.listingTypeId,
      subUnitsCount: data.subUnits.length,
      realOwnerId: data.realOwnerId,
    });

    if (!data.title || data.title.trim() === "") {
      validationErrors.push("Property title is required");
    }

    if (!data.description || data.description.trim() === "") {
      validationErrors.push("Property description is required");
    }

    if (!data.regionId || data.regionId === 0) {
      validationErrors.push("Region is required");
    }

    if (!data.cityId || data.cityId === 0) {
      validationErrors.push("City is required");
    }

    if (!data.neighborhoodId || data.neighborhoodId === 0) {
      validationErrors.push("Neighborhood is required");
    }

    if (!data.listingTypeId || data.listingTypeId === 0) {
      validationErrors.push("Listing type is required");
    }

    if (data.subUnits.length === 0) {
      validationErrors.push("At least one sub-unit is required");
    }

    // Validate sub-units
    data.subUnits.forEach((unit, index) => {
      if (!unit.propertyTypeId || unit.propertyTypeId === 0) {
        validationErrors.push(
          `Sub-unit ${index + 1}: Property type is required`
        );
      }
      if (!unit.paymentType || unit.paymentType === "") {
        validationErrors.push(
          `Sub-unit ${index + 1}: Payment type is required`
        );
      }
      if (!unit.price || unit.price <= 0) {
        validationErrors.push(
          `Sub-unit ${index + 1}: Price must be greater than 0`
        );
      }
    });

    if (validationErrors.length > 0) {
      setFormError(validationErrors.join(", "));
      return;
    }

    if (editingProperty) {
      updateProperty(editingProperty.id, data)
        .then(() => handleCloseFormModal())
        .catch((error) => {
          console.log("Update property error:", error);
          setFormError(error.message || "Failed to update property");
        });
    } else {
      createProperty(data)
        .then(() => handleCloseFormModal())
        .catch((error) => {
          console.log("Create property error:", error);
          setFormError(error.message || "Failed to create property");
        });
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Home className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("realOwners.properties")} -{" "}
              {realOwner?.fullName || t("common.loading")}
            </h1>
            <p className="text-gray-600">
              {t("realOwners.propertiesSubtitle")}
            </p>
          </div>
        </div>

        <Button onClick={handleAddProperty} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t("properties.addNew")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl justify-center items-center mx-auto">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {properties.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("properties.total")}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {properties.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("properties.active")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {t("properties.noProperties")}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <RealOwnerPropertyCard
              key={property.id || `property-${index}`}
              property={property}
              onView={handleViewProperty}
              onEdit={handleEditProperty}
              onDelete={() => handleDeleteProperty(property)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Property Modal */}
      <RealOwnerPropertyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
      />

      {/* Property Form Modal */}
      <RealOwnerPropertyFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        property={editingProperty}
        isLoading={isCreating || isUpdating}
        realOwnerId={parseInt(realOwnerId || "0")}
        error={formError}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 transition-opacity"
              onClick={cancelDeleteProperty}
            />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("common.confirmDelete")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("properties.deleteConfirm", {
                    title: deleteConfirmProperty.title,
                  })}
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={cancelDeleteProperty}
                    variant="outline"
                    disabled={isDeleting}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    onClick={confirmDeleteProperty}
                    variant="destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? t("common.deleting") : t("common.delete")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealOwnerPropertiesPage;

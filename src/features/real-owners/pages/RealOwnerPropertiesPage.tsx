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
import type { RealOwnerProperty } from "../types/real-owner-response.types";

const RealOwnerPropertiesPage = () => {
  const { realOwnerId } = useParams<{ realOwnerId: string }>();
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<RealOwnerProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] =
    useState<RealOwnerProperty | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

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
    navigate("/real-owners");
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

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      await deleteProperty(propertyId);
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProperty(null);
  };

  const handleFormSubmit = async (data: CreatePropertyForRealOwnerRequest) => {
    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, data);
      } else {
        await createProperty(data);
      }
      handleCloseFormModal();
    } catch (error) {
      console.error("Failed to save property:", error);
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
      <div
        className={`flex items-center justify-between flex-col gap-4 ${
          isRTL ? "sm:flex-row-reverse" : ""
        }`}
      >
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
          {properties.map((property) => (
            <RealOwnerPropertyCard
              key={property.id}
              property={property}
              onView={handleViewProperty}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
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
      />
    </div>
  );
};

export default RealOwnerPropertiesPage;

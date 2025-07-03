import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { PropertyList } from "../components/PropertyList";
import { PropertyStatusTabs } from "../components/PropertyStatusTabs";
import { PropertyViewModal } from "../components/PropertyViewModal/PropertyViewModal";
import { usePropertiesData } from "../hooks/usePropertiesData";
import type {
  Property,
  PropertyStatus,
} from "../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-hot-toast";

export const PropertiesPage = () => {
  const { isRTL, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as PropertyStatus | "ALL" | null;
  const [activeTab, setActiveTab] = useState<PropertyStatus | "ALL">(
    tabFromUrl || "ALL"
  );
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    property: Property | null;
  }>({
    isOpen: false,
    property: null,
  });

  const {
    isLoading,
    error,
    refetch,
    getPropertiesByStatus,
    getCounts,
    approveProperty,
    rejectProperty,
    deleteProperty,
    isApprovingProperty,
    isRejectingProperty,
    isDeletingProperty,
  } = usePropertiesData();

  // Update active tab when URL changes
  useEffect(() => {
    if (
      tabFromUrl &&
      ["ALL", "PENDING", "APPROVED", "REJECTED"].includes(tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleViewProperty = (property: Property) => {
    setViewModal({
      isOpen: true,
      property,
    });
  };

  const handleApproveProperty = (property: Property) => {
    approveProperty(property.id);
    setViewModal({ isOpen: false, property: null });
  };

  const handleRejectProperty = (property: Property) => {
    rejectProperty(property.id);
    setViewModal({ isOpen: false, property: null });
  };

  const handleDeleteProperty = (property: Property) => {
    deleteProperty(property); // Pass the full property object
    setViewModal({ isOpen: false, property: null });
  };

  const handleRefresh = () => {
    refetch();
    toast.success(t("properties.list.refreshSuccess"));
  };

  const handleTabChange = (tab: string) => {
    const newTab = tab as PropertyStatus | "ALL";
    setActiveTab(newTab);

    // Update URL without page reload
    const newSearchParams = new URLSearchParams(searchParams);
    if (newTab === "ALL") {
      newSearchParams.delete("tab");
    } else {
      newSearchParams.set("tab", newTab);
    }
    setSearchParams(newSearchParams);
  };

  const handleCloseViewModal = () => {
    setViewModal({
      isOpen: false,
      property: null,
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("properties.list.title")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("properties.list.subtitle")}
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("properties.list.errorTitle")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("properties.list.errorMessage")}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const currentProperties = getPropertiesByStatus(activeTab);
  const counts = getCounts();

  return (
    <>
      <div className="space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("properties.list.title")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("properties.list.subtitle")}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {t("common.refresh")}
          </button>
        </div>

        <PropertyStatusTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
        >
          <PropertyList
            properties={currentProperties}
            isLoading={isLoading}
            onViewProperty={handleViewProperty}
            onApproveProperty={handleApproveProperty}
            onRejectProperty={handleRejectProperty}
            onDeleteProperty={handleDeleteProperty}
            isApprovingProperty={isApprovingProperty}
            isRejectingProperty={isRejectingProperty}
            isDeletingProperty={isDeletingProperty}
          />
        </PropertyStatusTabs>
      </div>

      <PropertyViewModal
        property={viewModal.property}
        isOpen={viewModal.isOpen}
        onClose={handleCloseViewModal}
        onApprove={handleApproveProperty}
        onReject={handleRejectProperty}
        onDelete={handleDeleteProperty}
        isApproving={isApprovingProperty}
        isRejecting={isRejectingProperty}
        isDeleting={isDeletingProperty}
      />
    </>
  );
};

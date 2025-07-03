import { PropertyCard } from "./PropertyCard";
import type { Property } from "../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  onViewProperty: (property: Property) => void;
  onApproveProperty?: (property: Property) => void;
  onRejectProperty?: (property: Property) => void;
  onDeleteProperty?: (property: Property) => void;
  isApprovingProperty?: boolean;
  isRejectingProperty?: boolean;
  isDeletingProperty?: boolean;
}

export const PropertyList = ({
  properties,
  isLoading,
  onViewProperty,
  onApproveProperty,
  onRejectProperty,
  onDeleteProperty,
  isApprovingProperty,
  isRejectingProperty,
  isDeletingProperty,
}: PropertyListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("properties.list.noProperties")}
        </h3>
        <p className="text-gray-600">{t("properties.list.noPropertiesDesc")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onView={onViewProperty}
          onApprove={onApproveProperty}
          onReject={onRejectProperty}
          onDelete={onDeleteProperty}
          isApproving={isApprovingProperty}
          isRejecting={isRejectingProperty}
          isDeleting={isDeletingProperty}
        />
      ))}
    </div>
  );
};

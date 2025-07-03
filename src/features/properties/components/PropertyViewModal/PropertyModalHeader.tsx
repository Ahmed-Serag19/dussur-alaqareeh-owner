import { X, User } from "lucide-react";
import type { Property } from "../../types/property-response.types";
import { PropertyStatusBadge } from "../PropertyStatusBadge";
import useLanguage from "@/hooks/useLanguage";

interface PropertyModalHeaderProps {
  property: Property;
  onClose: () => void;
}

export const PropertyModalHeader = ({
  property,
  onClose,
}: PropertyModalHeaderProps) => {
  const { isRTL, t } = useLanguage();

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
      <div
        className={`flex items-start justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {property.title}
          </h2>
          <div
            className={`flex items-center gap-3 mb-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <PropertyStatusBadge status={property.status} />
            {property.adminEmail && (
              <div
                className={`flex items-center gap-1 text-sm text-gray-600 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <User className="h-4 w-4" />
                <span>{property.adminEmail}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

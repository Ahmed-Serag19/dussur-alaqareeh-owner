import { useState } from "react";
import {
  MapPin,
  Home,
  Ruler,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Tag,
} from "lucide-react";
import type { Property } from "../types/property-response.types";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useLookupData } from "../hooks/useLookupData";
import useLanguage from "@/hooks/useLanguage";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

interface PropertyCardProps {
  property: Property;
  onView: (property: Property) => void;
  onApprove?: (property: Property) => void;
  onReject?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isDeleting?: boolean;
}

export const PropertyCard = ({
  property,
  onView,
  onApprove,
  onReject,
  onDelete,
  isApproving,
  isRejecting,
  isDeleting,
}: PropertyCardProps) => {
  const { isRTL, t } = useLanguage();
  const { getListingTypeName } = useLookupData();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "delete" | null;
  }>({
    isOpen: false,
    type: null,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US").format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLocationString = () => {
    return `${
      property.streetAr || property.streetEn || t("common.notSpecified")
    }`;
  };

  const listingTypeName = getListingTypeName(property.listingTypeId);

  const handleApproveClick = () => {
    setConfirmModal({ isOpen: true, type: "approve" });
  };

  const handleRejectClick = () => {
    setConfirmModal({ isOpen: true, type: "reject" });
  };

  const handleDeleteClick = () => {
    setConfirmModal({ isOpen: true, type: "delete" });
  };

  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case "approve":
        onApprove?.(property);
        break;
      case "reject":
        onReject?.(property);
        break;
      case "delete":
        onDelete?.(property);
        break;
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  const handleCloseModal = () => {
    setConfirmModal({ isOpen: false, type: null });
  };

  const getConfirmationContent = () => {
    switch (confirmModal.type) {
      case "approve":
        return {
          title: t("properties.confirmModal.approveTitle"),
          message: t("properties.confirmModal.approveMessage", {
            title: property.title,
          }),
        };
      case "reject":
        return {
          title: t("properties.confirmModal.rejectTitle"),
          message: t("properties.confirmModal.rejectMessage", {
            title: property.title,
          }),
        };
      case "delete":
        return {
          title: t("properties.confirmModal.deleteTitle"),
          message: t("properties.confirmModal.deleteMessage", {
            title: property.title,
          }),
        };
      default:
        return {
          title: "",
          message: "",
        };
    }
  };

  const confirmationContent = getConfirmationContent();
  const isCurrentActionLoading =
    (confirmModal.type === "approve" && isApproving) ||
    (confirmModal.type === "reject" && isRejecting) ||
    (confirmModal.type === "delete" && isDeleting);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Image Carousel */}
        <ImageCarousel
          images={property.imageUrls || []}
          altPrefix={property.title}
          className="w-full"
        />
        {/* Header */}
        <div className="p-6 pb-4">
          <div
            className={`flex items-start justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-2 z-50">
                {property.title}
              </h3>
              <div
                className={`flex items-center gap-1 text-gray-600 mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{getLocationString()}</span>
              </div>
              {property.adminEmail && (
                <div
                  className={`flex items-center gap-1 text-gray-500 mb-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <User className="h-3 w-3" />
                  <span className="text-xs">{property.adminEmail}</span>
                </div>
              )}
              {/* Listing Type (Rent/Sell) */}
              {listingTypeName && (
                <div
                  className={`flex items-center gap-1 text-blue-600 mb-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Tag className="h-3 w-3" />
                  <span className="text-xs font-medium">{listingTypeName}</span>
                </div>
              )}
              <PropertyStatusBadge status={property.status} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <div className="space-y-4">
            {/* Price */}
            <div
              className={`text-center py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg`}
            >
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(property.price)} {isRTL ? "ريال" : "SAR"}
              </span>
            </div>

            {/* Property Details */}
            <div
              className={`grid grid-cols-2 gap-3 text-sm ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Ruler className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {property.area} {isRTL ? "م²" : "sqm"}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {property.roomsCount} {isRTL ? "غرف" : "rooms"}
                </span>
              </div>
            </div>

            {/* Description */}
            {(property.descriptionAr || property.descriptionEn) && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {isRTL ? property.descriptionAr : property.descriptionEn}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          {/* Date */}
          <div
            className={`flex items-center gap-1 text-xs text-gray-500 mb-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span>{formatDate(property.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(property)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <Eye className="h-3 w-3" />
              {t("properties.actions.view")}
            </button>

            {property.status === "PENDING" && onApprove && onReject && (
              <>
                <button
                  onClick={handleApproveClick}
                  disabled={isApproving}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  {isApproving ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  {t("properties.actions.approve")}
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={isRejecting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  {isRejecting ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {t("properties.actions.reject")}
                </button>
              </>
            )}

            {onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
              >
                {isDeleting ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        type={confirmModal.type!}
        title={confirmationContent.title}
        message={confirmationContent.message}
        isLoading={isCurrentActionLoading}
      />
    </>
  );
};

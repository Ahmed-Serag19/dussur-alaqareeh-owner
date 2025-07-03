import { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  Home,
  Ruler,
  Calendar,
} from "lucide-react";
import type { Property } from "../types/property-response.types";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import useLanguage from "@/hooks/useLanguage";

interface PropertyViewModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (property: Property) => void;
  onReject?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isDeleting?: boolean;
}

export const PropertyViewModal = ({
  property,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDelete,
  isApproving,
  isRejecting,
  isDeleting,
}: PropertyViewModalProps) => {
  const { isRTL, t } = useLanguage();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "delete" | null;
  }>({
    isOpen: false,
    type: null,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US").format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const handleCloseConfirmModal = () => {
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
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
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
                    className={`flex items-center gap-2 mb-3 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <PropertyStatusBadge status={property.status} />
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

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Price Section */}
              <div className="text-center py-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="text-4xl font-bold text-green-600">
                  {formatPrice(property.price)} {isRTL ? "ريال سعودي" : "SAR"}
                </div>
              </div>

              {/* General Information */}
              <div className="space-y-4">
                <h3
                  className={`text-lg font-semibold flex items-center gap-2 ${
                    isRTL ? "justify-end" : ""
                  }`}
                >
                  <Home className="h-5 w-5" />
                  {t("properties.viewModal.generalInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.title")}
                    </label>
                    <p className="text-gray-900">{property.title}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.area")}
                    </label>
                    <p
                      className={`text-gray-900 flex items-center gap-1 ${
                        isRTL ? "justify-end" : ""
                      }`}
                    >
                      {property.area} {isRTL ? "متر مربع" : "sqm"}
                      <Ruler className="h-4 w-4" />
                    </p>
                  </div>
                  {property.descriptionAr && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        {t("properties.descriptionAr")}
                      </label>
                      <p className="text-gray-900 leading-relaxed">
                        {property.descriptionAr}
                      </p>
                    </div>
                  )}
                  {property.descriptionEn && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        {t("properties.descriptionEn")}
                      </label>
                      <p className="text-gray-900 leading-relaxed">
                        {property.descriptionEn}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Specifications */}
              <div className="space-y-4">
                <h3
                  className={`text-lg font-semibold flex items-center gap-2 ${
                    isRTL ? "justify-end" : ""
                  }`}
                >
                  <Home className="h-5 w-5" />
                  {t("properties.viewModal.propertySpecs")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.roomsCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("properties.roomsCount")}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.bathroomsCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("properties.bathroomsCount")}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.livingroomsCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("properties.livingroomsCount")}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.floorsCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("properties.floorsCount")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h3
                  className={`text-lg font-semibold flex items-center gap-2 ${
                    isRTL ? "justify-end" : ""
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                  {t("properties.viewModal.locationDetails")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.streetAr")}
                    </label>
                    <p className="text-gray-900">
                      {property.streetAr || t("common.notSpecified")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.streetEn")}
                    </label>
                    <p className="text-gray-900">
                      {property.streetEn || t("common.notSpecified")}
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.viewModal.coordinates")}
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {property.latitude.toFixed(6)},{" "}
                      {property.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="space-y-4">
                <h3
                  className={`text-lg font-semibold flex items-center gap-2 ${
                    isRTL ? "justify-end" : ""
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  {t("properties.systemInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.viewModal.propertyId")}
                    </label>
                    <p className="text-gray-900 font-mono">{property.id}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.viewModal.adminId")}
                    </label>
                    <p className="text-gray-900 font-mono">
                      {property.adminId || t("common.notAssigned")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.viewModal.createdAt")}
                    </label>
                    <p className="text-gray-900">
                      {formatDate(property.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t("properties.viewModal.updatedAt")}
                    </label>
                    <p className="text-gray-900">
                      {formatDate(property.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            {(property.status === "PENDING" || onDelete) && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                <div className="flex items-center gap-3">
                  {property.status === "PENDING" && onApprove && onReject && (
                    <>
                      <button
                        onClick={handleApproveClick}
                        disabled={isApproving}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        {isApproving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        {t("properties.actions.approve")}
                      </button>
                      <button
                        onClick={handleRejectClick}
                        disabled={isRejecting}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        {isRejecting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {t("properties.actions.reject")}
                      </button>
                    </>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {t("properties.actions.delete")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        type={confirmModal.type!}
        title={confirmationContent.title}
        message={confirmationContent.message}
        isLoading={isCurrentActionLoading}
      />
    </>
  );
};

import { useState } from "react";
import {
  User,
  Phone,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import type { RealOwner } from "../types/real-owner-response.types";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import useLanguage from "@/hooks/useLanguage";

interface RealOwnerCardProps {
  realOwner: RealOwner;
  onView: (realOwner: RealOwner) => void;
  onEdit?: (realOwner: RealOwner) => void;
  onDelete?: (realOwner: RealOwner) => void;
  isDeleting?: boolean;
}

export const RealOwnerCard = ({
  realOwner,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
}: RealOwnerCardProps) => {
  const { isRTL, t } = useLanguage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    onDelete?.(realOwner);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return t("common.notSpecified");
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to display field value or "Not available" for "string"
  const displayValue = (value: string | null | undefined) => {
    if (!value || value === "string") {
      return isRTL ? "غير متاح" : "Not available";
    }
    return value;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden min-h-[400px] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4">
          <div
            className={`flex items-start justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-2">
                {displayValue(realOwner.fullName)}
              </h3>
              <div
                className={`flex items-center gap-1 text-gray-600 mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm">
                  {displayValue(realOwner.nationalId)}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-gray-500 mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Phone className="h-3 w-3" />
                <span className="text-xs">
                  {displayValue(realOwner.phoneNumber)}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-blue-600 mb-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <CreditCard className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {displayValue(realOwner.accountBank)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 flex-1">
          <div className="space-y-4">
            {/* IBAN Image */}
            {realOwner.ibanImageUrl && realOwner.ibanImageUrl !== "string" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.ibanImage")}
                </label>
                <div className="relative">
                  <img
                    src={realOwner.ibanImageUrl}
                    alt="IBAN"
                    className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* IBAN */}
            <div
              className={`text-center py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg`}
            >
              <span className="text-sm font-medium text-gray-700">
                {t("realOwners.iban")}: {displayValue(realOwner.iban)}
              </span>
            </div>

            {/* Created Date */}
            <div
              className={`flex items-center gap-2 text-sm text-gray-500 ${
                isRTL ? "flex-row-reverse justify-end" : ""
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>
                {t("realOwners.createdAt")}: {formatDate(realOwner.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
          <div
            className={`flex flex-wrap gap-2 justify-center sm:justify-start ${
              isRTL ? "sm:justify-end" : ""
            }`}
          >
            <button
              onClick={() => onView(realOwner)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium min-w-[80px]"
            >
              <Eye className="h-4 w-4" />
              <span>{t("common.view")}</span>
            </button>

            {onEdit && (
              <button
                onClick={() => onEdit(realOwner)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 text-sm font-medium min-w-[80px]"
              >
                <Edit className="h-4 w-4" />
                <span>{t("common.edit")}</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm font-medium min-w-[80px]"
              >
                <Trash2 className="h-4 w-4" />
                <span>
                  {isDeleting ? t("common.deleting") : t("common.delete")}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        type="delete"
        title={t("realOwners.deleteTitle")}
        message={t("realOwners.deleteMessage", {
          name: displayValue(realOwner.fullName),
        })}
        isLoading={isDeleting}
      />
    </>
  );
};

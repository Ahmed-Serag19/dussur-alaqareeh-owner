import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import type { Admin } from "../types/admin-response.types";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminConfirmationModal } from "@/components/ui/AdminConfirmationModal";
import useLanguage from "@/hooks/useLanguage";

interface AdminCardProps {
  admin: Admin;
  onToggleStatus: (adminId: number) => void;
  onDelete?: (adminId: number) => void;
  isToggling: boolean;
  isDeleting?: boolean;
}

export const AdminCard = ({
  admin,
  onToggleStatus,
  onDelete,
  isToggling,
  isDeleting,
}: AdminCardProps) => {
  const { isRTL, t } = useLanguage();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "toggle" | "delete" | null;
  }>({
    isOpen: false,
    type: null,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleClick = () => {
    setConfirmModal({ isOpen: true, type: "toggle" });
  };

  const handleDeleteClick = () => {
    setConfirmModal({ isOpen: true, type: "delete" });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "toggle") {
      onToggleStatus(admin.id);
    } else if (confirmModal.type === "delete") {
      onDelete?.(admin.id);
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  const handleCloseModal = () => {
    setConfirmModal({ isOpen: false, type: null });
  };


  const isCurrentActionLoading =
    (confirmModal.type === "toggle" && isToggling) ||
    (confirmModal.type === "delete" && isDeleting);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-sm mx-auto hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 pb-3">
          <div
            className={`flex items-start justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              <div
                className={`flex items-center gap-3 mb-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="p-2 sm:p-3 bg-blue-50 rounded-full flex-shrink-0">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                    {admin.name}
                  </h3>
                  <div className="mt-1">
                    <AdminStatusBadge isActive={admin.active} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-5 pb-3">
          <div className="space-y-2 sm:space-y-3">
            {/* Email */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-xs sm:text-sm truncate">
                {admin.email}
              </span>
            </div>

            {/* Phone */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-xs sm:text-sm truncate">
                {admin.phone}
              </span>
            </div>

            {/* Created Date */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-xs sm:text-sm">
                {t("admins.card.joinedOn")} {formatDate(admin.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            {/* Toggle Status Button */}
            <button
              onClick={handleToggleClick}
              disabled={isToggling}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 cursor-pointer sm:gap-2 px-2 sm:px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm",
                admin.active
                  ? "bg-blue-900 hover:bg-blue-950 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
                isToggling && "opacity-50 cursor-not-allowed"
              )}
              title={
                admin.active
                  ? t("admins.actions.deactivate")
                  : t("admins.actions.activate")
              }
            >
              {isToggling ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : admin.active ? (
                <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="hidden xs:inline sm:inline">
                {admin.active
                  ? t("admins.actions.deactivate")
                  : t("admins.actions.activate")}
              </span>
            </button>

            {/* Delete Button - Only for inactive admins */}
            {!admin.active && onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                title={t("admins.actions.delete")}
              >
                {isDeleting ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        type={
          confirmModal.type === "toggle"
            ? admin.active
              ? "deactivate"
              : "activate"
            : "delete"
        }
        adminName={admin.name}
        isLoading={isCurrentActionLoading}
      />
    </>
  );
};

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { Admin } from "../types/admin-response.types";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import useLanguage from "@/hooks/useLanguage";

interface AdminCardProps {
  admin: Admin;
  onToggleStatus: (adminId: number) => void;
  isToggling: boolean;
}

export const AdminCard = ({
  admin,
  onToggleStatus,
  isToggling,
}: AdminCardProps) => {
  const { isRTL, t } = useLanguage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmToggle = () => {
    onToggleStatus(admin.id);
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const getConfirmationContent = () => {
    const action = admin.active
      ? t("admins.actions.deactivate")
      : t("admins.actions.activate");
    return {
      title: t("admins.confirmModal.title", { action }),
      message: t("admins.confirmModal.message", {
        action: action.toLowerCase(),
        name: admin.name,
      }),
    };
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
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
                <div className="p-3 bg-blue-50 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {admin.name}
                  </h3>
                  <AdminStatusBadge isActive={admin.active} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <div className="space-y-3">
            {/* Email */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 text-sm">{admin.email}</span>
            </div>

            {/* Phone */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 text-sm">{admin.phone}</span>
            </div>

            {/* Created Date */}
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 text-sm">
                {t("admins.card.joinedOn")} {formatDate(admin.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-center">
          <button
            onClick={handleToggleClick}
            disabled={isToggling}
            className={cn(
              "w-1/2 flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
              admin.active
                ? "bg-red-500 hover:bg-red-700 text-white"
                : "bg-green-500 hover:bg-green-700 text-white",
              isToggling && "opacity-50 cursor-not-allowed"
            )}
          >
            {isToggling ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : admin.active ? (
              <ToggleLeft className="h-4 w-4" />
            ) : (
              <ToggleRight className="h-4 w-4" />
            )}
            {admin.active
              ? t("admins.actions.deactivate")
              : t("admins.actions.activate")}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmToggle}
        type={admin.active ? "approve" : "approve"}
        title={confirmationContent.title}
        message={confirmationContent.message}
        isLoading={isToggling}
      />
    </>
  );
};

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

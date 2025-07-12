import { X, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";

type AdminConfirmationType = "activate" | "deactivate" | "delete";

interface AdminConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: AdminConfirmationType;
  adminName: string;
  isLoading?: boolean;
}

export const AdminConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  adminName,
  isLoading = false,
}: AdminConfirmationModalProps) => {
  const { t, isRTL } = useLanguage();

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

  if (!isOpen) return null;

  const getTypeConfig = (type: AdminConfirmationType) => {
    switch (type) {
      case "activate":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          confirmButtonColor: "bg-green-600 hover:bg-green-700",
          confirmText: t("admins.actions.activate"),
          title: t("admins.confirmModal.toggleTitle", {
            action: t("admins.actions.activate"),
          }),
          message: t("admins.confirmModal.toggleMessage", {
            action: t("admins.actions.activate").toLowerCase(),
            name: adminName,
          }),
        };
      case "deactivate":
        return {
          icon: XCircle,
          iconColor: "text-orange-600",
          bgColor: "bg-orange-50",
          confirmButtonColor: "bg-orange-600 hover:bg-orange-700",
          confirmText: t("admins.actions.deactivate"),
          title: t("admins.confirmModal.toggleTitle", {
            action: t("admins.actions.deactivate"),
          }),
          message: t("admins.confirmModal.toggleMessage", {
            action: t("admins.actions.deactivate").toLowerCase(),
            name: adminName,
          }),
        };
      case "delete":
        return {
          icon: Trash2,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          confirmButtonColor: "bg-red-600 hover:bg-red-700",
          confirmText: t("admins.actions.delete"),
          title: t("admins.confirmModal.deleteTitle"),
          message: t("admins.confirmModal.deleteMessage", { name: adminName }),
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          confirmButtonColor: "bg-blue-600 hover:bg-blue-700",
          confirmText: t("common.confirm"),
          title: "",
          message: "",
        };
    }
  };

  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0  bg-black/60 bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="p-6 pb-4">
            <div
              className={`flex items-start justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <div
                  className={`flex items-center gap-3 mb-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`p-3 ${config.bgColor} rounded-full`}>
                    <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {config.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p
              className={`text-gray-600 leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {config.message}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 px-3 py-1.5 rounded-md font-medium transition-colors duration-200 text-sm shadow-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 ${config.confirmButtonColor} disabled:opacity-50 text-white px-3 py-1.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-sm`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IconComponent className="h-4 w-4" />
                )}
                {config.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

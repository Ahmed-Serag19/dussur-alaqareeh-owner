import { X, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";

type ConfirmationType = "approve" | "reject" | "delete";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ConfirmationType;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  isLoading = false,
}: ConfirmationModalProps) => {
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

  const getTypeConfig = (type: ConfirmationType) => {
    switch (type) {
      case "approve":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          confirmButtonColor: "bg-green-600 hover:bg-green-700",
          confirmText: t("properties.actions.approve"),
        };
      case "reject":
        return {
          icon: XCircle,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          confirmButtonColor: "bg-red-600 hover:bg-red-700",
          confirmText: t("properties.actions.reject"),
        };
      case "delete":
        return {
          icon: Trash2,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          confirmButtonColor: "bg-red-600 hover:bg-red-700",
          confirmText: t("properties.actions.delete"),
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          confirmButtonColor: "bg-blue-600 hover:bg-blue-700",
          confirmText: t("common.confirm"),
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
                    {title}
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
              {message}
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
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 ${config.confirmButtonColor} disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2`}
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

import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import type { Property } from "../../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface PropertyModalActionsProps {
  property: Property;
  onApprove?: (property: Property) => void;
  onReject?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isDeleting?: boolean;
  onApproveClick: () => void;
  onRejectClick: () => void;
  onDeleteClick: () => void;
}

export const PropertyModalActions = ({
  property,
  onApprove,
  onReject,
  onDelete,
  isApproving,
  isRejecting,
  isDeleting,
  onApproveClick,
  onRejectClick,
  onDeleteClick,
}: PropertyModalActionsProps) => {
  const { t } = useLanguage();

  if (!((property.status === "PENDING" && onApprove && onReject) || onDelete)) {
    return null;
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
      <div className="flex items-center gap-3">
        {property.status === "PENDING" && onApprove && onReject && (
          <>
            <button
              onClick={onApproveClick}
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
              onClick={onRejectClick}
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
            onClick={onDeleteClick}
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
  );
};

import { useState } from "react";
import type { Property } from "../../../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface UsePropertyModalActionsProps {
  property: Property | null;
  onApprove?: (property: Property) => void;
  onReject?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isDeleting?: boolean;
}

export const usePropertyModalActions = ({
  property,
  onApprove,
  onReject,
  onDelete,
  isApproving,
  isRejecting,
  isDeleting,
}: UsePropertyModalActionsProps) => {
  const { t } = useLanguage();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "delete" | null;
  }>({
    isOpen: false,
    type: null,
  });

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
    if (!property) return;

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
    if (!property) return { title: "", message: "" };

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

  const isCurrentActionLoading =
    (confirmModal.type === "approve" && isApproving) ||
    (confirmModal.type === "reject" && isRejecting) ||
    (confirmModal.type === "delete" && isDeleting);

  return {
    confirmModal,
    handleApproveClick,
    handleRejectClick,
    handleDeleteClick,
    handleConfirmAction,
    handleCloseConfirmModal,
    getConfirmationContent,
    isCurrentActionLoading,
  };
};

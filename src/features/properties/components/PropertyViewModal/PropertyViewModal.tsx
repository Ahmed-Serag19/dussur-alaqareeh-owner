import { useEffect } from "react";
import type { Property } from "../../types/property-response.types";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { PropertyModalHeader } from "./PropertyModalHeader";
import { PropertyModalContent } from "./PropertyModalContent";
import { PropertyModalActions } from "./PropertyModalActions";
import { usePropertyModalActions } from "./hooks/usePropertyModalActions";

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
  const {
    confirmModal,
    handleApproveClick,
    handleRejectClick,
    handleDeleteClick,
    handleConfirmAction,
    handleCloseConfirmModal,
    getConfirmationContent,
    isCurrentActionLoading,
  } = usePropertyModalActions({
    property,
    onApprove,
    onReject,
    onDelete,
    isApproving,
    isRejecting,
    isDeleting,
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

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={onClose}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <PropertyModalHeader property={property} onClose={onClose} />

            {/* Content */}
            <PropertyModalContent property={property} />

            {/* Footer Actions */}
            <PropertyModalActions
              property={property}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              isApproving={isApproving}
              isRejecting={isRejecting}
              isDeleting={isDeleting}
              onApproveClick={handleApproveClick}
              onRejectClick={handleRejectClick}
              onDeleteClick={handleDeleteClick}
            />
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

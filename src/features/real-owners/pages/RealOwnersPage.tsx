import { useState } from "react";
import { Plus, Users, X, Building, Clock } from "lucide-react";
import { RealOwnerList } from "../components/RealOwnerList";
import { RealOwnerModal } from "../components/RealOwnerModal";
import { useRealOwnersData } from "../hooks/useRealOwnersData";
import type { RealOwner } from "../types/real-owner-response.types";
import useLanguage from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

const RealOwnersPage = () => {
  const { isRTL, t } = useLanguage();
  const {
    realOwners,
    isLoading,
    deleteRealOwner,
    isDeleting,
    createRealOwner,
    updateRealOwner,
    isCreating,
    isUpdating,
  } = useRealOwnersData();

  const [selectedRealOwner, setSelectedRealOwner] = useState<RealOwner | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Helper function to display field value or "Not available" for "string"
  const displayValue = (value: string | null | undefined) => {
    if (!value || value === "string") {
      return isRTL ? "غير متاح" : "Not available";
    }
    return value;
  };

  const handleView = (realOwner: RealOwner) => {
    setSelectedRealOwner(realOwner);
    setIsViewModalOpen(true);
  };

  const handleEdit = (realOwner: RealOwner) => {
    setSelectedRealOwner(realOwner);
    setIsModalOpen(true);
  };

  const handleDelete = (realOwner: RealOwner) => {
    deleteRealOwner(realOwner.id);
  };

  const handleAdd = () => {
    setSelectedRealOwner(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    if (selectedRealOwner) {
      // Update
      updateRealOwner({ id: selectedRealOwner.id, data });
    } else {
      // Create
      createRealOwner(data);
    }
    setIsModalOpen(false);
    setSelectedRealOwner(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRealOwner(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedRealOwner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between flex-col  gap-4 ${
          isRTL ? "sm:flex-row-reverse" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("realOwners.title")}
            </h1>
            <p className="text-gray-600">{t("realOwners.subtitle")}</p>
          </div>
        </div>

        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t("realOwners.addNew")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 [400px]:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {realOwners.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("realOwners.total")}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {realOwners.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("realOwners.recent")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Owners List */}
      <RealOwnerList
        realOwners={realOwners}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />

      {/* Add/Edit Modal */}
      <RealOwnerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        realOwner={selectedRealOwner}
        isLoading={isCreating || isUpdating}
      />

      {/* View Modal - You can create a separate view modal component if needed */}
      {isViewModalOpen && selectedRealOwner && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 transition-opacity"
              onClick={handleViewModalClose}
            />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("common.view")} {t("realOwners.title")}
                </h2>
                <button
                  onClick={handleViewModalClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("realOwners.form.fullName")}
                    </label>
                    <p className="text-gray-900">
                      {displayValue(selectedRealOwner.fullName)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("realOwners.form.nationalId")}
                    </label>
                    <p className="text-gray-900">
                      {displayValue(selectedRealOwner.nationalId)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("realOwners.form.phoneNumber")}
                    </label>
                    <p className="text-gray-900">
                      {displayValue(selectedRealOwner.phoneNumber)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("realOwners.form.accountBank")}
                    </label>
                    <p className="text-gray-900">
                      {displayValue(selectedRealOwner.accountBank)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("realOwners.form.iban")}
                    </label>
                    <p className="text-gray-900">
                      {displayValue(selectedRealOwner.iban)}
                    </p>
                  </div>
                  {selectedRealOwner.ibanImageUrl && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("realOwners.form.ibanImage")}
                      </label>
                      <img
                        src={selectedRealOwner.ibanImageUrl}
                        alt="IBAN"
                        className="max-w-full h-48 object-contain border rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealOwnersPage;

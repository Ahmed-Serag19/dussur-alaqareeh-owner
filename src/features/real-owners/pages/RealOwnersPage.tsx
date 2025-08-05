import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, X, Clock, Search } from "lucide-react";
import { RealOwnerList } from "../components/RealOwnerList";
import { RealOwnerModal } from "../components/RealOwnerModal";
import { useRealOwnersData } from "../hooks/useRealOwnersData";
import type { RealOwner } from "../types/real-owner-response.types";
import useLanguage from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

const RealOwnersPage = () => {
  const navigate = useNavigate();
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
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to display field value or "Not available" for "string"
  const displayValue = (value: string | null | undefined) => {
    if (!value || value === "string") {
      return isRTL ? "غير متاح" : "Not available";
    }
    return value;
  };

  const handleView = (realOwner: RealOwner) => {
    navigate(`/real-owners/${realOwner.id}/properties`);
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

  const filteredRealOwners = realOwners.filter(
    (realOwner) =>
      realOwner.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      realOwner.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl justify-center items-center mx-auto">
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

      {/* Search */}
      <div className="flex justify-center">
        <div className="max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Real Owners List */}
      <RealOwnerList
        realOwners={filteredRealOwners}
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
    </div>
  );
};

export default RealOwnersPage;

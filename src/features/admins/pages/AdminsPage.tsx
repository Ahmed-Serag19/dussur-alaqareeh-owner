import { useState } from "react";
import { RefreshCw, Users, UserCheck, UserX } from "lucide-react";
import { AdminList } from "../components/AdminList";
import { AdminStatusTabs } from "../components/AdminStatusTabs";
import { useAdminsData } from "../hooks/useAdminsData";
import type { AdminStatus } from "../types/admin-response.types";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-hot-toast";

export const AdminsPage = () => {
  const { isRTL, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminStatus>("ALL");
  const {
    admins,
    isLoading,
    error,
    refetch,
    getAdminsByStatus,
    getCounts,
    toggleAdminStatus,
    deleteAdmin,
    isTogglingStatus,
    isDeletingAdmin,
  } = useAdminsData();

  const handleRefresh = () => {
    refetch();
    toast.success(t("admins.list.refreshSuccess"));
  };

  const handleToggleStatus = (adminId: number) => {
    toggleAdminStatus(adminId);
  };

  const handleDeleteAdmin = (adminId: number) => {
    deleteAdmin(adminId);
  };

  const handleTabChange = (tab: AdminStatus) => {
    setActiveTab(tab);
  };

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admins.list.title")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              {t("admins.list.subtitle")}
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-red-400 text-4xl sm:text-6xl mb-4">⚠️</div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t("admins.list.errorTitle")}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            {t("admins.list.errorMessage")}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <RefreshCw className="h-4 w-4" />
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const currentAdmins = getAdminsByStatus(activeTab);
  const counts = getCounts();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          isRTL ? "sm:flex-row-reverse" : ""
        }`}
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("admins.list.title")}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            {t("admins.list.subtitle")}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {t("common.refresh")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-xl flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div
              className={`${isRTL ? "text-right" : "text-left"} min-w-0 flex-1`}
            >
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {counts.all}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">
                {t("admins.stats.totalAdmins")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-200 rounded-xl flex-shrink-0">
              <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div
              className={`${isRTL ? "text-right" : "text-left"} min-w-0 flex-1`}
            >
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {counts.active}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">
                {t("admins.stats.activeAdmins")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-red-200 rounded-xl flex-shrink-0">
              <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-blue-900" />
            </div>
            <div
              className={`${isRTL ? "text-right" : "text-left"} min-w-0 flex-1`}
            >
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {counts.inactive}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">
                {t("admins.stats.inactiveAdmins")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Admin List */}
      <AdminStatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={counts}
      >
        <AdminList
          admins={currentAdmins}
          isLoading={isLoading}
          onToggleStatus={handleToggleStatus}
          onDelete={activeTab !== "ACTIVE" ? handleDeleteAdmin : undefined}
          isToggling={isTogglingStatus}
          isDeleting={isDeletingAdmin}
        />
      </AdminStatusTabs>
    </div>
  );
};

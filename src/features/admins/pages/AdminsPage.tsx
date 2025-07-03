import { RefreshCw, Users, UserCheck, UserX } from "lucide-react";
import { AdminList } from "../components/AdminList";
import { useAdminsData } from "../hooks/useAdminsData";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-hot-toast";

export const AdminsPage = () => {
  const { isRTL, t } = useLanguage();
  const {
    admins,
    isLoading,
    error,
    refetch,
    getCounts,
    toggleAdminStatus,
    isTogglingStatus,
  } = useAdminsData();

  const handleRefresh = () => {
    refetch();
    toast.success(t("admins.list.refreshSuccess"));
  };

  const handleToggleStatus = (adminId: number) => {
    toggleAdminStatus(adminId);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("admins.list.title")}
            </h1>
            <p className="text-gray-600 mt-2">{t("admins.list.subtitle")}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("admins.list.errorTitle")}
          </h3>
          <p className="text-gray-600 mb-4">{t("admins.list.errorMessage")}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const counts = getCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admins.list.title")}
          </h1>
          <p className="text-gray-600 mt-2">{t("admins.list.subtitle")}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {t("common.refresh")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto sm:mx-0">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className={isRTL ? "text-right flex-1" : "text-left flex-1"}>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              <p className="text-gray-600 text-sm font-medium">
                {t("admins.stats.totalAdmins")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className={isRTL ? "text-right flex-1" : "text-left flex-1"}>
              <p className="text-2xl font-bold text-gray-900">
                {counts.active}
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {t("admins.stats.activeAdmins")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div className={isRTL ? "text-right flex-1" : "text-left flex-1"}>
              <p className="text-2xl font-bold text-gray-900">
                {counts.inactive}
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {t("admins.stats.inactiveAdmins")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin List */}
      <AdminList
        admins={admins}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        isToggling={isTogglingStatus}
      />
    </div>
  );
};

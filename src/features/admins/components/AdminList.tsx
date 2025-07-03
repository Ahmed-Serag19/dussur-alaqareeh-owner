import { AdminCard } from "./AdminCard";
import type { Admin } from "../types/admin-response.types";
import useLanguage from "@/hooks/useLanguage";

interface AdminListProps {
  admins: Admin[];
  isLoading: boolean;
  onToggleStatus: (adminId: number) => void;
  isToggling: boolean;
}

export const AdminList = ({
  admins,
  isLoading,
  onToggleStatus,
  isToggling,
}: AdminListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("admins.list.noAdmins")}
        </h3>
        <p className="text-gray-600">{t("admins.list.noAdminsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {admins.map((admin) => (
        <AdminCard
          key={admin.id}
          admin={admin}
          onToggleStatus={onToggleStatus}
          isToggling={isToggling}
        />
      ))}
    </div>
  );
};

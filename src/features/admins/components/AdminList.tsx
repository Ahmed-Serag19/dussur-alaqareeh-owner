import { AdminCard } from "./AdminCard";
import type { Admin } from "../types/admin-response.types";
import useLanguage from "@/hooks/useLanguage";

interface AdminListProps {
  admins: Admin[];
  isLoading: boolean;
  onToggleStatus: (adminId: number) => void;
  onDelete?: (adminId: number) => void;
  isToggling: boolean;
  isDeleting?: boolean;
}

export const AdminList = ({
  admins,
  isLoading,
  onToggleStatus,
  onDelete,
  isToggling,
  isDeleting,
}: AdminListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 animate-pulse max-w-sm mx-auto w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 mb-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl sm:text-6xl mb-4">👥</div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          {t("admins.list.noAdmins")}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          {t("admins.list.noAdminsDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
      {admins.map((admin) => (
        <AdminCard
          key={admin.id}
          admin={admin}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          isToggling={isToggling}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

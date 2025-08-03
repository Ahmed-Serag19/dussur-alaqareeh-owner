import { RealOwnerCard } from "./RealOwnerCard";
import type { RealOwner } from "../types/real-owner-response.types";
import useLanguage from "@/hooks/useLanguage";

interface RealOwnerListProps {
  realOwners: RealOwner[];
  onView: (realOwner: RealOwner) => void;
  onEdit?: (realOwner: RealOwner) => void;
  onDelete?: (realOwner: RealOwner) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
}

export const RealOwnerList = ({
  realOwners = [],
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
  isLoading = false,
}: RealOwnerListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!realOwners || realOwners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {t("realOwners.noRealOwners")}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {realOwners.map((realOwner) => (
        <RealOwnerCard
          key={realOwner.id}
          realOwner={realOwner}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

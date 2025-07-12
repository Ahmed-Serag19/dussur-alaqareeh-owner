import type React from "react";
import { cn } from "@/lib/utils";
import type { AdminStatus, AdminCounts } from "../types/admin-response.types";
import useLanguage from "@/hooks/useLanguage";

interface AdminStatusTabsProps {
  activeTab: AdminStatus;
  onTabChange: (tab: AdminStatus) => void;
  counts: AdminCounts;
  children: React.ReactNode;
}

export const AdminStatusTabs = ({
  activeTab,
  onTabChange,
  counts,
  children,
}: AdminStatusTabsProps) => {
  const { t, isRTL } = useLanguage();

  const tabs = [
    {
      key: "ALL" as AdminStatus,
      label: t("admins.tabs.all"),
      count: counts.all,
    },
    {
      key: "ACTIVE" as AdminStatus,
      label: t("admins.tabs.active"),
      count: counts.active,
    },
    {
      key: "INACTIVE" as AdminStatus,
      label: t("admins.tabs.inactive"),
      count: counts.inactive,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav
          className={`flex space-x-6 sm:space-x-8 ${
            isRTL ? "flex-row-reverse space-x-reverse" : ""
          } min-w-max`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span
                  className={cn(
                    "inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full",
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
};

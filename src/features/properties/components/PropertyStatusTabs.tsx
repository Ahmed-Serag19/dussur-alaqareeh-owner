import type React from "react";

import { cn } from "@/lib/utils";
import type {
  PropertyStatus,
  PropertyCounts,
} from "../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface PropertyStatusTabsProps {
  activeTab: PropertyStatus | "ALL";
  onTabChange: (tab: string) => void;
  counts: PropertyCounts;
  children: React.ReactNode;
}

export const PropertyStatusTabs = ({
  activeTab,
  onTabChange,
  counts,
  children,
}: PropertyStatusTabsProps) => {
  const { t, isRTL } = useLanguage();

  const tabs = [
    { key: "ALL", label: t("properties.tabs.all"), count: counts.all },
    {
      key: "PENDING",
      label: t("properties.tabs.pending"),
      count: counts.pending,
    },
    {
      key: "APPROVED",
      label: t("properties.tabs.approved"),
      count: counts.approved,
    },
    {
      key: "REJECTED",
      label: t("properties.tabs.rejected"),
      count: counts.rejected,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav
          className={`flex space-x-8 ${
            isRTL ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
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

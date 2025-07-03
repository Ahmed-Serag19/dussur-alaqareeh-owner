import { cn } from "@/lib/utils";
import type { PropertyStatus } from "../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export const PropertyStatusBadge = ({
  status,
  className,
}: PropertyStatusBadgeProps) => {
  const { t } = useLanguage();

  const getStatusConfig = (status: PropertyStatus) => {
    switch (status) {
      case "PENDING":
        return {
          label: t("properties.status.pending"),
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "APPROVED":
        return {
          label: t("properties.status.approved"),
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "REJECTED":
        return {
          label: t("properties.status.rejected"),
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

import { cn } from "@/lib/utils";
import useLanguage from "@/hooks/useLanguage";

interface AdminStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export const AdminStatusBadge = ({
  isActive,
  className,
}: AdminStatusBadgeProps) => {
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        isActive
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-red-100 text-red-800 border-red-200",
        className
      )}
    >
      {isActive ? t("admins.status.active") : t("admins.status.inactive")}
    </span>
  );
};

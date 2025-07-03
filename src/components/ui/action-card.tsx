import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  className?: string;
}

const ActionCard = ({
  title,
  description,
  href,
  icon: Icon,
  gradient,
  className,
}: ActionCardProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
};

export default ActionCard;

import {
  Users,
  FileText,
  List,
  Building,
  TrendingUp,
  Clock,
} from "lucide-react";
import ActionCard from "@/components/ui/action-card";
import useLanguage from "@/hooks/useLanguage";
import { useOwner } from "@/context/OwnerContext";
import { useQuery } from "@tanstack/react-query";
import {
  getOwnerPropertiesPending,
  getOwnerPropertiesApproved,
  getOwnerPropertiesRejected,
} from "@/features/properties/api/properties.api";

const HomePage = () => {
  const { isRTL, t } = useLanguage();
  const { owner } = useOwner();

  // Fetch pending properties
  const { data: pendingProperties = [], isLoading: isLoadingPending } =
    useQuery({
      queryKey: ["owner-properties-pending"],
      queryFn: () => getOwnerPropertiesPending().then((res) => res.data),
    });

  // Fetch approved properties
  const { data: approvedProperties = [], isLoading: isLoadingApproved } =
    useQuery({
      queryKey: ["owner-properties-approved"],
      queryFn: () => getOwnerPropertiesApproved().then((res) => res.data),
    });

  // Fetch rejected properties
  const { data: rejectedProperties = [], isLoading: isLoadingRejected } =
    useQuery({
      queryKey: ["owner-properties-rejected"],
      queryFn: () => getOwnerPropertiesRejected().then((res) => res.data),
    });

  const isLoading = isLoadingPending || isLoadingApproved || isLoadingRejected;

  // Calculate total by summing all status counts
  const totalProperties =
    pendingProperties.length +
    approvedProperties.length +
    rejectedProperties.length;

  const stats = [
    {
      label: t("dashboard.stats.totalProperties"),
      value: isLoading ? "..." : totalProperties.toString(), // Sum of all properties
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: t("dashboard.stats.pendingRequests"),
      value: isLoadingPending ? "..." : pendingProperties.length.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: t("dashboard.stats.approvedRequests"),
      value: isLoadingApproved ? "..." : approvedProperties.length.toString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t("dashboard.stats.rejectedRequests"),
      value: isLoadingRejected ? "..." : rejectedProperties.length.toString(),
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const actions = [
    {
      title: t("dashboard.actions.viewProperties"),
      description: t("dashboard.actions.viewPropertiesDesc"),
      href: "/properties",
      icon: Building,
      gradient: "from-blue-600 to-blue-800",
    },
    {
      title: t("dashboard.actions.customerRequests"),
      description: t("dashboard.actions.customerRequestsDesc"),
      href: "/properties?tab=PENDING",
      icon: FileText,
      gradient: "from-orange-600 to-orange-800",
    },
    {
      title: t("dashboard.actions.requestsList"),
      description: t("dashboard.actions.requestsListDesc"),
      href: "/properties?tab=APPROVED",
      icon: List,
      gradient: "from-green-600 to-green-800",
    },
    {
      title: t("dashboard.actions.rejectedProperties"),
      description: t("dashboard.actions.rejectedPropertiesDesc"),
      href: "/properties?tab=REJECTED",
      icon: Users,
      gradient: "from-red-600 to-red-800",
    },
  ];

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-start">
          {t("dashboard.welcome")} {owner?.name}
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto sm:mx-0 text-center sm:text-start">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto sm:mx-0">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={isRTL ? "text-right flex-1" : "text-left flex-1"}>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center sm:text-start">
          {t("home.quickActions")}
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto sm:mx-0">
          {actions.map((action, index) => (
            <ActionCard
              key={index}
              title={action.title}
              description={action.description}
              href={action.href}
              icon={action.icon}
              gradient={action.gradient}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

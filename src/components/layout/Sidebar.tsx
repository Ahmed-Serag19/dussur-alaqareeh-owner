import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, FileText, List, Building2, LogOut, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import MainLayoutLogo from "@/assets/images/main-layout-logo.png";
import { useSidebar } from "@/context/SidebarContext";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useOwner } from "@/context/OwnerContext";

const Sidebar = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { setOpen } = useSidebar();
  const width = useWindowWidth();
  const { logout } = useOwner();
  const navigate = useNavigate();

  const navigation = [
    {
      name: t("sidebar.home"),
      href: "/",
      icon: Home,
    },
    {
      name: t("sidebar.viewProperties"),
      href: "/properties",
      icon: Building2,
    },

    {
      name: t("sidebar.admins"),
      href: "/admins",
      icon: Users,
    },
  ];

  return (
    <aside
      className={`bg-gray-50 max-h-screen overflow-hidden p-8 flex flex-col gap-8 h-full ${
        isRTL ? "border-l border-gray-300" : "border-r border-gray-300"
      }`}
    >
      <Link to="/">
        <div className="flex justify-center">
          <img
            src={MainLayoutLogo || "/placeholder.svg"}
            alt="Dusser Logo"
            className="h-16 w-auto"
          />
        </div>
      </Link>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => width && width < 768 && setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-100",
                isActive
                  ? "bg-blue-50 text-blue-950 border-blue-950 shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-blue-100",
                isRTL ? "text-right" : "text-left"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
            </NavLink>
          );
        })}

        {/* Logout */}
        <div className="pt-4 border-t border-gray-200 mt-8">
          <button
            onClick={() => logout(navigate)}
            className={cn(
              "w-full justify-center flex items-center cursor-pointer gap-3 px-4 py-4 text-red-600 hover:text-red-700 hover:bg-red-100 transition duration-200 rounded-lg",
              isRTL ? "text-right" : "text-left"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{t("sidebar.logout")}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

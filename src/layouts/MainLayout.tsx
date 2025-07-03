import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebar } from "@/context/SidebarContext";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const { isOpen, setOpen } = useSidebar();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`z-40 bg-white border-gray-200 h-full transition-transform duration-300
          md:static md:flex  md:flex-col w-56 md:w-64 md:translate-x-0
          ${
            isRTL
              ? isOpen
                ? "fixed top-0 right-0 border-l translate-x-0"
                : "fixed top-0 right-0 border-l translate-x-full"
              : isOpen
              ? "fixed top-0 left-0 border-r translate-x-0"
              : "fixed top-0 left-0 border-r -translate-x-full"
          }`}
      >
        <Sidebar />
      </div>

      {/* MAIN COLUMN (NAVBAR + CONTENT) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* NAVBAR always at top in main column */}
        <Navbar />

        {/* MAIN OUTLET - Fixed height and proper scrolling */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;

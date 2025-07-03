import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import LanguageSwitcher from "../LanguageSwitcher";

const Navbar = () => {
  const { toggle, isOpen } = useSidebar();

  return (
    <header className="bg-white shadow-sm border-b h-20 border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between md:justify-end">
        {/* Burger icon */}
        <button
          onClick={toggle}
          className={`md:hidden text-gray-700 cursor-pointer hover:text-gray-900 ${
            isOpen ? "ms-52" : "ms-0"
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

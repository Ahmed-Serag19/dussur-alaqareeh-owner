import { Outlet } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthLogo from "@/assets/images/auth-layout-logo.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen max-h-screen bg-gray-50 flex relative">
      {/* Form Section - RIGHT */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      {/* Logo Section - LEFT */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12 border-r border-gray-200">
        <div className="w-full h-full">
          <img
            src={AuthLogo}
            alt="Dusser Logo"
            className="w-full h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

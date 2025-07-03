import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useToggle from "@/hooks/useToggle";
import useLanguage from "@/hooks/useLanguage";
import useFormValidation from "@/hooks/useFormValidation";
import {
  createLoginSchema,
  type LoginDto,
} from "@/features/auth/types/auth.types";

interface LoginFormProps {
  onSubmit: (data: LoginDto) => void;
  isLoading: boolean;
}

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const { value: showPassword, toggle: togglePassword } = useToggle();
  const { isRTL, t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormValidation(createLoginSchema(t));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {t("auth.login.email")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">
            {typeof errors.email === "object" && errors.email
              ? (errors.email as { message?: string }).message
              : undefined}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          {t("auth.login.password")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.login.passwordPlaceholder")}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register("password")}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">
            {typeof errors.password === "object" && errors.password
              ? (errors.password as { message?: string }).message
              : undefined}
          </p>
        )}
      </div>

      <div
        className={`flex items-center ${
          isRTL ? "justify-start" : "justify-end"
        }`}
      >
        <Link
          to="/auth/forgot-password"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
        >
          {t("auth.login.forgotPassword")}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r cursor-pointer  duration-300 from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition "
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {t("auth.login.loginButton")}
              <ArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default LoginForm;

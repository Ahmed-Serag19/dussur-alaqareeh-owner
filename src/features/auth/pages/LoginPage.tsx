import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Lock } from "lucide-react";
import LoginForm from "@/features/auth/components/LoginForm";
import { handleLogin } from "@/features/auth/api/auth.api";
import type { LoginDto } from "@/features/auth/types/auth.types";
import useLanguage from "@/hooks/useLanguage";
import { useOwner } from "@/context/OwnerContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { t } = useLanguage();
  const { login } = useOwner();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: handleLogin,
    onSuccess: (response) => {
      const token = response.data.token;
      login(token, navigate);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("auth.login.loginError"));
    },
  });

  const handleSubmit = (data: LoginDto) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg">
      <div className="text-center space-y-4 pb-8 p-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {t("auth.login.title")}
        </h1>
        <p className="text-gray-600 text-base">{t("auth.login.description")}</p>
      </div>

      <div className="space-y-6 p-8 pt-0">
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={loginMutation.isPending}
        />
      </div>
    </div>
  );
};

export default LoginPage;

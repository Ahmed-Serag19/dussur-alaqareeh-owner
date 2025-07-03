import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";
import useLanguage from "@/hooks/useLanguage";

interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface OwnerContextType {
  owner: Owner | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
}

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

interface OwnerProviderProps {
  children: ReactNode;
}

export const OwnerProvider = ({ children }: OwnerProviderProps) => {
  const { t } = useLanguage();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("owner_token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<any>(storedToken);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          setToken(storedToken);
          setOwner(decoded);
        } else {
          localStorage.removeItem("owner_token");
        }
      } catch (error) {
        localStorage.removeItem("owner_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, navigate: NavigateFunction) => {
    try {
      const decoded = jwtDecode<any>(newToken);

      if (decoded.role !== "Owner") {
        toast.error(t("auth.login.invalidRole"));
        navigate("/auth/login");
        return;
      }

      localStorage.setItem("owner_token", newToken);
      setToken(newToken);
      setOwner(decoded);
      toast.success(t("auth.login.loginSuccess"));
      navigate("/");
    } catch (error) {
      toast.error(t("auth.login.loginError"));
    }
  };

  const logout = (navigate: NavigateFunction) => {
    localStorage.removeItem("owner_token");
    setToken(null);
    setOwner(null);
    toast.success(t("auth.logout.logoutSuccess"));
    navigate("/auth/login");
  };

  return (
    <OwnerContext.Provider value={{ owner, token, isLoading, login, logout }}>
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (context === undefined) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
};

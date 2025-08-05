import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import HomePage from "@/features/home/pages/HomePage";
import { useOwner } from "@/context/OwnerContext";
import { PropertiesPage } from "@/features/properties/pages/PropertiesPage";
import { AdminsPage } from "@/features/admins/pages/AdminsPage";
import RealOwnersPage from "@/features/real-owners/pages/RealOwnersPage";
import RealOwnerPropertiesPage from "@/features/real-owners/pages/RealOwnerPropertiesPage";

const AppRoutes = () => {
  const { token } = useOwner();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/auth/*"
        element={token ? <Navigate to="/" replace /> : <AuthLayout />}
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="real-owners" element={<RealOwnersPage />} />
        <Route
          path="real-owners/:realOwnerId/properties"
          element={<RealOwnerPropertiesPage />}
        />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

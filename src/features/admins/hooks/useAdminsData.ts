import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAdmins, toggleAdminStatus } from "@/features/admins/api/admin.api";
import type { Admin, AdminCounts } from "../types/admin-response.types";
import useLanguage from "@/hooks/useLanguage";

export const useAdminsData = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch all users and filter only admins
  const {
    data: allUsers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins().then((res) => res.data),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });

  // Filter only admins (role.name === "Admin")
  const admins = allUsers.filter((user) => user.role.name === "Admin");

  // Toggle admin status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: toggleAdminStatus,
    onMutate: async (adminId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admins"] });

      // Snapshot previous value
      const previousAdmins = queryClient.getQueryData<Admin[]>(["admins"]);

      // Optimistically update
      queryClient.setQueryData<Admin[]>(["admins"], (old) => {
        if (!old) return [];
        return old.map((admin) =>
          admin.id === adminId ? { ...admin, active: !admin.active } : admin
        );
      });

      return { previousAdmins };
    },
    onError: (error: any, adminId: number, context) => {
      // Rollback on error
      if (context?.previousAdmins) {
        queryClient.setQueryData(["admins"], context.previousAdmins);
      }

      // Log error for debugging
      console.error(`Failed to toggle status for admin ${adminId}:`, error);

      // Show user-friendly error message
      const errorMessage =
        error?.response?.data?.message || t("admins.actions.toggleError");
      toast.error(errorMessage);
    },
    onSuccess: () => {
      // Invalidate and refetch to get fresh data from server
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success(t("admins.actions.toggleSuccess"));
    },
    onSettled: () => {
      // Always refetch after mutation to ensure data consistency
      queryClient.refetchQueries({ queryKey: ["admins"] });
    },
  });

  const getCounts = (): AdminCounts => {
    const activeAdmins = admins.filter((admin) => admin.active);
    return {
      total: admins.length,
      active: activeAdmins.length,
      inactive: admins.length - activeAdmins.length,
    };
  };

  return {
    admins,
    isLoading,
    error,
    refetch,
    getCounts,
    toggleAdminStatus: toggleStatusMutation.mutate,
    isTogglingStatus: toggleStatusMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRealOwners,
  getRealOwnerById,
  createRealOwner,
  updateRealOwner,
  deleteRealOwner,
} from "../api/real-owner.api";
import type {
  CreateRealOwnerRequest,
  UpdateRealOwnerRequest,
} from "../types/real-owner-response.types";
import { toast } from "react-hot-toast";
import useLanguage from "@/hooks/useLanguage";

export const useRealOwnersData = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const {
    data: realOwners = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["real-owners"],
    queryFn: () => getRealOwners().then((res) => res.data),
    staleTime: 0, // Always consider data stale to ensure fresh data
  });

  const createRealOwnerMutation = useMutation({
    mutationFn: createRealOwner,
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
      refetch();
      toast.success(t("realOwners.toast.createSuccess"));
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        t("realOwners.toast.createError");
      toast.error(errorMessage);
    },
  });

  const updateRealOwnerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRealOwnerRequest }) =>
      updateRealOwner(id, data),
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
      refetch();
      toast.success(t("realOwners.toast.updateSuccess"));
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        t("realOwners.toast.updateError");
      toast.error(errorMessage);
    },
  });

  const deleteRealOwnerMutation = useMutation({
    mutationFn: deleteRealOwner,
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
      refetch();
      toast.success(t("realOwners.toast.deleteSuccess"));
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        t("realOwners.toast.deleteError");
      toast.error(errorMessage);
    },
  });

  const getRealOwnerByIdQuery = (id: number) => {
    return useQuery({
      queryKey: ["real-owner", id],
      queryFn: () => getRealOwnerById(id).then((res) => res.data),
      enabled: !!id,
    });
  };

  return {
    realOwners,
    isLoading,
    error,
    refetch,
    createRealOwner: createRealOwnerMutation.mutate,
    updateRealOwner: updateRealOwnerMutation.mutate,
    deleteRealOwner: deleteRealOwnerMutation.mutate,
    getRealOwnerById: getRealOwnerByIdQuery,
    isCreating: createRealOwnerMutation.isPending,
    isUpdating: updateRealOwnerMutation.isPending,
    isDeleting: deleteRealOwnerMutation.isPending,
  };
};

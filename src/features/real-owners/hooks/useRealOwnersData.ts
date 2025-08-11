import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRealOwners,
  getRealOwnerById,
  createRealOwner,
  updateRealOwner,
  deleteRealOwner,
} from "../api/real-owner.api";
import type { UpdateRealOwnerRequest } from "../types/real-owner-response.types";
import { toast } from "react-hot-toast";
import useLanguage from "@/hooks/useLanguage";
import { extractErrorMessage, logError } from "@/lib/errorHandler";

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
    queryFn: () => {
      console.log("useRealOwnersData - Fetching real owners data...");
      return getRealOwners().then((res) => {
        console.log("useRealOwnersData - Real owners data fetched:", res.data);
        return res.data;
      });
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const createRealOwnerMutation = useMutation({
    mutationFn: createRealOwner,
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
      toast.success(t("realOwners.toast.createSuccess"));
    },
    onError: (error: unknown) => {
      logError(error, "Create Real Owner");
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const updateRealOwnerMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateRealOwnerRequest;
    }) => {
      console.log("useRealOwnersData - Updating real owner:", { id, data });
      return updateRealOwner(id, data);
    },
    onSuccess: (data, variables) => {
      console.log("useRealOwnersData - Update successful:", data);
      console.log("useRealOwnersData - Invalidating queries for refetch...");
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
      // Also invalidate the specific real owner query
      queryClient.invalidateQueries({ queryKey: ["real-owner", variables.id] });
      console.log(
        "useRealOwnersData - Queries invalidated, data will be refetched"
      );
      toast.success(t("realOwners.toast.updateSuccess"));
    },
    onError: (error: unknown) => {
      console.log("useRealOwnersData - Update error:", error);
      logError(error, "Update Real Owner");
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const deleteRealOwnerMutation = useMutation({
    mutationFn: deleteRealOwner,
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
      toast.success(t("realOwners.toast.deleteSuccess"));
    },
    onError: (error: unknown) => {
      logError(error, "Delete Real Owner");
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const useGetRealOwnerById = (id: number) => {
    return useQuery({
      queryKey: ["real-owner", id],
      queryFn: () => getRealOwnerById(id).then((res) => res.data),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
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
    getRealOwnerById: useGetRealOwnerById,
    isCreating: createRealOwnerMutation.isPending,
    isUpdating: updateRealOwnerMutation.isPending,
    isDeleting: deleteRealOwnerMutation.isPending,
    // Add a function to manually refetch all real owners data
    refetchRealOwners: () => {
      queryClient.invalidateQueries({ queryKey: ["real-owners"] });
    },
  };
};

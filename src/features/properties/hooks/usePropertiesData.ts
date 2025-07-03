import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getAllProperties,
  getOwnerPropertiesPending,
  getOwnerPropertiesApproved,
  getOwnerPropertiesRejected,
  approveProperty,
  rejectProperty,
  deleteApprovedProperty,
  deleteUnapprovedProperty,
} from "../api/properties.api";
import type {
  Property,
  PropertyStatus,
  PropertyCounts,
} from "../types/property-response.types";
import useLanguage from "@/hooks/useLanguage";

export const usePropertiesData = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch all properties
  const {
    data: allProperties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-properties"],
    queryFn: () => getAllProperties().then((res) => res.data),
  });

  // Fetch pending properties
  const { data: pendingProperties = [] } = useQuery({
    queryKey: ["owner-properties-pending"],
    queryFn: () => getOwnerPropertiesPending().then((res) => res.data),
  });

  // Fetch approved properties
  const { data: approvedProperties = [] } = useQuery({
    queryKey: ["owner-properties-approved"],
    queryFn: () => getOwnerPropertiesApproved().then((res) => res.data),
  });

  // Fetch rejected properties
  const { data: rejectedProperties = [] } = useQuery({
    queryKey: ["owner-properties-rejected"],
    queryFn: () => getOwnerPropertiesRejected().then((res) => res.data),
  });

  // Approve property mutation
  const approveMutation = useMutation({
    mutationFn: approveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-properties"] });
      queryClient.invalidateQueries({ queryKey: ["owner-properties-pending"] });
      queryClient.invalidateQueries({
        queryKey: ["owner-properties-approved"],
      });
      toast.success(t("properties.actions.approveSuccess"));
    },
    onError: () => {
      toast.error(t("properties.actions.approveError"));
    },
  });

  // Reject property mutation
  const rejectMutation = useMutation({
    mutationFn: rejectProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-properties"] });
      queryClient.invalidateQueries({ queryKey: ["owner-properties-pending"] });
      queryClient.invalidateQueries({
        queryKey: ["owner-properties-rejected"],
      });
      toast.success(t("properties.actions.rejectSuccess"));
    },
    onError: () => {
      toast.error(t("properties.actions.rejectError"));
    },
  });

  // Delete property mutation (handles both approved and unapproved)
  const deleteMutation = useMutation({
    mutationFn: (property: Property) => {
      if (property.status === "APPROVED") {
        return deleteApprovedProperty(property.id);
      } else {
        // For PENDING and REJECTED properties
        return deleteUnapprovedProperty(property.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-properties"] });
      queryClient.invalidateQueries({ queryKey: ["owner-properties-pending"] });
      queryClient.invalidateQueries({
        queryKey: ["owner-properties-approved"],
      });
      queryClient.invalidateQueries({
        queryKey: ["owner-properties-rejected"],
      });
      toast.success(t("properties.actions.deleteSuccess"));
    },
    onError: () => {
      toast.error(t("properties.actions.deleteError"));
    },
  });

  const getPropertiesByStatus = (
    status: PropertyStatus | "ALL"
  ): Property[] => {
    switch (status) {
      case "PENDING":
        return pendingProperties;
      case "APPROVED":
        return approvedProperties;
      case "REJECTED":
        return rejectedProperties;
      case "ALL":
      default:
        return allProperties;
    }
  };

  const getCounts = (): PropertyCounts => {
    return {
      all: allProperties.length,
      pending: pendingProperties.length,
      approved: approvedProperties.length,
      rejected: rejectedProperties.length,
    };
  };

  const refetch = () => {
    // Invalidate all property-related queries to force refresh
    queryClient.invalidateQueries({ queryKey: ["all-properties"] });
    queryClient.invalidateQueries({ queryKey: ["owner-properties-pending"] });
    queryClient.invalidateQueries({ queryKey: ["owner-properties-approved"] });
    queryClient.invalidateQueries({ queryKey: ["owner-properties-rejected"] });
  };

  return {
    allProperties,
    pendingProperties,
    approvedProperties,
    rejectedProperties,
    isLoading,
    error,
    refetch, // This now refreshes all queries
    getPropertiesByStatus,
    getCounts,
    approveProperty: approveMutation.mutate,
    rejectProperty: rejectMutation.mutate,
    deleteProperty: deleteMutation.mutate,
    isApprovingProperty: approveMutation.isPending,
    isRejectingProperty: rejectMutation.isPending,
    isDeletingProperty: deleteMutation.isPending,
  };
};

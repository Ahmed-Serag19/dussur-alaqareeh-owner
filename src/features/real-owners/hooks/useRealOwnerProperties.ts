import { useState, useEffect } from "react";
import {
  getRealOwnerProperties,
  getRealOwnerPropertyById,
  createPropertyForRealOwner,
  updatePropertyForRealOwner,
  deletePropertyForRealOwner,
} from "../api/real-owner.api";
import type {
  RealOwnerProperty,
  CreatePropertyForRealOwnerRequest,
} from "../types/real-owner-response.types";
import { extractErrorMessage, logError } from "@/lib/errorHandler";
import { toast } from "react-hot-toast";
import useLanguage from "@/hooks/useLanguage";

export const useRealOwnerProperties = (realOwnerId?: number) => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<RealOwnerProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRealOwnerProperties(realOwnerId);
      setProperties(response.data);
    } catch (err) {
      logError(err, "Fetch Properties");
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPropertyById = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRealOwnerPropertyById(id);
      return response.data;
    } catch (err) {
      logError(err, "Fetch Property by ID");
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createProperty = async (
    propertyData: CreatePropertyForRealOwnerRequest
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      const newProperty = await createPropertyForRealOwner(propertyData);
      console.log("Created property response:", newProperty);

      // Refetch the properties list to ensure we have the correct data
      await fetchProperties();

      toast.success(t("properties.createSuccess"));
      return newProperty;
    } catch (err) {
      console.log("useRealOwnerProperties createProperty error:", err);
      logError(err, "Create Property");
      const errorMessage = extractErrorMessage(err);
      console.log("Extracted error message:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const updateProperty = async (
    propertyId: number,
    propertyData: CreatePropertyForRealOwnerRequest
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updatedProperty = await updatePropertyForRealOwner(
        propertyId,
        propertyData
      );

      // Refetch the properties list to ensure we have the correct data
      await fetchProperties();

      toast.success(t("properties.updateSuccess"));
      return updatedProperty;
    } catch (err) {
      logError(err, "Update Property");
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProperty = async (propertyId: number) => {
    setIsDeleting(true);
    setError(null);

    try {
      await deletePropertyForRealOwner(propertyId);
      setProperties((prev) =>
        prev.filter((property) => property.id !== propertyId)
      );
      toast.success(t("properties.deleteSuccess"));
    } catch (err) {
      logError(err, "Delete Property");
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [realOwnerId]);

  return {
    properties,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};

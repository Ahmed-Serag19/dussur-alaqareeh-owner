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

export const useRealOwnerProperties = (realOwnerId?: number) => {
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
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
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
      setError(err instanceof Error ? err.message : "Failed to fetch property");
      throw err;
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
      setProperties((prev) => [...prev, newProperty]);
      return newProperty;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create property"
      );
      throw err;
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
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? updatedProperty : property
        )
      );
      return updatedProperty;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update property"
      );
      throw err;
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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete property"
      );
      throw err;
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

import { useState, useEffect } from "react";
import {
  getRealOwnerProperties,
  createPropertyForRealOwner,
  updatePropertyForRealOwner,
} from "../api/real-owner.api";
import type {
  RealOwnerProperty,
  CreatePropertyForRealOwnerRequest,
} from "../types/real-owner-response.types";

export const useRealOwnerProperties = (realOwnerId: number) => {
  const [properties, setProperties] = useState<RealOwnerProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProperties = async () => {
    if (!realOwnerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getRealOwnerProperties(realOwnerId);
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
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

  useEffect(() => {
    fetchProperties();
  }, [realOwnerId]);

  return {
    properties,
    isLoading,
    error,
    isCreating,
    isUpdating,
    fetchProperties,
    createProperty,
    updateProperty,
  };
};

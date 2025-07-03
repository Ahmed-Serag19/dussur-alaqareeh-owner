import { axiosInstance } from "@/lib/axios";
import type { Property } from "../types/property-response.types";

// Get all properties
export const getAllProperties = () => {
  return axiosInstance.get<Property[]>("/properties/Get-All-Property");
};

// Get pending and rejected properties (combined)
export const getOwnerProperties = () => {
  return axiosInstance.get<Property[]>("/owner/property-requests");
};

export const getOwnerPropertiesPending = () => {
  return axiosInstance.get<Property[]>("/owner/property-requests/pending");
};

export const getOwnerPropertiesApproved = () => {
  return axiosInstance.get<Property[]>("/owner/property-requests/approved");
};

export const getOwnerPropertiesRejected = () => {
  return axiosInstance.get<Property[]>("/owner/property-requests/rejected");
};

export const approveProperty = (id: number) => {
  return axiosInstance.post(`/properties/approve/${id}`);
};

export const rejectProperty = (id: number) => {
  return axiosInstance.post(`/properties/reject/${id}`);
};

// Delete approved properties
export const deleteApprovedProperty = (id: number) => {
  return axiosInstance.delete(`/properties/delete-approval-property/${id}`);
};

// Delete unapproved properties (pending/rejected)
export const deleteUnapprovedProperty = (id: number) => {
  return axiosInstance.delete(`/properties/Delete-UnApproved-Property/${id}`);
};

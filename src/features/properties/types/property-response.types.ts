export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Property {
  id: number;
  title: string;
  description: string | null;
  price: number;
  status: PropertyStatus;
  cityId: number;
  conditionId: number;
  adminId: number | null;
  finishTypeId: number;
  createdAt: string;
  updatedAt: string;
  propertyTypeId: number;
  regionId: number;
  neighborhoodId: number;
  listingTypeId: number;
  streetAr: string;
  streetEn: string;
  longitude: number;
  latitude: number;
  descriptionAr: string;
  descriptionEn: string;
  area: number;
  roomsCount: number;
  bathroomsCount: number;
  livingroomsCount: number;
  floorsCount: number;
  buildingAge: number;
  statusId: number;
  ownerId?: number;
  createdBy?: number;
  adminEmail?: string | null;
  imageUrls?: string[];
  features?: number[] | { id: number; nameAr: string; nameEn: string }[];
}

export interface PropertyCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

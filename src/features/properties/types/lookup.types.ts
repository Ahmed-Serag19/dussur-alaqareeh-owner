export interface LookupItem {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface CityItem extends LookupItem {
  regionId: number;
}

export interface NeighborhoodItem extends LookupItem {
  cityId: number;
}

export interface LookupData {
  regions: LookupItem[];
  cities: CityItem[];
  neighborhoods: NeighborhoodItem[];
  propertyTypes: LookupItem[];
  listingTypes: LookupItem[];
  propertyConditions: LookupItem[];
  finishingTypes: LookupItem[];
  propertyStatusValues: LookupItem[];
  propertyFeatures: LookupItem[];
}

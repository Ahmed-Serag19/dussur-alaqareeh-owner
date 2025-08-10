export interface RealOwner {
  id: number;
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  accountBank: string;
  iban: string;
  ibanImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRealOwnerRequest {
  realowner: {
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    accountBank: string;
    iban: string;
  };
  ibanImage?: File;
}

export interface UpdateRealOwnerRequest {
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  accountBank: string;
  iban: string;
  ibanImageUrl?: string | null;
  ibanImage?: File;
}

export interface RealOwnerProperty {
  id: number;
  title: string;
  description: string;
  regionId: number;
  cityId: number;
  neighborhoodId: number;
  listingTypeId: number;
  subUnits: RealOwnerPropertySubUnit[];
  createdAt: string;
  updatedAt: string;
}

export interface RealOwnerPropertySubUnit {
  id: number;
  propertyTypeId: number;
  paymentType: string;
  customPaymentDays: number | null;
  paymentValue: number;
  price: number;
  paidAmount: number;
  fullName: string | null;
  phoneNumber: string | null;
  nationalId: string | null;
  isPaid: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyForRealOwnerRequest {
  title: string;
  description: string;
  realOwnerId: number;
  regionId: number;
  cityId: number;
  neighborhoodId: number;
  listingTypeId: number;
  subUnits: Array<{
    propertyTypeId: number;
    paymentType: string;
    customPaymentDays: number | null;
    paymentValue: number;
    price: number;
    paidAmount: number;
  }>;
}

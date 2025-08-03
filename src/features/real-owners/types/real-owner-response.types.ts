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
  ibanImageUrl?: string;
}

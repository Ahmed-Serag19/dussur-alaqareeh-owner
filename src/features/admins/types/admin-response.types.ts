export interface AdminRole {
  id: number;
  name: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface AdminCounts {
  all: number;
  active: number;
  inactive: number;
}

export type AdminStatus = "ALL" | "ACTIVE" | "INACTIVE";

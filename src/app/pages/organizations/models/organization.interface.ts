export interface Country {
  id: number;
  name: string;
  isoCode: string;
  citiesCount: number;
}

export interface Group {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  countryId: number;
  countryName: string;
}

export interface OrganizationForm {
  id?: number;
  title: string;
  groupId?: string;
  description?: string;
  address: string;
  countryId: number;
  cityId?: number;
  code?: string;
  countryCode: string;
  phone: string;
  workHoursFrom?: string;
  workHoursTo?: string;
  isGroup: boolean;
  type: number;
  logoUrl?: string;
  file?: File | null;
}

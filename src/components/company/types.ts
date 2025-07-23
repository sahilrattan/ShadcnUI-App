export interface Company {
  companySiteId: string;
  companyId: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2: string;
  city: string;
  stateId: string;
  countryId: string;
  zipCode?: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
}

export type CompanyFormData = Company; // CompanyFormData is now identical to Company for simplicity

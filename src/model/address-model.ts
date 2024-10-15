import { Address } from "@prisma/client";

export type AddressResponse = {
  id: number;
  street?: string | null;
  city?: string | null;
  provience?: string | null;
  postal_code: string;
  country: string;
};

export type CreateAddressRequest = {
  contact_id: number;
  street?: string;
  city?: string;
  provience?: string;
  postal_code: string;
  country: string;
};

export type GetAddressRequest = {
  contact_id: number;
  address_id: number;
};
export type UpdateAddressRequest = {
  street?: string | null;
  city?: string | null;
  provience?: string | null;
  country?: string | null;
  postal_code?: string | null;
};
export type ListAddressRequest = {
  size: number
  page: number
}

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    provience: address.provience,
    country: address.country,
    postal_code: address.postal_code,
  };
}

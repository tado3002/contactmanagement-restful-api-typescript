import { z, ZodType } from "zod";

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    contact_id: z.number().positive(),
    street: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
    provience: z.string().min(1).max(100).optional(),
    postal_code: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  });
  static readonly GET: ZodType = z.object({
    contact_id: z.number().positive(),
    address_id: z.number().positive(),
  });
  static readonly UPDATE: ZodType = z.object({
    street: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
    provience: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100).optional(),
    postal_code: z.string().min(1).max(20).optional(),
  });
  static readonly LIST: ZodType = z.object({
    page: z.number().positive().min(1),
    size: z.number().positive().min(10).max(100)
  })
}

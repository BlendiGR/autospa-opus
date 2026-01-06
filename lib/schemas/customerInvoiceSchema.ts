import { z } from "zod";
import { FINNISH_PLATE_REGEX } from "../constants";

/** Single invoice item schema */
const invoiceItemSchema = z.object({
  id: z.string(),
  service: z.string().min(1, "Service name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a valid number",
    }),
});

/** Validation schema for adding an invoice to a customer */
export const customerInvoiceSchema = z.object({
  plate: z
    .string()
    .min(1, "Plate is required")
    .regex(FINNISH_PLATE_REGEX, "Invalid Finnish plate format (e.g., ABC-123)"),
  items: z.array(invoiceItemSchema).min(1, "At least one invoice item is required"),
});

export type CustomerInvoiceFormData = z.infer<typeof customerInvoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

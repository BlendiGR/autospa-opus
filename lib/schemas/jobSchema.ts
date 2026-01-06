import { z } from "zod";
import { PHONE_REGEX, FINNISH_PLATE_REGEX } from "../constants";

/** Validation schema for adding a job (tyre storage) to a customer */
export const jobSchema = z.object({
  plate: z
    .string()
    .min(1, "Plate is required")
    .regex(FINNISH_PLATE_REGEX, "Invalid Finnish plate format (e.g., ABC-123)"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Invalid phone number format"),
  location: z.string().min(1, "Location is required"),
});

export type JobFormData = z.infer<typeof jobSchema>;

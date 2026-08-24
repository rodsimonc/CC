import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
});

export const leadSchema = z.object({
  area: z.string().min(2),
  urgency: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  summary: z.string().max(2000).optional(),
  lawyer_slug: z.string().optional(),
  session_id: z.string().optional(),
  contact: contactSchema,
});

export type LeadInput = z.infer<typeof leadSchema>;

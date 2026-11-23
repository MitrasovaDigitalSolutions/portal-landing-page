import { z } from "zod";

export const inquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"], {
    message: "Status pesan tidak valid.",
  }),
  notes: z.string().trim().nullable(),
});

export type InquiryStatusValues = z.infer<typeof inquiryStatusSchema>;

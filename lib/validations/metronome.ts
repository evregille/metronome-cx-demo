import * as z from "zod";

export const metronomeConfigSchema = z.object({
  api_key: z.string().min(3).max(32),
  customer_id: z.string().min(3).max(32),
});
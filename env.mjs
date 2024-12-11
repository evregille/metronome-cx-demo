import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    METRONOME_API_TOKEN: z.string().min(1),
    METRONOME_CUSTOMER_ID: z.string().min(1),
  },
  client: {
  },
  runtimeEnv: {
    METRONOME_API_TOKEN:process.env.METRONOME_API_TOKEN,
    METRONOME_CUSTOMER_ID: process.env.METRONOME_CUSTOMER_ID,
  },
});

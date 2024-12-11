import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    METRONOME_API_TOKEN: z.string().min(1),
    METRONOME_CUSTOMER_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    METRONOME_API_TOKEN:process.env.METRONOME_API_TOKEN,
    METRONOME_CUSTOMER_ID: process.env.METRONOME_CUSTOMER_ID,
  },
});

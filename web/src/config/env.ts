import { z } from "zod";

const envSchema = z.object({
  VITE_FRONTEND_URL: z
    .url()
    .default(window.location.origin),
  VITE_BACKEND_URL: z.url().default("http://localhost:3333"),
});

export const env = envSchema.parse(import.meta.env);

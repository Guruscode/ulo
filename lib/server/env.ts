import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({

  server: {
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_ENDPOINT: z.string().url(),
    R2_BUCKET_NAME: z.string(),
    R2_REGION: z.string().default("us-east-1"),
    DATABASE_URL: z.string().url(),
    // Add other server vars
  },

  client: {},
  
  runtimeEnv: {
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
      R2_ENDPOINT: process.env.R2_ENDPOINT!,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME!,
      R2_REGION: process.env.R2_REGION!,
      DATABASE_URL: undefined
  },
  
  skipValidation: true,
});

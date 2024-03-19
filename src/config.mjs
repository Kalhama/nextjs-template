'server only'

// @ts-check
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
})
const config = schema.parse(process.env)
export default config

// https://sophiabits.com/blog/verify-environment-variables-nextjs

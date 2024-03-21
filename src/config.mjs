'server only'

// @ts-check
import { z } from 'zod'

const schema = z.object({
  // NODE_ENV: z.string(),
  // DATABASE_URL: z.string(),
  // GITHUB_ID: z.string(),
  // GITHUB_SECRET: z.string(),
  // GOOGLE_ID: z.string(),
  // GOOGLE_SECRET: z.string(),
  // HOST: z
  //   .string()
  //   .refine((host) => !host.endsWith('/'), 'Remove trailing slash')
  //   .refine((host) => host.startsWith('http'), 'must start with http or https'),
})
const config = schema.parse(process.env)
export default config

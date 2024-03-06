// @ts-check
import { z } from 'zod'

const schema = z.object({
  TEST: z.string(),
})
const config = schema.parse(process.env)
export default config

// https://sophiabits.com/blog/verify-environment-variables-nextjs

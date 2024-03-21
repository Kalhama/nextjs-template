import { z } from 'zod'

export const formSchema = z.object({
  message: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

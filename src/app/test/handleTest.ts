'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { formSchema } from './formSchema'

export const handleTest = async (
  prevState: any,
  form: z.infer<typeof formSchema>
) => {
  const safeForm = formSchema.parse(form)

  await db.test.create({
    data: {
      data: safeForm.message,
    },
  })

  revalidatePath('/test')

  return {
    success: 'ok',
  }
}

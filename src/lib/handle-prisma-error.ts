import { Prisma } from '@prisma/client'
import { notFound } from 'next/navigation'

export const handlePrismaError = (e: unknown) => {
  if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    (e.code === 'P2025' || e.code === 'P2023')
  ) {
    notFound()
  } else {
    throw e
  }
}

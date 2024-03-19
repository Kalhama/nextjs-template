import { notFound, redirect } from 'next/navigation'

import { ServerActionError } from './server-action-error'

export const wrapServerAction = <T, U extends any[]>(
  input: (...args: U) => Promise<T>
) => {
  return async (...args: U) => {
    try {
      const data = await input(...args)
      return {
        status: 'ok',
        data,
      }
    } catch (e) {
      if (e instanceof ServerActionError) {
        return {
          status: 'error',
          message: e.message,
        }
      }

      throw e
    }
  }
}

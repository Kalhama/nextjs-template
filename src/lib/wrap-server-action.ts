import { notFound, redirect } from 'next/navigation'

import { ServerActionError } from './server-action-error'

export const wrapServerAction = <T, U extends any[]>(
  input: (...args: U) => Promise<T>
): ((
  ...args: U
) => Promise<
  { success: true; data: T } | { success: false; message: string }
>) => {
  return async (...args: U) => {
    try {
      const data = await input(...args)
      return {
        success: true,
        data,
      }
    } catch (e) {
      if (e instanceof ServerActionError) {
        return {
          success: false,
          message: e.message,
        }
      }

      throw e
    }
  }
}

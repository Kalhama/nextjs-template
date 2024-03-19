'server only'

import { cookies } from 'next/headers'

import { lucia } from './auth'

export const createSessionForUser = async (id: string) => {
  const session = await lucia.createSession(id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  })
}

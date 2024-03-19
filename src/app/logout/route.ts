import { lucia } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(): Promise<Response> {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value

  if (sessionId) {
    await lucia.invalidateSession(sessionId)
  }

  const sessionCookie = lucia.createBlankSessionCookie()
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

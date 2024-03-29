import config from '@/config.mjs'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { User as DatabaseUser } from '@prisma/client'
import { GitHub, Google } from 'arctic'
import { Lucia } from 'lucia'
import type { Session, User } from 'lucia'
import { cookies } from 'next/headers'
import { cache } from 'react'

import { db } from './db'

const adapter = new PrismaAdapter(db.session, db.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    }
  },
})

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
  }
}

export const github = new GitHub(config.GITHUB_ID, config.GITHUB_SECRET)
export const google = new Google(
  config.GOOGLE_ID,
  config.GOOGLE_SECRET,
  `${config.HOST}/login/google/callback`
)

export const getCurrentUser = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value
    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const result = await lucia.validateSession(sessionId)
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
    } catch {}
    return result
  }
)

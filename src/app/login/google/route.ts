import config from '@/config.mjs'
import { google } from '@/lib/auth'
import { generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'

export async function GET(): Promise<Response> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['email', 'profile'],
  })
  url.searchParams.set('access_type', 'offline')

  cookies().set('google_codeverifier', codeVerifier, {
    httpOnly: true,
    // secure: config.NODE_ENV === 'production',
    // sameSite: 'strict',
  })

  cookies().set('google_state', state, {
    httpOnly: true,
    // secure: config.NODE_ENV === 'production',
    // sameSite: 'stricnamet',
  })

  return Response.redirect(url)
}

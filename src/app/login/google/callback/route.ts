import { google, lucia } from '@/lib/auth'
import { createSessionForUser } from '@/lib/create-session-for-user'
import { db } from '@/lib/db'
import { OAuth2RequestError } from 'arctic'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const {
    nextUrl: { searchParams },
  } = request
  const state = searchParams.get('state')
  const code = searchParams.get('code')
  const codeVerifier = cookies().get('google_codeverifier')?.value
  const savedStete = cookies().get('google_state')?.value

  if (!code || !state || !codeVerifier || !savedStete || savedStete !== state) {
    return Response.json(
      {
        error: 'invaild input',
      },
      {
        status: 400,
      }
    )
  }

  try {
    const { accessToken, idToken, refreshToken, accessTokenExpiresAt } =
      await google.validateAuthorizationCode(code, codeVerifier)

    const googleUser: GoogleUser = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json())

    const existingOAuthAccount = await db.oAuthAccount.findFirst({
      where: {
        provider: 'GOOGLE',
        providerUserId: googleUser.id,
      },
      include: {
        user: true,
      },
    })

    if (!existingOAuthAccount) {
      if (!refreshToken) {
        throw new Error('no refresh token')
      }
      const data = await db.oAuthAccount.create({
        data: {
          provider: 'GOOGLE',
          providerUserId: googleUser.id,
          user: {
            connectOrCreate: {
              where: {
                email: googleUser.email,
              },
              create: {
                email: googleUser.email,
              },
            },
          },
        },
      })

      return await createSessionForUser(data.userId)
    } else {
      return await createSessionForUser(existingOAuthAccount.user.id)
    }
  } catch (e) {
    console.error(e)
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      })
    }
    return new Response(null, {
      status: 500,
    })
  }
}

interface GoogleUser {
  id: string
  email: string
  verified_email: string
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

import { github, lucia } from '@/lib/auth'
import { createSessionForUser } from '@/lib/create-session-for-user'
import { db } from '@/lib/db'
import { OAuth2RequestError } from 'arctic'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
  const {
    nextUrl: { searchParams },
  } = request
  const state = searchParams.get('state')
  const code = searchParams.get('code')
  const savedState = cookies().get('github_state')?.value
  if (!code || !state || !savedState || state !== savedState) {
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
    const { accessToken } = await github.validateAuthorizationCode(code)

    const githubUser: GitHubUser = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())

    // Replace this with your own DB client.
    const existingOAuthAccount = await db.oAuthAccount.findFirst({
      where: { providerUserId: String(githubUser.id), provider: 'GITHUB' },
      include: {
        user: true,
      },
    })

    if (!existingOAuthAccount) {
      // Replace this with your own DB client.
      const data = await db.oAuthAccount.create({
        data: {
          provider: 'GITHUB',
          providerUserId: String(githubUser.id),
          user: {
            connectOrCreate: {
              create: {
                email: githubUser.email,
              },
              where: {
                email: githubUser.email,
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

interface GitHubUser {
  id: number
  email: string
}

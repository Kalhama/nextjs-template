import { GithubLoginButton } from '@/components/github-login-button'
import { GoogleLoginButton } from '@/components/google-login-button'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function App() {
  const { session } = await getCurrentUser()
  if (session) {
    redirect('/app')
  }

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <GithubLoginButton />

      <GoogleLoginButton />
    </main>
  )
}

import AuthForm from './AuthForm'

export const metadata = {
  title: 'Login - GermanGearsIndia',
  description: 'Sign in to access your GermanGearsIndia account',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams;

  return (
    <>
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm backdrop-blur-md">
          {message}
        </div>
      )}
      <AuthForm />
    </>
  )
}

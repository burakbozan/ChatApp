import { useState } from 'react'
import { ArrowRight, AtSign, LockKeyhole, MessageCircle, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isRegister) await register(values)
      else await login({ email: values.email, password: values.password })
      navigate('/chat/general', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f2f3ed] lg:grid-cols-[minmax(360px,0.92fr)_1.08fr]">
      <section className="auth-grid relative hidden min-h-screen overflow-hidden bg-[#173b32] px-12 py-10 text-[#f5f6ec] lg:flex lg:flex-col lg:justify-between xl:px-16">
        <Link to="/login" className="relative z-10 flex w-fit items-center gap-3 text-white no-underline">
          <span className="grid size-10 place-items-center rounded-xl bg-[#c7f36a] text-[#173b32]"><MessageCircle size={21} strokeWidth={2.5} /></span>
          <span className="font-display text-xl font-bold tracking-normal">commonroom</span>
        </Link>

        <div className="relative z-10 max-w-lg pb-12">
          <div className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c7f36a]">
            <span className="size-2 rounded-full bg-[#c7f36a]" /> Good conversations, in real time
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.06] tracking-normal xl:text-6xl">
            A little closer,<br />wherever you are.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#c6d2ca]">
            Your people, your rooms, and all the small moments in between.
          </p>
          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#e79a6b', '#a7c2ef', '#c7f36a', '#e5b8d2'].map((color, index) => (
                <span key={color} className="grid size-9 place-items-center rounded-full border-2 border-[#173b32] text-[10px] font-bold text-[#173b32]" style={{ backgroundColor: color }}>
                  {['M', 'J', 'A', 'S'][index]}
                </span>
              ))}
            </div>
            <span className="text-sm text-[#d4ddd5]">Better together, every day.</span>
          </div>
        </div>
        <span className="relative z-10 text-xs text-[#91a99e]">A quieter corner of the internet.</span>
        <div className="pointer-events-none absolute -right-24 top-28 size-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 top-44 size-40 rounded-full border border-[#c7f36a]/20" />
        <div className="pointer-events-none absolute bottom-24 right-16 h-px w-40 bg-[#c7f36a]/50" />
      </section>

      <section className="page-enter flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <Link to="/login" className="mb-12 flex w-fit items-center gap-2.5 text-[#173b32] no-underline lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-[#c7f36a]"><MessageCircle size={19} /></span>
            <span className="font-display text-lg font-bold">commonroom</span>
          </Link>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#668176]">
            {isRegister ? 'Make yourself at home' : 'Welcome back'}
          </p>
          <h2 className="font-display text-[38px] font-semibold leading-tight tracking-normal text-[#172a24]">
            {isRegister ? 'Join the room.' : 'Good to see you.'}
          </h2>
          <p className="mt-3 text-[15px] text-[#718078]">
            {isRegister ? 'Create an account and find your people.' : 'Sign in and pick up where you left off.'}
          </p>

          <form className="mt-9 space-y-5" onSubmit={submit}>
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#34483f]">Your name</span>
                <span className="relative block">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a90]" size={18} />
                  <input autoComplete="username" className="h-12 w-full rounded-xl border border-[#dce2d8] bg-white pl-11 pr-4 text-sm text-[#172a24] outline-none transition focus:border-[#517d5d] focus:ring-4 focus:ring-[#517d5d]/10" maxLength={32} minLength={2} name="username" onChange={update} placeholder="How people know you" required value={values.username} />
                </span>
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#34483f]">Email address</span>
              <span className="relative block">
                <AtSign className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a90]" size={18} />
                <input autoComplete="email" className="h-12 w-full rounded-xl border border-[#dce2d8] bg-white pl-11 pr-4 text-sm text-[#172a24] outline-none transition focus:border-[#517d5d] focus:ring-4 focus:ring-[#517d5d]/10" name="email" onChange={update} placeholder="you@example.com" required type="email" value={values.email} />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#34483f]">Password</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a90]" size={18} />
                <input autoComplete={isRegister ? 'new-password' : 'current-password'} className="h-12 w-full rounded-xl border border-[#dce2d8] bg-white pl-11 pr-4 text-sm text-[#172a24] outline-none transition focus:border-[#517d5d] focus:ring-4 focus:ring-[#517d5d]/10" minLength={8} name="password" onChange={update} placeholder="At least 8 characters" required type="password" value={values.password} />
              </span>
            </label>

            {error && <p role="alert" className="rounded-lg border border-[#e7b4a3] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b482f]">{error}</p>}

            <button className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173b32] px-5 text-sm font-bold text-white transition hover:bg-[#245447] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#517d5d] disabled:opacity-60" disabled={submitting} type="submit">
              {submitting ? 'One moment...' : isRegister ? 'Create your account' : 'Sign in'}
              {!submitting && <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#718078]">
            {isRegister ? 'Already have an account?' : 'New around here?'}{' '}
            <Link className="font-bold text-[#315c49] underline decoration-[#a4bdad] underline-offset-4 hover:text-[#173b32]" to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
          <p className="mt-10 text-center text-xs leading-5 text-[#9aa69f]">By continuing, you agree to keep this a kind place to be.</p>
        </div>
      </section>
    </main>
  )
}

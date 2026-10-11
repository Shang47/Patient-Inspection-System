import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import Brand from '@components/Brand'
import { api } from '../api/client'

function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('1234')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault(); 
    setError(''); 
    setBusy(true)
    try {
      await api.login(username, password)
      sessionStorage.setItem('patient-admin', 'true')
      navigate('/manage')
    } catch (err) { setError('Unable to sign in. Check your credentials and ensure the API server is running.' + err) }
    finally { setBusy(false) }
  }

  return <main className="grid min-h-screen bg-white lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="relative">
        <Brand light />
      </div>
      <div className="relative max-w-xl pb-10">
        <div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
          <span className="text-3xl">✚</span>
        </div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">A calmer way to care</p>
        <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">Care begins with a clear view.</h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-blue-100">Manage your patient queue and keep the current inspection visible to your team.</p>
      </div>
      <div className="relative flex items-center gap-2 text-sm text-blue-100">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />Simple. Clear. Connected.
      </div>
    </section>
    <section className="flex items-center justify-center px-5 py-12 sm:px-10">
      <div className="w-full max-w-md">
        <div className="mb-10 lg:hidden"><Brand /></div>
        <p className="text-sm font-semibold text-blue-600">STAFF PORTAL</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage the patient list and inspection queue.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
            <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <UserRound size={18} className="text-slate-400" />
              <input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} className="h-12 w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Enter your username" required />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
            <LockKeyhole size={18} className="text-slate-400" />
            <input autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="h-12 w-full border-0 bg-transparent text-sm outline-none" placeholder="Enter your password" required />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </span>
         </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{busy ? 'Signing in…' : 'Sign in'}{!busy && <ArrowRight size={18} />}</button>
        </form>
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-semibold text-blue-900">Prototype credentials</p>
          <p className="mt-1 text-xs text-blue-800">Username: <span className="font-semibold">admin</span> · Password: <span className="font-semibold">1234</span></p></div>
        <p className="mt-8 text-center text-xs text-slate-400">For demonstration use only. Do not enter real patient data.</p>
      </div>
    </section>
  </main>
}

export default LoginPage
import { useCallback, useEffect, useState } from 'react'
import { Activity, Clock3, RefreshCw, UserRound } from 'lucide-react'
import AppShell from '@components/AppShell'
import { api } from '../api/client'

function HomePage() {
  const [patient, setPatient] = useState(null)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const loadPatient = useCallback(async () => {
    try { const data = await api.currentPatient(); setPatient(data); setError(''); setUpdatedAt(new Date()) }
    catch { setError('Could not connect to the server. Retrying automatically.'); }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {  
    const timer = setInterval(loadPatient, 2000); 
    return () => clearInterval(timer) 
  }, [loadPatient])

  return <AppShell admin={sessionStorage.getItem('patient-admin') ? true : false}>
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-blue-600">INSPECTION ROOM</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Current patient</h1>
        <p className="mt-2 text-sm text-slate-500">This screen refreshes automatically.</p>
      </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
          <span className={`h-2 w-2 rounded-full ${error ? 'bg-amber-400' : 'bg-emerald-500'}`} />{error ? 'Reconnecting' : 'Live status'}
      </div>
    </header>

    <section className="relative mx-auto flex min-h-[430px] max-w-4xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-blue-100 bg-white px-6 py-12 text-center shadow-soft sm:min-h-[510px] sm:px-12">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500" />
      <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-cyan-50 blur-3xl" />
      <div className="relative mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/60">
        <UserRound size={38} strokeWidth={1.6} />
      </div>
        <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Now in inspection</p>
        {loading ? <div className="relative mt-6 animate-pulse">
                    <div className="mx-auto h-12 w-40 rounded-lg bg-slate-100" />
                    <div className="mx-auto mt-4 h-6 w-48 rounded bg-slate-100" />
                    </div> : patient ? <><h2 className="relative mt-5 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">{patient.number || patient.patient_number || `#${patient.id}`}</h2><p className="relative mt-4 text-2xl font-semibold text-slate-700 sm:text-3xl">{patient.name}</p><div className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />In inspection</div></> : <><h2 className="relative mt-5 text-2xl font-bold text-slate-800 sm:text-3xl">No patient currently</h2><p className="relative mt-3 max-w-sm text-sm leading-6 text-slate-500">When an inspection starts, the patient number and name will appear here automatically.</p></>}
        {error && <p role="status" className="relative mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</p>}
      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-5 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock3 size={14} />
          {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : 'Waiting for server'}
        </span>
        <button onClick={loadPatient} className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 hover:text-blue-600">
          <RefreshCw size={13} />
          Refresh now
        </button>
        <span className="flex items-center gap-1.5"><Activity size={14} />Auto-refresh · 2 sec</span>
      </div>
    </section>
    <p className="mt-6 text-center text-xs text-slate-400">Please verify patient identity according to your facility's procedures.</p>
  </AppShell>
}

export default HomePage
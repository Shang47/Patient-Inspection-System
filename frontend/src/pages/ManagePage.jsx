import { useCallback, useEffect, useState } from 'react'
import { Activity, Check, CircleAlert, ClipboardList, Plus, Search, UserRound, Users, Venus, Mars } from 'lucide-react'
import AppShell from '@components/AppShell'
import { api } from '../api/client'

const statusStyles = {
  waiting: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  inspecting: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  in_inspection: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  completed: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/10',
}
function statusLabel(status) { 
    return ({ waiting: 'Waiting', 
        inspecting: 'In inspection', 
        in_inspection: 'In inspection', 
        completed: 'Completed', 
        cancelled: 'Cancelled' })[status] || status || 'Unknown' }

function ManagePage() {
  const [patients, setPatients] = useState([])
  const [current, setCurrent] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newNumber, setNewNumber] = useState('')
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState('male')
  const [newSeverity, setNewSeverity] = useState('1')

  const refresh = useCallback(async () => {
    try { 
        const [list, active] = await Promise.all([api.patients(), api.currentPatient()]); 
        setPatients(list); 
        setCurrent(active); 
        setError('') 
    }
    catch { 
        setError('Could not load patients. Confirm that FastAPI is running and its endpoints match the frontend configuration.') 
    }
  }, [])

  useEffect(() => { 
    const timer = setTimeout(() => {
      refresh();
    }, 0);

    return () => clearTimeout(timer);
  }, [refresh])

  useEffect(() => {
    console.log("busyId change: ", busyId);
  }, [busyId]);

  async function start(patient) {
    setBusyId(patient.id); setNotice(''); setError('')
    try { 
        await api.startInspection(patient.id); 
        await refresh(); 
        setNotice(`${patient.name} is now in inspection.`) }
    catch (err) { setError(err.message || 'Unable to start inspection.') }
    //finally { setBusyId(null) }
  }
  async function finish() {
    setBusyId(current?.id ?? 'finish'); setNotice(''); setError('')
    try { await api.finishInspection(); await refresh(); setNotice('Inspection completed.') }
    catch (err) { setError(err.message || 'Unable to finish inspection.') }
    finally { setBusyId(null) }
  }
  async function addPatient(event) {
    event.preventDefault(); setError(''); setNotice('')
    try { 
      //console.log("gender: " + newGender + " severity: " + newSeverity)
      await api.addPatient({ number: newNumber.trim(), name: newName.trim(), gender: newGender, severity: Number(newSeverity) }); 
                            setNewNumber(''); setNewName(''); setNewGender('male'); setNewSeverity('1');
                            setShowAdd(false); await refresh(); setNotice('Patient added successfully.') }
    catch (err) { setError(err.message || 'Unable to add patient. Check the POST /patients schema on your backend.') }
  }
  const visible = patients.filter(p => `${p.number || p.patient_number || ''} ${p.name || ''}`.toLowerCase().includes(search.toLowerCase()))
  const waitingCount = patients.filter(p => p.status === 'waiting').length
  const completedCount = patients.filter(p => p.status === 'completed').length


  return <AppShell admin={sessionStorage.getItem('patient-admin') ? true : false} active="manage">
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
            <p className="text-sm font-semibold text-blue-600">OVERVIEW</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Patient management</h1>
            <p className="mt-2 text-sm text-slate-500">View the queue and manage the current inspection.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600">
                <UserRound size={15} />
            </span>
            <span className="font-medium">Administrator</span>
        </div>
    </header>
    {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"><CircleAlert size={18} className="mt-0.5 shrink-0" />{error}</div>}
    {notice && <div role="status" className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"><Check size={18} />{notice}</div>}
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Stat icon={Users} label="Total patients" value={patients.length} color="blue" />
      <Stat icon={ClipboardList} label="Waiting" value={waitingCount} color="amber" />
      <Stat icon={Activity} label="Completed" value={completedCount} color="emerald" />
    </div>
    <section className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-700 to-blue-600 p-5 text-white shadow-lg shadow-blue-900/10 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Currently in inspection</p>
          {current ? <><h2 className="mt-2 text-xl font-bold">{current.name}</h2><p className="mt-1 text-sm text-blue-100">{current.number || current.patient_number || `Patient #${current.id}`}</p></> : <><h2 className="mt-2 text-xl font-bold">No active inspection</h2><p className="mt-1 text-sm text-blue-100">Start an inspection from the waiting list below.</p></>}
        </div>
          {current && <button disabled={busyId === null} onClick={finish} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60">Finish inspection </button>}
      </div>
    </section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-bold text-slate-900">Patient list</h2>
          <p className="mt-1 text-xs text-slate-500">Select a patient to begin their inspection.</p>
        </div>
      <button onClick={() => setShowAdd(v => !v)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700">
        <Plus size={17} />
        Add patient
      </button>
      </div>
      {showAdd && <form onSubmit={addPatient} className="grid gap-3 border-b border-blue-100 bg-blue-50/50 p-5 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
        <label className="block text-xs font-semibold text-slate-600">Patient number
            <input value={newNumber} onChange={e => setNewNumber(e.target.value)} required placeholder="e.g. P007" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </label>
        <label className="block text-xs font-semibold text-slate-600">Patient name
            <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="Enter full name" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </label>
        <label className="block text-xs font-semibold text-slate-600">Patient gender
            <select name='gender' onChange={e => setNewGender(e.target.value)} required className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
        </label>
        <label className="block text-xs font-semibold text-slate-600">Patient severity
            <select name='severity' onChange={e => setNewSeverity(e.target.value)} required className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
              <option value="1">1 · Resuscitation</option>
              <option value="2">2 · Emergent</option>
              <option value="3">3 · Urgent</option>
              <option value="4">4 · Less urgent</option>
              <option value="5">5 · Non-urgent</option>
            </select>
        </label>
        <div className="flex gap-2">
            <button className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
                Save
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
            </button>
        </div>
      </form>}
      <div className="border-b border-slate-100 p-4 sm:px-6">
        <div className="relative max-w-sm">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or patient number…" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">No.</th>
              <th className="px-4 py-3 font-semibold">Patient number</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Gender</th>
              <th className="px-4 py-3 font-semibold">Severity</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{visible.map((p, index) => 
            { const status = p.status || 'waiting'; 
              const isCurrent = current && current.id === p.id; 
              
              return <tr key={p.id} className={`transition hover:bg-slate-50/80 ${isCurrent ? 'bg-emerald-50/30' : ''}`}>
                        <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{p.number || p.patient_number || `#${p.id}`}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500"><UserRound size={16} /></span>
                            <span className="font-medium text-slate-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                          {p.gender === "male" ? (
                            <Mars size={18} className='text-blue-600'/>
                          ) : (
                            <Venus size={18} className="text-pink-600" />
                          )}
                          <span className="capitalize">{p.gender}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {p.severity != null ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                {
                                  1: "bg-red-50 text-red-700 ring-red-200",
                                  2: "bg-orange-50 text-orange-700 ring-orange-200",
                                  3: "bg-amber-50 text-amber-700 ring-amber-200",
                                  4: "bg-lime-50 text-lime-700 ring-lime-200",
                                  5: "bg-emerald-50 text-emerald-700 ring-emerald-200",
                                }[p.severity] ??
                                "bg-slate-100 text-slate-600 ring-slate-200"
                              }`}
                            >
                              {{
                                1: "1 · Resuscitation",
                                2: "2 · Emergent",
                                3: "3 · Urgent",
                                4: "4 · Less Urgent",
                                5: "5 · Non-urgent",
                              }[p.severity] ?? `Level ${p.severity}`}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.waiting}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />{statusLabel(status)}</span>
                        </td>
                        <td className="px-4 py-4">
                          {isCurrent ? <button disabled={busyId === null} onClick={finish} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">Finish inspection</button> : status === 'waiting' ? <button disabled={busyId !== null || Boolean(current)} onClick={() => start(p)} title={current ? 'Finish the current inspection first' : 'Start inspection'} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">{busyId === p.id ? 'Starting…' : 'Start inspection'}</button> : <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Check size={14} />No action</span>}</td></tr> })}{visible.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">{search ? 'No patients match your search.' : 'No patients found.'}
                        </td>
                      </tr>
            }
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
        <span>Showing {visible.length} of {patients.length} patients</span>
        <button onClick={refresh} className="font-semibold text-blue-600 hover:text-blue-700">
            Refresh list
        </button>
      </div>
    </section>
    <p className="mt-5 text-xs leading-5 text-slate-400">Prototype note: patient data is held in backend memory and may reset when the API server restarts.</p>
  </AppShell>
}

function Stat({ icon: Icon, label, value, color }) {
  const styles = { blue: 'bg-blue-50 text-blue-600', amber: 'bg-amber-50 text-amber-600', emerald: 'bg-emerald-50 text-emerald-600' }
  return (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className={`grid h-12 w-12 place-items-center rounded-xl ${styles[color]}`}>
        <Icon size={22} />
    </div>
    <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  </div>)
}

export default ManagePage
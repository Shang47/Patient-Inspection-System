import { NavLink, useNavigate } from 'react-router'
import { Activity, ClipboardList, Home, LogOut } from 'lucide-react'
import Brand from './Brand'


function AppShell({ children, active = 'home', admin = false }) {
  const navigate = useNavigate()

  function logout() { sessionStorage.removeItem('patient-admin'); navigate('/login') }

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`
  
  return (<div className="min-h-screen bg-slate-50 md:flex">
    <aside className="flex w-full flex-col bg-slate-900 p-4 text-white md:fixed md:inset-y-0 md:w-64 md:p-5">
      <div className="mb-8 px-1 pt-1"><Brand light /></div>
      <nav className="flex gap-2 md:flex-col">
        <NavLink to="/" end className={linkClass}><Home size={18} />Home</NavLink>
        {admin && <NavLink to="/manage" className={linkClass}><ClipboardList size={18} />Manage patients</NavLink>}
      </nav>
      <div className="mt-5 border-t border-white/10 pt-4 md:mt-auto">
        {admin ? <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><LogOut size={18} />Log out</button> : <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-xs text-slate-300"><Activity size={17} className="text-emerald-400" /><span>Live inspection display</span></div>}
      </div>
    </aside>
    <main className="min-w-0 flex-1 p-4 sm:p-6 md:ml-64 md:p-10">{children}</main>
  </div>)
}


export default AppShell
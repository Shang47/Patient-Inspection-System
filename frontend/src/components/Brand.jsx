import { HeartPulse } from 'lucide-react'

function Brand({light = false, compact = false}) {
    return <div className='flex items-center gap-3'>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <HeartPulse size={22} strokeWidth={2.5} />
        </div>
        {!compact && <div>
                <div className={`font-bold leading-tight ${light ? 'text-white' : 'text-slate-900'}`}>Patient Inspection</div>
                <div className={`text-xs ${light ? 'text-blue-100' : 'text-slate-500'}`}>Management System</div>
            </div>}
    </div>
}

export default Brand
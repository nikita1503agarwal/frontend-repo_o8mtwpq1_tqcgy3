import { useEffect, useState } from 'react'

export default function CoachDashboard({ session }) {
  const [clients, setClients] = useState([])
  const [selected, setSelected] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/coach/${session.user_id}/clients`)
    const json = await res.json()
    setClients(json.clients || [])
  }

  useEffect(()=>{ load() }, [])

  const open = async (u) => {
    setSelected(null)
    const res = await fetch(`${baseUrl}/coach/client/${u.user_id}`)
    const json = await res.json()
    setSelected(json)
  }

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Assigned Clients</h3>
        <div className="space-y-2">
          {clients.length === 0 && <p className="text-sm text-gray-600">No clients or no consent.</p>}
          {clients.map(c => (
            <button onClick={()=>open(c)} key={c.user_id} className="w-full text-left p-3 rounded border hover:bg-gray-50">
              <div className="font-medium">{c.full_name}</div>
              <div className="text-xs text-gray-600">AS {c.attention_score?.toFixed?.(1) || '-'} · AwS {c.awareness_score?.toFixed?.(1) || '-'}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 bg-white rounded-xl shadow p-4 min-h-[320px]">
        {!selected ? (
          <p className="text-gray-600">Select a client to view details.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selected.profile.full_name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded bg-gray-50">Attention: {selected.scores?.attention_score?.toFixed?.(1) || '-'}</div>
              <div className="p-3 rounded bg-gray-50">Awareness: {selected.scores?.awareness_score?.toFixed?.(1) || '-'}</div>
              <div className="p-3 rounded bg-gray-50">Last activity: {selected.scores?.last_checkin_at ? new Date(selected.scores.last_checkin_at).toLocaleString() : '-'}</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 rounded border">
                <h4 className="font-semibold mb-2">BMS Meta Card</h4>
                <p className="text-sm">Body {selected.bms?.body_score?.toFixed?.(1) || '-'}, Mind {selected.bms?.mind_score?.toFixed?.(1) || '-'}, Soul {selected.bms?.soul_score?.toFixed?.(1) || '-'}</p>
              </div>
              <div className="p-3 rounded border">
                <h4 className="font-semibold mb-2">Recent Check-ins</h4>
                <div className="h-48 overflow-y-auto space-y-2 text-sm">
                  {(selected.checkins||[]).map((c)=> (
                    <div key={c._id} className="p-2 rounded bg-gray-50">
                      {new Date(c.timestamp).toLocaleDateString()} · energy {c.energy_level} · hydration {c.hydration_goal_met ? 'yes' : 'no'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

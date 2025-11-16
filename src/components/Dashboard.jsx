import { useEffect, useState } from 'react'

function ScoreCard({ title, value, accent }) {
  return (
    <div className={`p-4 rounded-xl bg-white shadow border-l-4 ${accent}`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value !== undefined && value !== null ? value.toFixed ? value.toFixed(1) : value : '-'}</div>
    </div>
  )
}

export default function Dashboard({ session }) {
  const [data, setData] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/dashboard/${session.user_id}`)
    const json = await res.json()
    setData(json)
  }

  useEffect(()=>{ load() }, [])

  if (!data) return <div className="text-center text-gray-600">Loading dashboard...</div>

  const bms = data.bms || {}
  const scores = data.scores || {}
  const summary = data.weekly_summary || {}

  return (
    <div className="max-w-6xl mx-auto grid gap-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ScoreCard title="Body" value={bms.body_score} accent="border-cyan-400" />
        <ScoreCard title="Mind" value={bms.mind_score} accent="border-indigo-400" />
        <ScoreCard title="Soul" value={bms.soul_score} accent="border-violet-400" />
        <ScoreCard title="Attention" value={scores.attention_score} accent="border-amber-400" />
        <ScoreCard title="Awareness" value={scores.awareness_score} accent="border-rose-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">Weekly Summary</h3>
          <p className="text-sm text-gray-600">Average energy: {summary.trend_energy_avg?.toFixed?.(1) || '-'}</p>
          <p className="text-sm text-gray-600">Check-ins: {summary.checkin_count || 0}</p>
          <p className="text-sm text-gray-600">Hydration rate: {(summary.hydration_rate*100 || 0).toFixed(0)}%</p>
        </div>

        <CheckinCard session={session} onDone={load} />
      </div>

      <Chat session={session} />
    </div>
  )
}

function CheckinCard({ session, onDone }) {
  const [form, setForm] = useState({ emotional_state:'neutral', energy_level:5, hydration_goal_met:false, micro_action_completed:false, sense_of_purpose:5, reflection_text:'' })
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/checkin/submit`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ user_id: session.user_id, ...form }) })
      if (!res.ok) throw new Error('Failed to submit')
      onDone?.()
      setForm({ emotional_state:'neutral', energy_level:5, hydration_goal_met:false, micro_action_completed:false, sense_of_purpose:5, reflection_text:'' })
    } catch (e) {
      alert(e.message)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow p-4 space-y-3">
      <h3 className="font-semibold mb-2">Daily Check-In</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">Emotional state
          <select className="w-full border rounded px-2 py-1" value={form.emotional_state} onChange={(e)=>setForm({...form, emotional_state:e.target.value})}>
            <option value="low">Low</option>
            <option value="neutral">Neutral</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="text-sm">Energy level
          <input type="number" min="1" max="10" className="w-full border rounded px-2 py-1" value={form.energy_level} onChange={(e)=>setForm({...form, energy_level:Number(e.target.value)})} />
        </label>
        <label className="text-sm flex items-center gap-2 col-span-2">
          <input type="checkbox" checked={form.hydration_goal_met} onChange={(e)=>setForm({...form, hydration_goal_met:e.target.checked})} /> Hydration goal met
        </label>
        <label className="text-sm flex items-center gap-2 col-span-2">
          <input type="checkbox" checked={form.micro_action_completed} onChange={(e)=>setForm({...form, micro_action_completed:e.target.checked})} /> Micro-action completed
        </label>
        <label className="text-sm">Sense of purpose
          <input type="number" min="1" max="10" className="w-full border rounded px-2 py-1" value={form.sense_of_purpose} onChange={(e)=>setForm({...form, sense_of_purpose:Number(e.target.value)})} />
        </label>
      </div>
      <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Reflection (optional)" value={form.reflection_text} onChange={(e)=>setForm({...form, reflection_text:e.target.value})} />
      <button disabled={loading} className="w-full bg-emerald-600 text-white rounded py-2">{loading ? 'Submitting...' : 'Submit Check-In'}</button>
    </form>
  )
}

function Chat({ session }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [conversationId, setConversationId] = useState(`${session.user_id}:${session.coach_id || 'coach-demo'}`)

  const load = async () => {
    const res = await fetch(`${baseUrl}/chat/${conversationId}`)
    const json = await res.json()
    setMessages(json.messages || [])
  }
  useEffect(()=>{ load() }, [conversationId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await fetch(`${baseUrl}/chat/send`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ conversation_id: conversationId, sender_id: session.user_id, receiver_id: session.coach_id || 'coach-demo', sender_role: 'user', message: text }) })
    setText('')
    load()
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Coach Chat</h3>
        <input value={conversationId} onChange={(e)=>setConversationId(e.target.value)} className="text-xs border rounded px-2 py-1" />
      </div>
      <div className="h-64 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded">
        {messages.map((m)=> (
          <div key={m._id} className={`max-w-[80%] px-3 py-2 rounded-lg ${m.sender_role==='user' ? 'bg-blue-600 text-white ml-auto' : 'bg-white border'}`}>
            <div className="text-xs opacity-70 mb-0.5">{m.sender_role}</div>
            <div>{m.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Write a message..." />
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Send</button>
      </form>
    </div>
  )
}

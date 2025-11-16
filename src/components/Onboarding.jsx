import { useState } from 'react'

export default function Onboarding({ user, onDone }) {
  const [consent, setConsent] = useState(true)
  const [form, setForm] = useState({ body_goals: '', mind_goals: '', soul_goals: '', habits: '', challenges: '', preferred_practices: '' })
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/onboarding/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.user_id, consent_share_with_coach: consent, ...form }) })
      if (!res.ok) throw new Error('Failed to submit')
      onDone()
    } catch (e) {
      alert(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Extended Anamnesis</h2>
      <form onSubmit={submit} className="space-y-4">
        {['body_goals','mind_goals','soul_goals','habits','challenges','preferred_practices'].map((k)=> (
          <div key={k}>
            <label className="block text-sm font-medium mb-1 capitalize">{k.replace('_',' ')}</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={form[k]} onChange={(e)=>setForm({...form, [k]: e.target.value})} />
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} />
          I consent to share my BMS Meta Card with my coach.
        </label>
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded py-2">{loading ? 'Submitting...' : 'Finish Onboarding'}</button>
      </form>
    </div>
  )
}

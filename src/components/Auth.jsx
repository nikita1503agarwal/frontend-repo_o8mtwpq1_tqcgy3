import { useState } from 'react'

export default function Auth({ onAuthed }) {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = isLogin ? `${baseUrl}/auth/login` : `${baseUrl}/auth/register`
      const body = isLogin ? { email: form.email, password: form.password } : { email: form.email, password: form.password, full_name: form.full_name, role }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).detail || 'Request failed')
      const data = await res.json()
      onAuthed(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 text-sm">
          <button className={`px-3 py-1 rounded ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`px-3 py-1 rounded ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        {!isLogin && (
          <select value={role} onChange={(e)=>setRole(e.target.value)} className="text-sm border rounded px-2 py-1">
            <option value="user">User</option>
            <option value="coach">Coach</option>
          </select>
        )}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {!isLogin && (
          <input placeholder="Full name" className="w-full border rounded px-3 py-2" value={form.full_name} onChange={(e)=>setForm({...form, full_name:e.target.value})} required />
        )}
        <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full border rounded px-3 py-2" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2">{loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create account')}</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}

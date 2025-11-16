import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import CoachDashboard from './components/CoachDashboard'

function App() {
  const [session, setSession] = useState(null)
  const [onboarded, setOnboarded] = useState(false)

  const handleAuthed = (data) => {
    setSession(data)
  }

  const reset = () => { setSession(null); setOnboarded(false) }

  const showHero = !session
  const showOnboarding = session && session.role === 'user' && !onboarded

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="font-extrabold text-xl">BMS Meta</div>
          <div className="text-sm text-gray-600 flex items-center gap-3">
            {session ? (
              <>
                <span>{session.full_name} · {session.role}</span>
                <button onClick={reset} className="px-3 py-1 rounded bg-gray-900 text-white">Logout</button>
              </>
            ) : (
              <span className="opacity-70">AI holistic health</span>
            )}
          </div>
        </div>
      </header>

      {showHero && (
        <>
          <Hero onGetStarted={()=>{}} />
          <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
            <Auth onAuthed={handleAuthed} />
          </div>
        </>
      )}

      {showOnboarding && (
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Onboarding user={session} onDone={()=>setOnboarded(true)} />
        </div>
      )}

      {session && session.role === 'user' && onboarded && (
        <div className="px-6 py-10">
          <Dashboard session={session} />
        </div>
      )}

      {session && session.role === 'coach' && (
        <div className="px-6 py-10">
          <CoachDashboard session={session} />
        </div>
      )}

      <footer className="py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} BMS Meta</footer>
    </div>
  )
}

export default App

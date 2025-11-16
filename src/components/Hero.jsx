import Spline from '@splinetool/react-spline'
import { ArrowRight } from 'lucide-react'

export default function Hero({ onGetStarted }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-sm">BMS Meta · Stage 1 MVP</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Build your Body, Mind, and Soul with daily guidance
          </h1>
          <p className="text-white/80 text-lg">
            Onboard with an extended anamnesis, track daily check-ins, and get weekly AI insights — all in one place. Coaches can support clients with a focused dashboard and chat.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onGetStarted} className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold flex items-center gap-2 transition">
              Get Started <ArrowRight size={18} />
            </button>
            <a href="/test" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition">Check backend</a>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 text-sm text-white/80">
            <div className="p-3 rounded-lg bg-white/5">Attention Score</div>
            <div className="p-3 rounded-lg bg-white/5">Awareness Score</div>
            <div className="p-3 rounded-lg bg-white/5">B/M/S Scores</div>
          </div>
        </div>
        <div className="h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black/20">
          <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.25),transparent_60%)]" />
    </div>
  )
}

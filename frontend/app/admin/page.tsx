'use client'
import { useState } from 'react'

const MOCK_STATS = {
  total: 347, high_risk: 89, medium_risk: 124, low_risk: 134,
  referrals_clicked: 52, top_factor: 'Diabetes (78% of high-risk)',
}
const MOCK_REFERRALS = [
  { id: 1, time: '2 mins ago', age: '60–70', gender: 'M', score: 112, level: 'critical', factors: ['Diabetes', 'High BP', 'High creatinine'], clicked: true },
  { id: 2, time: '14 mins ago', age: '50–60', gender: 'F', score: 87,  level: 'high',     factors: ['Diabetes', 'Swollen feet', 'Fatigue'], clicked: false },
  { id: 3, time: '31 mins ago', age: '40–50', gender: 'M', score: 76,  level: 'high',     factors: ['High BP', 'Family history', 'Painkillers'], clicked: true },
  { id: 4, time: '1 hr ago',    age: '60–70', gender: 'F', score: 95,  level: 'critical', factors: ['Diabetes', 'High BP', 'Urination changes'], clicked: false },
  { id: 5, time: '2 hrs ago',   age: '50–60', gender: 'M', score: 68,  level: 'high',     factors: ['Creatinine history', 'High BP'], clicked: true },
]

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'dedhia2024')) {
      setAuthenticated(true)
    } else {
      setError('Incorrect password')
    }
  }

  if (!authenticated) {
    return (
      <main style={{ minHeight: '100vh', background: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: 16, padding: 40, width: '100%', maxWidth: 380 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ color: 'white', fontWeight: 700 }}>K</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, color: '#1c1917' }}>Clinic Dashboard</h1>
          <p style={{ fontSize: 14, color: '#78716c', marginBottom: 24 }}>KidneyCheck · Dr. Dedhia</p>
          <input type="password" placeholder="Enter password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #e7e5e4', borderRadius: 8, fontSize: 15, marginBottom: 12, outline: 'none', color: '#1c1917' }} />
          {error && <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 10 }}>{error}</p>}
          <button onClick={handleLogin}
            style={{ width: '100%', padding: '12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Login
          </button>
          <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 16, textAlign: 'center' }}>Default password: dedhia2024</p>
        </div>
      </main>
    )
  }

  const levelColor: Record<string, string> = { critical: '#be123c', high: '#dc2626', medium: '#d97706', low: '#16a34a' }
  const levelBg: Record<string, string>    = { critical: '#fff1f2', high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' }

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e7e5e4', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>K</span>
            </div>
            <span style={{ fontWeight: 600, color: '#1c1917' }}>KidneyCheck</span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#78716c' }}>Dr. Dedhia · Today</div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total screenings', value: MOCK_STATS.total, color: '#1c1917' },
            { label: 'High-risk referrals', value: MOCK_STATS.high_risk, color: '#dc2626' },
            { label: 'Booked appointment', value: MOCK_STATS.referrals_clicked, color: '#16a34a' },
            { label: 'Top risk factor', value: MOCK_STATS.top_factor, color: '#d97706', small: true },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: 10, padding: '16px' }}>
              <div style={{ fontSize: stat.small ? 13 : 28, fontWeight: 600, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#a8a29e' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Referral feed */}
        <div style={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e7e5e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1c1917' }}>High-risk referrals</span>
            <span style={{ fontSize: 12, color: '#a8a29e' }}>Anonymised · Live feed</span>
          </div>
          {MOCK_REFERRALS.map((r, i) => (
            <div key={r.id} style={{ padding: '16px 20px', borderBottom: i < MOCK_REFERRALS.length - 1 ? '1px solid #f5f5f4' : 'none', display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 90 }}>
                <div style={{ fontSize: 11, color: '#a8a29e' }}>{r.time}</div>
                <div style={{ fontSize: 13, color: '#78716c' }}>Age {r.age} · {r.gender}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: levelColor[r.level], background: levelBg[r.level], padding: '2px 10px', borderRadius: 20 }}>
                    {r.level.charAt(0).toUpperCase() + r.level.slice(1)} · {r.score}pts
                  </span>
                  {r.clicked && (
                    <span style={{ fontSize: 11, background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
                      Booked →
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.factors.map(f => (
                    <span key={f} style={{ fontSize: 11, background: '#f5f5f4', color: '#78716c', padding: '2px 8px', borderRadius: 4 }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#a8a29e', textAlign: 'center', marginTop: 24 }}>
          All data is anonymised. No names or contact details are stored. · Connect Supabase for live data.
        </p>
      </div>
    </main>
  )
}

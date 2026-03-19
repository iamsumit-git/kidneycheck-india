'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Language } from '@/lib/questions'

export default function LabValues() {
  const params = useSearchParams()
  const router = useRouter()
  const lang = (params.get('lang') as Language) || 'en'
  const answers = params.get('answers') || '{}'
  const [labs, setLabs] = useState({ sc: '', bgr: '', bu: '', hemo: '', bp: '', pcv: '', sod: '', pot: '' })
  const [loading, setLoading] = useState(false)

  const t = {
    en: { title: 'Enter your blood test values', sub: 'Have a blood test report? Enter values for a more accurate ML-powered kidney assessment. All fields optional.', cta: 'Get More Accurate Result', skip: 'Skip — use symptom result' },
    hi: { title: 'रक्त परीक्षण मान दर्ज करें', sub: 'रक्त परीक्षण रिपोर्ट है? अधिक सटीक परिणाम के लिए मान दर्ज करें। सभी वैकल्पिक।', cta: 'अधिक सटीक परिणाम', skip: 'छोड़ें' },
    mr: { title: 'रक्त चाचणी मूल्ये प्रविष्ट करा', sub: 'रक्त चाचणी अहवाल आहे? अधिक अचूक निकालासाठी मूल्ये प्रविष्ट करा. सर्व पर्यायी.', cta: 'अधिक अचूक निकाल', skip: 'वगळा' },
  }[lang]

  const fields = [
    { key: 'sc',   label: 'Serum Creatinine (mg/dL)',  placeholder: '1.2',  normal: 'Normal: 0.6–1.2' },
    { key: 'bgr',  label: 'Blood Glucose (mg/dL)',      placeholder: '120',  normal: 'Normal: 70–140' },
    { key: 'bu',   label: 'Blood Urea (mg/dL)',         placeholder: '40',   normal: 'Normal: 15–45' },
    { key: 'hemo', label: 'Haemoglobin (g/dL)',         placeholder: '13.5', normal: 'Normal: 12–17' },
    { key: 'bp',   label: 'Blood Pressure (mmHg)',      placeholder: '120',  normal: 'Normal: <120' },
    { key: 'pcv',  label: 'Packed Cell Volume (%)',     placeholder: '40',   normal: 'Normal: 36–50' },
    { key: 'sod',  label: 'Sodium (mEq/L)',             placeholder: '138',  normal: 'Normal: 135–145' },
    { key: 'pot',  label: 'Potassium (mEq/L)',          placeholder: '4.5',  normal: 'Normal: 3.5–5.0' },
  ] as const

  const handleSubmit = async () => {
    setLoading(true)
    const prevAnswers = JSON.parse(decodeURIComponent(answers))
    const labFeatures: Record<string, number | null> = {}
    for (const [k, v] of Object.entries(labs)) {
      labFeatures[k] = v !== '' ? parseFloat(v as string) : null
    }
    const response = await fetch('/api/ml-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: { ...prevAnswers, ...labFeatures } }),
    })
    const data = await response.json()
    const encoded = encodeURIComponent(JSON.stringify({ ...prevAnswers, _lab_ml: data }))
    router.push(`/results?answers=${encoded}&lang=${lang}`)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9' }}>
      <header style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', fontSize: 14 }}>←</button>
        <span style={{ fontWeight: 600, color: '#1c1917' }}>KidneyCheck</span>
      </header>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Lab Values (Optional)</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1c1917', marginBottom: 8 }}>{t.title}</h1>
        <p style={{ fontSize: 14, color: '#78716c', marginBottom: 28, lineHeight: 1.6 }}>{t.sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#57534e', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type="number" step="any" placeholder={f.placeholder}
                value={labs[f.key as keyof typeof labs]}
                onChange={e => setLabs(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 8, fontSize: 14, color: '#1c1917', background: 'white', outline: 'none' }} />
              <span style={{ fontSize: 11, color: '#a8a29e' }}>{f.normal}</span>
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#e7e5e4' : '#dc2626', color: loading ? '#a8a29e' : 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginBottom: 12 }}>
          {loading ? 'Analysing...' : t.cta}
        </button>
        <button onClick={() => router.back()}
          style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 14, color: '#78716c', cursor: 'pointer' }}>
          {t.skip}
        </button>
      </div>
    </main>
  )
}

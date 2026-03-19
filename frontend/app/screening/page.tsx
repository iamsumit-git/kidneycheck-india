'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QUESTIONS, Language } from '@/lib/questions'

export default function Screening() {
  const router = useRouter()
  const params = useSearchParams()
  const lang = (params.get('lang') as Language) || 'en'

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [animKey, setAnimKey] = useState(0)

  const q = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  useEffect(() => {
    setSelected(answers[q?.id] || null)
    setAnimKey(k => k + 1)
  }, [current])

  const handleSelect = (value: string) => setSelected(value)

  const handleNext = () => {
    if (!selected) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)

    if (current + 1 >= QUESTIONS.length) {
      const encoded = encodeURIComponent(JSON.stringify(newAnswers))
      router.push(`/results?answers=${encoded}&lang=${lang}`)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handleBack = () => {
    if (current > 0) setCurrent(c => c - 1)
    else router.push(`/?lang=${lang}`)
  }

  const categoryLabel: Record<string, Record<Language, string>> = {
    risk:      { en: 'Risk factors', hi: 'जोखिम कारक', mr: 'जोखीम घटक' },
    symptom:   { en: 'Symptoms',     hi: 'लक्षण',      mr: 'लक्षणे' },
    lifestyle: { en: 'Lifestyle',    hi: 'जीवनशैली',   mr: 'जीवनशैली' },
  }

  if (!q) return null

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9', display: 'flex', flexDirection: 'column' }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: '#e7e5e4', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="progress-bar" style={{ height: '100%', background: '#dc2626', width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #e7e5e4' }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← {lang === 'hi' ? 'वापस' : lang === 'mr' ? 'मागे' : 'Back'}
        </button>
        <span style={{ fontSize: 13, color: '#a8a29e' }}>
          {current + 1} / {QUESTIONS.length}
        </span>
      </header>

      {/* Question */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 560, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <div key={animKey} className="fade-up">
          {/* Category */}
          <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            {categoryLabel[q.category][lang]}
          </div>

          {/* Question text */}
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 600, color: '#1c1917', marginBottom: 32, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
            {q.question[lang]}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.options.map(opt => (
              <button key={opt.value} onClick={() => handleSelect(opt.value)}
                className={`option-btn ${selected === opt.value ? 'selected' : ''}`}
                style={{ padding: '16px 20px', borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontSize: 15, color: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{opt.label[lang]}</span>
                {selected === opt.value && (
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontSize: 12 }}>✓</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Next button */}
      <div style={{ padding: '20px 24px', background: 'white', borderTop: '1px solid #e7e5e4', maxWidth: 560, margin: '0 auto', width: '100%' }}>
        <button onClick={handleNext} disabled={!selected}
          style={{ width: '100%', padding: '16px', borderRadius: 10, background: selected ? '#dc2626' : '#e7e5e4', color: selected ? 'white' : '#a8a29e', border: 'none', fontSize: 16, fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
          {current + 1 >= QUESTIONS.length
            ? (lang === 'hi' ? 'परिणाम देखें' : lang === 'mr' ? 'निकाल पहा' : 'See My Results')
            : (lang === 'hi' ? 'आगे' : lang === 'mr' ? 'पुढे' : 'Next')}
        </button>
      </div>
    </main>
  )
}

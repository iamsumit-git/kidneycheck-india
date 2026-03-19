'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { calculateRisk, mapAnswersToMLFeatures, Language, RiskResult } from '@/lib/questions'
import Link from 'next/link'

interface MLResult { prediction: string; confidence: number; reliability: string; features_provided: number }

export default function Results() {
  const params = useSearchParams()
  const lang = (params.get('lang') as Language) || 'en'
  const answers = JSON.parse(decodeURIComponent(params.get('answers') || '{}'))

  const [risk, setRisk] = useState<RiskResult | null>(null)
  const [explanation, setExplanation] = useState<string>('')
  const [mlResult, setMLResult] = useState<MLResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const r = calculateRisk(answers)
    setRisk(r)

    // Fetch Claude explanation
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, risk: r, lang }),
    })
      .then(res => res.json())
      .then(data => setExplanation(data.explanation || ''))
      .catch(() => setExplanation(''))

    // Fetch ML prediction
    const features = mapAnswersToMLFeatures(answers)
    fetch('/api/ml-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
    })
      .then(res => res.json())
      .then(data => { setMLResult(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!risk) return null

  const riskColors: Record<string, string> = { low: '#16a34a', medium: '#d97706', high: '#dc2626', critical: '#be123c' }
  const riskBg:     Record<string, string> = { low: '#f0fdf4', medium: '#fffbeb', high: '#fef2f2', critical: '#fff1f2' }
  const riskBorder: Record<string, string> = { low: '#bbf7d0', medium: '#fde68a', high: '#fca5a5', critical: '#fda4af' }

  const t = {
    en: { title: 'Your Kidney Health Result', score: 'Risk Score', mlResult: 'ML Classification', reliability: 'Reliability', explanation: 'What this means for you', nextSteps: 'Recommended next steps', seeDoctor: 'Book with Dr. Dedhia', labValues: 'Get more accurate result — enter lab values', disclaimer: 'This is a pre-screening tool, not a medical diagnosis. Always consult a qualified doctor.', shareWhatsApp: 'Share on WhatsApp', checkAgain: 'Check Again' },
    hi: { title: 'आपकी किडनी स्वास्थ्य रिपोर्ट', score: 'जोखिम स्कोर', mlResult: 'ML वर्गीकरण', reliability: 'विश्वसनीयता', explanation: 'आपके लिए इसका क्या अर्थ है', nextSteps: 'अनुशंसित अगले कदम', seeDoctor: 'डॉ. देढिया से अपॉइंटमेंट लें', labValues: 'अधिक सटीक परिणाम — रक्त परीक्षण मान दर्ज करें', disclaimer: 'यह एक प्री-स्क्रीनिंग टूल है, चिकित्सा निदान नहीं। हमेशा योग्य डॉक्टर से परामर्श लें।', shareWhatsApp: 'WhatsApp पर शेयर करें', checkAgain: 'फिर से जांचें' },
    mr: { title: 'तुमचा मूत्रपिंड आरोग्य अहवाल', score: 'धोका गुण', mlResult: 'ML वर्गीकरण', reliability: 'विश्वासार्हता', explanation: 'तुमच्यासाठी याचा अर्थ काय', nextSteps: 'शिफारस केलेल्या पुढील पायऱ्या', seeDoctor: 'डॉ. देढिया यांच्याशी भेट घ्या', labValues: 'अधिक अचूक निकाल — रक्त तपासणी मूल्ये प्रविष्ट करा', disclaimer: 'हे एक प्री-स्क्रीनिंग साधन आहे, वैद्यकीय निदान नाही. नेहमी पात्र डॉक्टरांचा सल्ला घ्या.', shareWhatsApp: 'WhatsApp वर शेअर करा', checkAgain: 'पुन्हा तपासा' },
  }[lang]

  const color  = riskColors[risk.level]
  const bg     = riskBg[risk.level]
  const border = riskBorder[risk.level]

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9' }}>
      <header style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: 14 }}>K</span>
        </div>
        <span style={{ fontWeight: 600, color: '#1c1917' }}>KidneyCheck</span>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>

        {/* Main risk card */}
        <div className="fade-up" style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 16, padding: '28px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{t.title}</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 56, fontWeight: 700, color, lineHeight: 1 }}>{risk.score}</div>
              <div style={{ fontSize: 13, color, opacity: 0.8 }}>{t.score} / 143</div>
            </div>
            <div style={{ padding: '8px 20px', background: color, borderRadius: 30 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{risk.label[lang]}</span>
            </div>
          </div>
          <p style={{ fontSize: 15, color: '#44403c', lineHeight: 1.65, margin: 0 }}>{risk.recommendation[lang]}</p>
        </div>

        {/* ML Result card */}
        {!loading && mlResult && (
          <div className="fade-up" style={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{t.mlResult}</p>
              <span style={{ fontSize: 11, background: '#f5f5f4', color: '#78716c', padding: '2px 10px', borderRadius: 20 }}>
                {t.reliability}: {mlResult.reliability}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: mlResult.prediction === 'ckd' ? '#fef2f2' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {mlResult.prediction === 'ckd' ? '⚠' : '✓'}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: mlResult.prediction === 'ckd' ? '#dc2626' : '#16a34a' }}>
                  {mlResult.prediction === 'ckd' ? 'CKD likely detected' : 'CKD not detected'}
                </div>
                <div style={{ fontSize: 12, color: '#a8a29e' }}>
                  {Math.round(mlResult.confidence * 100)}% confidence · Based on {mlResult.features_provided} data points
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Explanation */}
        {explanation && (
          <div className="fade-up" style={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{t.explanation}</p>
            <p style={{ fontSize: 15, color: '#44403c', lineHeight: 1.7, margin: 0 }}>{explanation}</p>
          </div>
        )}

        {/* Doctor referral for high/critical */}
        {(risk.level === 'high' || risk.level === 'critical') && (
          <div className="fade-up" style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Recommended Specialist</p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>D</span>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1c1917', marginBottom: 2 }}>Dr. Dedhia</div>
                <div style={{ fontSize: 13, color: '#78716c' }}>Nephrologist · Mumbai</div>
                <div style={{ fontSize: 13, color: '#78716c' }}>Nanavati Hospital & Clinic</div>
              </div>
            </div>
            <a href="tel:+91-XXXXXXXXXX"
              style={{ display: 'block', width: '100%', padding: '14px', background: '#dc2626', color: 'white', borderRadius: 10, textAlign: 'center', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              {t.seeDoctor}
            </a>
          </div>
        )}

        {/* Lab values CTA for medium+ */}
        {(risk.level === 'medium' || risk.level === 'high' || risk.level === 'critical') && (
          <Link href={`/lab-values?answers=${params.get('answers')}&lang=${lang}`}
            style={{ display: 'block', background: 'white', border: '1px solid #e7e5e4', borderRadius: 12, padding: '16px 20px', marginBottom: 20, textDecoration: 'none', textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: '#78716c' }}>🧪 {t.labValues}</span>
          </Link>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <Link href="/" style={{ flex: 1, padding: '12px', border: '1px solid #e7e5e4', borderRadius: 10, textAlign: 'center', textDecoration: 'none', fontSize: 14, color: '#78716c', background: 'white' }}>
            {t.checkAgain}
          </Link>
          <button
            onClick={() => {
              const url = `https://wa.me/?text=${encodeURIComponent(`I just checked my kidney health on KidneyCheck India. Risk level: ${risk.label.en}. Check yours free: kidneycheck.in`)}`
              window.open(url, '_blank')
            }}
            style={{ flex: 1, padding: '12px', background: '#25D366', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, color: 'white', fontWeight: 600 }}>
            {t.shareWhatsApp}
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 12, color: '#a8a29e', textAlign: 'center', lineHeight: 1.6 }}>{t.disclaimer}</p>
      </div>
    </main>
  )
}

'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en')

  const content = {
    en: {
      headline: 'Is your kidney health at risk?',
      sub: '120 million Indians have kidney disease without knowing it. Find out your risk in 60 seconds — free, private, no blood test needed.',
      cta: 'Check My Kidney Health',
      note: 'Takes 60 seconds · Free · No personal data stored',
      stats: ['120M undiagnosed CKD cases in India', '1 nephrologist per 500,000 people', 'CKD has no symptoms until Stage 4'],
      lang: 'Choose Language',
    },
    hi: {
      headline: 'क्या आपकी किडनी स्वास्थ्य खतरे में है?',
      sub: '12 करोड़ भारतीयों को किडनी की बीमारी है और उन्हें पता नहीं। 60 सेकंड में अपना जोखिम जानें — मुफ्त, निजी, बिना खून की जांच के।',
      cta: 'अपनी किडनी की जांच करें',
      note: '60 सेकंड लगते हैं · मुफ्त · कोई डेटा संग्रहीत नहीं',
      stats: ['भारत में 12 करोड़ अज्ञात CKD मामले', 'प्रति 5 लाख लोगों पर 1 नेफ्रोलॉजिस्ट', 'CKD स्टेज 4 तक कोई लक्षण नहीं'],
      lang: 'भाषा चुनें',
    },
    mr: {
      headline: 'तुमच्या मूत्रपिंडाचे आरोग्य धोक्यात आहे का?',
      sub: '12 कोटी भारतीयांना मूत्रपिंडाचा आजार आहे आणि त्यांना माहीत नाही. 60 सेकंदात तुमचा धोका जाणून घ्या — मोफत, खाजगी.',
      cta: 'माझ्या मूत्रपिंडाची तपासणी करा',
      note: '60 सेकंद · मोफत · कोणताही डेटा साठवला जात नाही',
      stats: ['भारतात 12 कोटी अज्ञात CKD रुग्ण', 'प्रति 5 लाख लोकांमागे 1 नेफ्रोलॉजिस्ट', 'Stage 4 पर्यंत CKD चे कोणतेही लक्षण नाही'],
      lang: 'भाषा निवडा',
    },
  }

  const c = content[lang]

  return (
    <main style={{ minHeight: '100vh', background: '#fafaf9' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #e7e5e4', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 16 }}>K</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#1c1917' }}>KidneyCheck</span>
          <span style={{ fontSize: 11, background: '#fde8e8', color: '#dc2626', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>India</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['en', 'hi', 'mr'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid', fontSize: 12, cursor: 'pointer', fontWeight: lang === l ? 600 : 400,
                borderColor: lang === l ? '#dc2626' : '#e7e5e4',
                background: lang === l ? '#fde8e8' : 'white',
                color: lang === l ? '#dc2626' : '#78716c' }}>
              {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'म'}
            </button>
          ))}
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div className="fade-up">
          {/* Warning badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 20, padding: '4px 14px', marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} className="pulse" />
            <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>Free kidney health screening</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, lineHeight: 1.15, color: '#1c1917', marginBottom: 20, letterSpacing: '-0.02em' }}>
            {c.headline}
          </h1>

          <p style={{ fontSize: 17, color: '#57534e', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            {c.sub}
          </p>

          {/* CTA */}
          <Link href={`/screening?lang=${lang}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#dc2626', color: 'white', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none', marginBottom: 16, transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#b91c1c')}
            onMouseLeave={e => (e.currentTarget.style.background = '#dc2626')}>
            {c.cta}
            <span style={{ fontSize: 20 }}>→</span>
          </Link>

          <p style={{ fontSize: 13, color: '#a8a29e', marginBottom: 56 }}>{c.note}</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {c.stats.map((stat, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: 10, padding: '14px 18px' }}>
                <p style={{ fontSize: 13, color: '#78716c', margin: 0, lineHeight: 1.5 }}>{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: 'white', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4', padding: '48px 24px', marginTop: 40 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>How it works</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Answer 10 questions', desc: 'About your age, symptoms, and lifestyle. No blood test needed.' },
              { step: '02', title: 'AI scores your risk', desc: 'ML model trained on real Indian kidney disease patients.' },
              { step: '03', title: 'Get your result', desc: 'Plain language. In Hindi, Marathi, or English. With next steps.' },
            ].map(item => (
              <div key={item.step}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>{item.step}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1c1917', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#78716c', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#a8a29e', margin: 0 }}>
          KidneyCheck is a pre-screening tool — not a medical diagnosis. Always consult a qualified doctor. · <Link href="/admin" style={{ color: '#a8a29e' }}>Clinic Login</Link>
        </p>
      </footer>
    </main>
  )
}

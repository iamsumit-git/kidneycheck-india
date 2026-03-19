import { NextRequest, NextResponse } from 'next/server'
import { QUESTIONS, calculateRisk, Language } from '@/lib/questions'

/**
 * WhatsApp webhook — receives messages from Twilio/WATI
 * Each message advances the user through the 10-question flow
 *
 * To use: configure your Twilio/WATI webhook URL to POST to this endpoint
 */

// In-memory session store (replace with Supabase for production)
const sessions: Record<string, { lang: Language; step: number; answers: Record<string, string> }> = {}

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const from    = body.get('From')?.toString() || ''
  const message = body.get('Body')?.toString().trim() || ''

  let session = sessions[from]

  // New session or restart
  if (!session || message.toLowerCase() === 'restart' || message.toLowerCase() === 'hi' || message === '1') {
    if (!session) {
      sessions[from] = { lang: 'en', step: -1, answers: {} }
      session = sessions[from]
    }

    // Language selection
    if (session.step === -1) {
      return twiml(`Welcome to *KidneyCheck India* 🏥\n\nFree kidney health screening in 60 seconds.\n\nChoose language:\n1. English\n2. हिंदी (Hindi)\n3. मराठी (Marathi)\n\nReply with 1, 2, or 3`)
    }
  }

  // Language selection step
  if (session.step === -1) {
    if (message === '1') { session.lang = 'en'; session.step = 0 }
    else if (message === '2') { session.lang = 'hi'; session.step = 0 }
    else if (message === '3') { session.lang = 'mr'; session.step = 0 }
    else return twiml('Please reply with 1 (English), 2 (Hindi), or 3 (Marathi)')
    return twiml(formatQuestion(0, session.lang))
  }

  const lang = session.lang
  const q    = QUESTIONS[session.step]

  if (!q) return twiml('Session error. Send "Hi" to restart.')

  // Validate answer
  const optIndex = parseInt(message) - 1
  if (isNaN(optIndex) || optIndex < 0 || optIndex >= q.options.length) {
    return twiml(`Please reply with a number between 1 and ${q.options.length}\n\n${formatQuestion(session.step, lang)}`)
  }

  // Save answer and advance
  session.answers[q.id] = q.options[optIndex].value
  session.step++

  // All questions answered
  if (session.step >= QUESTIONS.length) {
    const risk = calculateRisk(session.answers)

    const resultMsg = {
      en: `✅ *Your KidneyCheck Result*\n\nRisk Level: *${risk.label.en}*\nScore: ${risk.score}/143\n\n${risk.recommendation.en}\n\n${risk.level === 'high' || risk.level === 'critical' ? '🏥 *Dr. Dedhia — Nephrologist, Mumbai*\nCall: +91-XXXXXXXXXX\n\n' : ''}⚠️ This is a screening tool, not a diagnosis. See a doctor for confirmation.\n\nSend "Hi" to check again.`,
      hi: `✅ *आपका KidneyCheck परिणाम*\n\nजोखिम स्तर: *${risk.label.hi}*\nस्कोर: ${risk.score}/143\n\n${risk.recommendation.hi}\n\n${risk.level === 'high' || risk.level === 'critical' ? '🏥 *डॉ. देढिया — नेफ्रोलॉजिस्ट, मुंबई*\nकॉल: +91-XXXXXXXXXX\n\n' : ''}⚠️ यह एक स्क्रीनिंग टूल है, निदान नहीं। पुष्टि के लिए डॉक्टर से मिलें।`,
      mr: `✅ *तुमचा KidneyCheck निकाल*\n\nधोका पातळी: *${risk.label.mr}*\nगुण: ${risk.score}/143\n\n${risk.recommendation.mr}\n\n${risk.level === 'high' || risk.level === 'critical' ? '🏥 *डॉ. देढिया — नेफ्रोलॉजिस्ट, मुंबई*\nकॉल: +91-XXXXXXXXXX\n\n' : ''}⚠️ हे एक स्क्रीनिंग साधन आहे, निदान नाही.`,
    }

    delete sessions[from]
    return twiml(resultMsg[lang])
  }

  return twiml(formatQuestion(session.step, lang))
}

function formatQuestion(index: number, lang: Language): string {
  const q = QUESTIONS[index]
  if (!q) return 'Error loading question.'
  const options = q.options.map((o, i) => `${i + 1}. ${o.label[lang]}`).join('\n')
  return `*Question ${index + 1} of ${QUESTIONS.length}*\n\n${q.question[lang]}\n\n${options}`
}

function twiml(message: string) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Message></Response>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'text/xml' } })
}

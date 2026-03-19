import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3-coder:480b-cloud'

export async function POST(req: NextRequest) {
  try {
    const { answers, risk, lang } = await req.json()

    const langName = lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'

    const prompt = `A person completed a kidney health screening in India. Here are their answers and risk score.

Age group: ${answers.age || 'unknown'}
Diabetes: ${answers.diabetes || 'unknown'}
High blood pressure: ${answers.htn || 'unknown'}
Family history of kidney disease: ${answers.family || 'unknown'}
Foot/ankle swelling: ${answers.swelling || 'unknown'}
Unusual fatigue: ${answers.fatigue || 'unknown'}
Urination changes: ${answers.urination || 'unknown'}
Back/side pain: ${answers.back_pain || 'unknown'}
Regular painkiller use: ${answers.painkillers || 'unknown'}
Previous high creatinine in blood test: ${answers.creatinine || 'unknown'}

Risk score: ${risk.score}/143
Risk level: ${risk.level.toUpperCase()}

Write a warm, clear, personal 3-4 sentence explanation in ${langName} that:
1. Acknowledges which specific answers contributed most to their risk
2. Explains what this means for their kidney health in simple words, no medical jargon
3. Gives one specific actionable step they can take this week

Keep it under 80 words. Do NOT repeat the risk level label. Do NOT say I. Start with Your or equivalent in ${langName}. Reply with only the explanation text, no preamble, no thinking tags.`

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 200,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Ollama error:', err)
      return NextResponse.json({ explanation: '' })
    }

    const data = await response.json()

    // Strip <think>...</think> blocks that qwen3 sometimes emits
    let explanation = (data.response || '').trim()
    explanation = explanation.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('Ollama API error:', error)
    return NextResponse.json({ explanation: '' })
  }
}
/**
 * AI Provider abstraction for KidneyCheck
 *
 * Supports:
 *   - Claude API (Anthropic) — cloud, best quality, ~₹0.50/call
 *   - Ollama               — local, free, runs on your machine
 *
 * Set AI_PROVIDER=claude or AI_PROVIDER=ollama in .env.local
 */

type Provider = 'claude' | 'ollama'

const PROVIDER = (process.env.AI_PROVIDER as Provider) || 'claude'

// ── Claude ───────────────────────────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in .env.local')

  // Dynamic import so Ollama-only setups don't need the Anthropic package
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client    = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 250,
    messages:   [{ role: 'user', content: prompt }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

// ── Ollama ───────────────────────────────────────────────────────────────────

async function callOllamaChat(prompt: string): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  const model   = process.env.OLLAMA_MODEL    || 'llama3.2'

  const response = await fetch(`${baseUrl}/api/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        {
          role:    'system',
          content: 'You are a helpful kidney health assistant in India. Give clear, simple explanations in plain language. Never diagnose. Always recommend seeing a doctor for confirmation.',
        },
        { role: 'user', content: prompt },
      ],
      options: { temperature: 0.4, num_predict: 250 },
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama error ${response.status}`)
  }

  const data = await response.json()
  return (data.message?.content || '').trim()
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a kidney health explanation using whichever provider is configured.
 */
export async function generateExplanation(prompt: string): Promise<string> {
  try {
    if (PROVIDER === 'ollama') {
      return await callOllamaChat(prompt)
    }
    return await callClaude(prompt)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    if (PROVIDER === 'ollama') {
      if (message.includes('ECONNREFUSED') || message.includes('fetch failed')) {
        console.error(
          '─── Ollama not running ──────────────────────────────\n' +
          '  1. Install Ollama: https://ollama.com/download\n' +
          `  2. Pull model:     ollama pull ${process.env.OLLAMA_MODEL || 'llama3.2'}\n` +
          '  3. Start Ollama:   ollama serve\n' +
          '─────────────────────────────────────────────────────'
        )
      } else {
        console.error('Ollama error:', message)
      }
    } else {
      console.error('Claude API error:', message)
    }

    return '' // Graceful fallback — results page still works without explanation
  }
}

/**
 * Returns which provider is currently active and its status.
 */
export function getProviderInfo() {
  return {
    provider:    PROVIDER,
    model:       PROVIDER === 'ollama'
                   ? (process.env.OLLAMA_MODEL || 'llama3.2')
                   : 'claude-haiku-4-5-20251001',
    ollama_url:  process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    has_api_key: !!process.env.ANTHROPIC_API_KEY,
  }
}
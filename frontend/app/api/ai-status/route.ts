import { NextResponse } from 'next/server'
import { getProviderInfo } from '@/lib/ai'

/**
 * GET /api/ai-status
 * Open in browser to check which AI provider is active.
 * http://localhost:3000/api/ai-status
 */
export async function GET() {
  const info = getProviderInfo()

  let ollamaReachable = false
  let ollamaModels: string[] = []

  if (info.provider === 'ollama') {
    try {
      const res = await fetch(`${info.ollama_url}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      })
      if (res.ok) {
        const data = await res.json()
        ollamaReachable = true
        ollamaModels = (data.models || []).map((m: { name: string }) => m.name)
      }
    } catch {
      ollamaReachable = false
    }
  }

  const status = {
    provider: info.provider,
    model:    info.model,
    ready:    info.provider === 'claude' ? info.has_api_key : ollamaReachable,

    claude: {
      has_api_key: info.has_api_key,
      note: info.has_api_key
        ? 'API key found'
        : 'Set ANTHROPIC_API_KEY in .env.local',
    },

    ollama: {
      url:       info.ollama_url,
      reachable: ollamaReachable,
      models:    ollamaModels,
      note: ollamaReachable
        ? `Running. ${
            ollamaModels.includes(info.model)
              ? `Model "${info.model}" ready.`
              : `Model "${info.model}" NOT found — run: ollama pull ${info.model}`
          }`
        : 'Not running. Start with: ollama serve',
    },

    switch_provider: {
      to_claude: 'Set AI_PROVIDER=claude in .env.local',
      to_ollama: 'Set AI_PROVIDER=ollama in .env.local, then: ollama serve && ollama pull llama3.2',
    },
  }

  return NextResponse.json(status, { status: status.ready ? 200 : 503 })
}
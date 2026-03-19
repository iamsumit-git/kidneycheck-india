import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const { features } = await req.json()

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    })

    if (!response.ok) throw new Error('ML service error')

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // Graceful fallback — ML service may not be running locally
    console.error('ML service unavailable:', error)
    return NextResponse.json({
      prediction: 'unavailable',
      confidence: 0,
      reliability: 'unavailable',
      features_provided: 0,
      error: 'ML service not running. Start the ml-service with: cd ml-service && python main.py',
    })
  }
}

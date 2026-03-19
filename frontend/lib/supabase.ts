import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

/**
 * Save a completed screening to Supabase.
 * Silently fails if Supabase is not configured (demo mode).
 */
export async function saveScreening(data: {
  answers: Record<string, string>
  risk_score: number
  risk_level: string
  ml_prediction?: string
  ml_confidence?: number
  lang: string
  referral_clicked?: boolean
}) {
  if (!supabase) return null
  try {
    const { error } = await supabase.from('screenings').insert([{
      ...data,
      created_at: new Date().toISOString(),
    }])
    if (error) console.error('Supabase save error:', error)
  } catch (e) {
    console.error('Supabase error:', e)
  }
}

/**
 * SQL to create the screenings table in Supabase:
 *
 * create table screenings (
 *   id          uuid default gen_random_uuid() primary key,
 *   created_at  timestamptz default now(),
 *   answers     jsonb,
 *   risk_score  int,
 *   risk_level  text,
 *   ml_prediction text,
 *   ml_confidence float,
 *   lang        text,
 *   referral_clicked bool default false
 * );
 *
 * -- Row level security: only service role can read
 * alter table screenings enable row level security;
 */

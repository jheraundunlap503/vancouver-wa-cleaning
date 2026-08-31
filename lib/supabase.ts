/**
 * Supabase client. Pinned to 2.25.0 — see CLAUDE.md, never upgrade.
 *
 * Browser only, lead form only. This module must never be imported into a
 * server component or evaluated at render, or the static export breaks.
 * The client is created lazily on first submit so a missing env var cannot
 * throw during the build.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}

export type LeadInput = {
  name: string
  phone: string
  email?: string
  service_type?: string
  zip_code?: string
  message?: string
}

export async function submitLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    return { ok: false, error: 'Form is not connected yet. Please call instead.' }
  }

  const { error } = await supabase.from('leads').insert([input])
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

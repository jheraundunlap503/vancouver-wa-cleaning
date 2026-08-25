'use strict'

/**
 * Anthropic client wrapper for the two-pass content generator.
 *
 * Pass 1 researches and drafts with the server-side web_search tool. The
 * citation allowlist is passed as `allowed_domains`, so the model cannot
 * retrieve a source outside CLAUDE.md's list even if it wanted to.
 *
 * Pass 2 binds each researched claim into the sentence that makes it, then
 * hands off to the deterministic validators. No model grades its own work.
 */

const Anthropic = require('@anthropic-ai/sdk')
const { ALLOWED_DOMAINS } = require('./citations')

const DEFAULT_MODEL = 'claude-opus-5'

/**
 * Server-side refusal fallbacks. On a policy decline the API re-runs the same
 * request on a fallback model inside the same call instead of returning empty.
 */
const FALLBACK_BETA = 'server-side-fallback-2026-07-01'

function client() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and fill it in.')
  }
  return new Anthropic()
}

function textOf(message) {
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
}

/**
 * One request, streamed, with pause_turn resumption.
 *
 * A long web_search turn can stop with stop_reason "pause_turn". Without this
 * loop the answer comes back silently truncated: no error, just less content.
 */
async function run({ model = DEFAULT_MODEL, system, prompt, tools, maxTokens = 32000, effort = 'high' }) {
  const anthropic = client()
  const messages = [{ role: 'user', content: prompt }]

  for (let turn = 0; turn < 12; turn++) {
    const stream = anthropic.beta.messages.stream({
      model,
      max_tokens: maxTokens,
      system,
      messages,
      ...(tools ? { tools } : {}),
      thinking: { type: 'adaptive' },
      output_config: { effort },
      betas: [FALLBACK_BETA],
      fallbacks: 'default',
    })

    const message = await stream.finalMessage()

    if (message.stop_reason === 'refusal') {
      const detail = message.stop_details || {}
      throw new Error(
        `Model declined the request (${detail.category || 'unknown'}). ${detail.explanation || ''}`.trim()
      )
    }

    if (message.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: message.content })
      continue
    }

    if (message.stop_reason === 'max_tokens') {
      throw new Error(`Response hit max_tokens (${maxTokens}). Raise it or split the page.`)
    }

    return { text: textOf(message), message }
  }

  throw new Error('Exceeded the pause_turn resume limit without finishing.')
}

/** Web search restricted to the CLAUDE.md allowlist. */
function webSearchTool(maxUses = 8) {
  return {
    type: 'web_search_20260209',
    name: 'web_search',
    max_uses: maxUses,
    allowed_domains: ALLOWED_DOMAINS,
  }
}

/**
 * Splits the pass 1 response into its draft and its claim manifest.
 * Delimiter parsing rather than structured outputs, because the response also
 * carries server-tool result blocks.
 */
function parseDraftResponse(text) {
  const draftMatch = text.match(/<<<DRAFT>>>([\s\S]*?)<<<\/DRAFT>>>/)
  const manifestMatch = text.match(/<<<MANIFEST>>>([\s\S]*?)<<<\/MANIFEST>>>/)

  if (!draftMatch) throw new Error('Pass 1 response did not contain a <<<DRAFT>>> block.')
  if (!manifestMatch) throw new Error('Pass 1 response did not contain a <<<MANIFEST>>> block.')

  const rawManifest = manifestMatch[1].replace(/^\s*```(?:json)?/, '').replace(/```\s*$/, '').trim()

  let manifest
  try {
    manifest = JSON.parse(rawManifest)
  } catch (err) {
    throw new Error(`Pass 1 manifest was not valid JSON: ${err.message}`)
  }

  if (!Array.isArray(manifest.claims)) {
    throw new Error('Pass 1 manifest is missing a "claims" array.')
  }

  return { draft: draftMatch[1].trim(), manifest }
}

/** Strips any fence the model wrapped the final markdown in. */
function cleanMarkdown(text) {
  const fenced = text.match(/```(?:markdown|md)?\n([\s\S]*?)```/)
  const out = fenced ? fenced[1] : text
  return out.replace(/^<<<[^>]*>>>\s*/gm, '').trim()
}

module.exports = {
  DEFAULT_MODEL,
  client,
  run,
  webSearchTool,
  parseDraftResponse,
  cleanMarkdown,
  textOf,
}

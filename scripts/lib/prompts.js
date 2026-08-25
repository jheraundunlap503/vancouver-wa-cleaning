'use strict'

/**
 * Prompt construction for both passes.
 *
 * The house style rules live here in one place. If CLAUDE.md changes, change
 * this file and the validators together, never one without the other.
 */

const { ALLOWED_DOMAINS, MIN_CITATIONS } = require('./citations')
const { BANNED_WORDS, DESC_MIN, DESC_MAX, FAQ_MIN } = require('./validators')

const HOUSE_STYLE = `
VOICE
You are writing for a homeowner in Vancouver, Washington who is comparison shopping
for a house cleaner right now. They have a specific problem and a browser full of tabs.

HARD RULES, every one of these is checked by an automated validator that will
reject the page:
- No em-dashes and no en-dashes anywhere. Use a comma, a period, or rewrite.
- No exclamation marks anywhere.
- Never use these words: ${BANNED_WORDS.join(', ')}.
- Pain before offer. Open with what the reader is dealing with, not what the service is.
- The first sentence of the first paragraph contains the primary keyword.
- No company history, no founding date, no "for over X years" in the opening paragraph.
- Write in plain declarative sentences. Specific beats impressive.

STRUCTURE
- The body starts at H2. Never write an H1, it comes from frontmatter.
- Top two thirds of the page is macro semantics: the money service terms, what the
  job covers, how it works, what it costs.
- Bottom third is micro semantics: local context, seasonal detail, pricing nuance, FAQ.
`.trim()

const CITATION_RULES = `
CITATIONS
You may cite these domains and no others:
${ALLOWED_DOMAINS.map((d) => `  - ${d}`).join('\n')}

- Minimum ${MIN_CITATIONS} citations per page. More is better where a real claim needs support.
- Every citation is a contextual inline markdown link inside the sentence that makes
  the claim. Never a "Sources" section, never a bare URL on its own line.
  Good:  Washington law gives landlords [30 days to return a deposit](https://app.leg.wa.gov/rcw/default.aspx?cite=59.18.280) after the tenant moves out.
  Bad:   Landlords have 30 days to return a deposit. Source: https://app.leg.wa.gov/...
- Only cite a page you actually retrieved with web_search. Never invent a URL,
  never guess a deep link, never cite a page you did not open.
- If you cannot support a claim from the allowed domains, cut the claim.
`.trim()

/** Pass 1: research and draft, web search on. */
function draftPrompt({ keyword, pageType, brief, extraRequirements }) {
  return `
Research and draft the body copy for a page targeting the keyword "${keyword}".

Page type: ${pageType}

${brief}

${extraRequirements ? `PAGE SPECIFIC REQUIREMENTS\n${extraRequirements}\n` : ''}
${HOUSE_STYLE}

${CITATION_RULES}

RESEARCH FIRST
Use web_search to find real, current sources on the allowed domains before you
write anything. Search for the specific facts you intend to state. If a search
returns nothing usable, pick a different claim rather than writing an unsupported one.

OUTPUT FORMAT
Return exactly two blocks and nothing else.

<<<DRAFT>>>
The markdown body. Starts at H2. No frontmatter, no H1.
<<</DRAFT>>>

<<<MANIFEST>>>
{
  "claims": [
    {
      "claim_id": "c1",
      "sentence": "the exact sentence from the draft that makes this claim",
      "url": "the exact URL you retrieved",
      "domain": "the hostname",
      "supports": "one line on what this source actually says"
    }
  ]
}
<<</MANIFEST>>>
`.trim()
}

/** Pass 2: bind citations inline, no tools. */
function bindPrompt({ keyword, draft, manifest }) {
  return `
Below is a draft page targeting "${keyword}" and a manifest of researched claims.

Your job is mechanical. Rewrite the draft so that every claim in the manifest carries
its citation as a contextual inline markdown link, placed inside the sentence that
makes the claim. Choose anchor text that describes what is being cited, three to
eight words, reading naturally inside the sentence.

Do not add new claims. Do not add new URLs. Do not remove content. Do not create a
"Sources" section. Do not reorder sections.

Re-check the whole result against these rules and fix any violation you find:

${HOUSE_STYLE}

DRAFT
${draft}

MANIFEST
${JSON.stringify(manifest, null, 2)}

Return only the finished markdown body. No preamble, no fences, no commentary.
`.trim()
}

/** Pass 2b: title, meta description, and FAQ block as strict JSON. */
function metaPrompt({ keyword, titleKeyword, body, faqCount = FAQ_MIN + 2 }) {
  return `
Here is the finished body copy for a page targeting "${keyword}".

Produce the page metadata. Return only a JSON object, no fences, no commentary:

{
  "description": "meta description, between ${DESC_MIN} and ${DESC_MAX} characters inclusive, names the service and Vancouver, ends with a soft call to action, no exclamation marks, no em-dashes",
  "faqs": [
    { "q": "question a real searcher types", "a": "answer in 2 to 4 plain sentences" }
  ]
}

Rules:
- Exactly ${faqCount} FAQ entries.
- Questions must be things someone actually searches, not marketing prompts.
- Answers contain no em-dashes, no en-dashes, no exclamation marks, and none of
  these words: ${BANNED_WORDS.join(', ')}.
- Count the description characters before returning. ${DESC_MIN} to ${DESC_MAX} is a hard range.

The title tag is generated automatically as "${titleKeyword} in Vancouver, WA | Vancouver WA House Cleaning".
Do not return a title.

BODY
${body}
`.trim()
}

/** Location research, verbatim intent from CORE/brain.md. */
function locationResearchPrompt(suburb) {
  return `
Research ${suburb}, Washington for a house cleaning service website.

Verifiable local data needed: median household income, average home value, housing
stock type, rental versus owner-occupied percentage, HOA density, conditions relevant
to cleaning demand, and 3 Google Maps recognized landmarks.

Do not invent data. Flag anything uncertain explicitly with the word UNCERTAIN so a
human can check it. Prefer census.gov, clark.wa.gov, cityofvancouver.us, and
columbian.com. Cite the URL you retrieved next to each figure.

Return markdown with one H2 per data category. This file is a research artifact for a
human and for the content generator. It is never published.
`.trim()
}

module.exports = {
  HOUSE_STYLE,
  CITATION_RULES,
  draftPrompt,
  bindPrompt,
  metaPrompt,
  locationResearchPrompt,
}

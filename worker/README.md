# bilal-ai-proxy

Cloudflare Worker that sits between the portfolio's AI search box and the Gemini
API, so the API key lives on Cloudflare instead of in the page every visitor
downloads.

## Why

The key used to ship in `config.js`, base64-wrapped. Base64 is encoding, not
encryption — anyone could `curl bilalshihab.com/config.js` and decode it. Any key
reachable by front-end JavaScript is public by definition, so the fix is to move
it somewhere the browser can't see.

## What it protects

- **Key never leaves Cloudflare.** Stored as an encrypted secret, injected as
  `env.GEMINI_API_KEY` at runtime, sent to Google in a header (not a query
  string, so it stays out of URLs and logs).
- **Origin allowlist.** Requests without an approved `Origin` get a 403 before
  any upstream call.
- **Server-side system prompt.** The endpoint takes a `question` string and
  nothing else — the knowledge base is injected here. It can't be repurposed as
  a free general-purpose LLM.
- **Per-IP rate limit** (8/min) and a 500-character cap on questions.
- **Opaque errors.** Upstream failures are translated, never forwarded, so
  Google's error bodies can't leak project details.

## Deploy

```bash
cd worker
npx wrangler login                     # one-time browser auth
npx wrangler secret put GEMINI_API_KEY  # paste the key at the prompt
npx wrangler deploy
```

Deploy prints the URL — something like
`https://bilal-ai-proxy.<subdomain>.workers.dev`. That value goes into
`AI_ENDPOINT` in `index.html`.

## Rotating the key

```bash
npx wrangler secret put GEMINI_API_KEY   # overwrites the old value
```

No redeploy needed, no site change.

## Editing the knowledge base

`src/context.js` holds everything the assistant knows. Edit and redeploy:

```bash
npx wrangler deploy
```
